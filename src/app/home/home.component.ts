import { Component, OnInit } from '@angular/core';
import { Post } from '../dto/models';

import Quill from 'quill';
import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  posts:Post[] = [];

  newPosts:Post[] = [];

  showPostPopUp:boolean = false;
  showProfile:boolean = false;
  userProfileImage:any = '';

  get profileImage(): string {
    return this.userProfileImage || this.auth.currentUser.profile_image || '/assets/images/profile-image-placeholder.png';
  }

  quill:any = null;

  minimalToolbar = [[ 'image', 'link', 'bold', 'italic', 'underline', 'strike'] ];
 toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],
    ['link', 'image', 'video', 'formula'],
  
    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction
  
    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  
    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],
  
    ['clean']                                         // remove formatting button
  ];

  constructor(public auth: AuthService, private api: ApiService) {
    this.resetPost();
    this.fetchAllPosts();
  }

  fetchAllPosts() {
    this.api.handleRequest('get', '/api/posts/all').then((res: any) => {
      if (res) {
        this.posts = res;
      }
    })
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.inititalizeEditor(this.minimalToolbar);
  }

  inititalizeEditor(toolbarOptions:any) {
    this.quill = new Quill('#qui-editor',{modules: {
      toolbar: toolbarOptions
    },theme: 'snow'})
  }

  createPost() {
    let data = {content: this.quill.root.innerHTML, title: this.newPosts[0].title};
    this.api.handleRequest('post', '/api/posts', null, data).then((res: any) => {
      if (res) {
        this.resetPost();
        this.fetchAllPosts();
      }else{
        this.api.error("Failed to create a post..");
      }
    })
  }

  resetPost() {
    this.newPosts = [{
      title: '',
        content: ``,
        id: 1,
        postedBy: {
          firstName: this.auth.currentUser.first_name,
          lastName :  this.auth.currentUser.last_name,
          password: '',
          email: this.auth.currentUser.email,
          phoneNumber: this.auth.currentUser.phone_number,
          profileImage: this.auth.currentUser.profile_image || '/assets/images/Profile-image.jfif'
        },
        createdDate: new Date(),
        upvotes: 0,
        downvotes: 0,
        shareCount: 0,
        comments: []
    }];
  }

  logout() {
    this.auth.doLogout();
  }


  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;

    if (fileInput?.files?.length) {
      const file = fileInput.files[0];

      // Use FileReader to read the image file and convert it to base64
      const reader = new FileReader();

      reader.onload = () => {
        // This is where the base64 string of the image is set
        this.userProfileImage = reader.result as string;
        this.updateUserData('profile_image', this.userProfileImage);
      };

      reader.readAsDataURL(file); // Read the file as a Data URL (Base64 format)
    }
  }


  updateUserData(key:string, value:any) {
    let data = {key: key, value: value};
    this.api.handleRequest('put', '/api/user/updateData', null, data).then((res: any) => {
      if (res) {
        this.api.info("Data updated successfully");
      }else{
        this.api.error("Failed to update data");
      }
    })
  }
  
  updateVote(post:any, value:any) {
    let data = {post_id: post.post_id, vote_type: value == 1 ? 'UP' : 'DOWN'};
    this.api.handleRequest('post', '/api/posts/updateVote', null, data).then((res: any) => {
      if (res) {
        this.fetchAllPosts();
      }else{
        this.api.error("Failed to update data");
      }
    })
  }
}
