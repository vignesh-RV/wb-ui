import { Component, OnInit } from '@angular/core';
import { Comment, Post } from '../dto/models';

import Quill from 'quill';
import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';
import { NSEService } from '../services/nse.service';
import { ActivatedRoute } from '@angular/router';

declare const $: any;
declare var Swiper: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  posts:Post[] = [];

  newPosts:Post[] = [];
  newComments:Comment[] = [];

  showPostPopUp:boolean = false;
  showProfile:boolean = false;
  userProfileImage:any = '';

  userstats:any = {
    followers: 0,
    followings: [],
    posts: 0
  };

  get profileImage(): string {
    return this.userProfileImage || this.auth.currentUser.profile_image || '/assets/images/profile-image-placeholder.png';
  }

  get isPostEnabled(): boolean{
    if( this.quill ) {
      var tempDiv:any = document.createElement('div');
      tempDiv.innerHTML = this.quill.root.innerHTML;
      return tempDiv.textContent.trim().length > 0;
    }
    return false;
  }

  get date():Date{
    return new Date();
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

  requiredIndexes:any = [{name: "NIFTY 50"},{name: "Nifty Financial Services"},{name: "NIFTY 500"},{name: "NIFTY Bank"},
    {name: "NIFTY 100"},{name: "NIFTY 200"},{name: "NIFTY Next 50"},{name: "NIFTY Midcap 150"}]
    
  constructor(public auth: AuthService, private api: ApiService, private nse: NSEService, private route: ActivatedRoute) {
    this.getStocks();
    this.resetComments();
    this.resetPost();
    this.route.url.subscribe(url => { if(url[0]['path'] == 'home') this.fetchAllPosts() });
  }

  fetchAllPosts() {
    this.api.handleRequest('get', '/api/posts/all').then((res: any) => {
      if (res) {
        this.posts = res;
      }
    })
  }

  async getStocks() {
    for(let i = 0; i < this.requiredIndexes.length; i++) {
      let stocks = await this.nse.getNseData(this.requiredIndexes[i]['name']);
      console.dir(stocks);
      stocks['data']['change'] = parseFloat(stocks['data']['change']).toFixed(2);
      this.requiredIndexes[i]['data'] = stocks;
    }
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      let post_id:any = params.get('id');
      this.getPostData(post_id);
    });

    this.getUserStats();
  }

  ngAfterViewInit() {
    this.inititalizeEditor(this.minimalToolbar);

    new Swiper('.swiper', {
      spaceBetween: 10,
      className: 'mySwiper',
      direction: 'vertical',
      loop: true,
      autoplay: { delay: 3000 },
      navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
      slidesPerView: 3
    });
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

  resetComments() {
    this.newComments = [{
      post_id: null,
      content: ``,
      createdDate: new Date(),
      postedBy: {
        firstName: this.auth.currentUser.first_name,
        lastName :  this.auth.currentUser.last_name,
        password: '',
        email: this.auth.currentUser.email,
        phoneNumber: this.auth.currentUser.phone_number,
        profileImage: this.auth.currentUser.profile_image || '/assets/images/Profile-image.jfif'
      }
    }];
  }

  resetPost() {
    if(this.quill) this.quill.root.innerHTML = '';
    this.newPosts = [{
      title: '',
        content: ``,
        post_id: undefined,
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

  createComment(post:any,postInd:number, parent_comment_id: undefined | number, comment:String) {
    let data = {content: comment, post_id: post.post_id, parent_comment_id: parent_comment_id};
    this.api.handleRequest('post', '/api/posts/saveComment', null, data).then((res: any) => {
      if (res) {
        this.resetComments();
        this.fetchAllComment(post.post_id, postInd);
      }else{
        this.api.error("Failed to create a post..");
      }
    })
  }

  fetchAllComment(post_id:undefined | number, post_index:number) {
    if(!post_id) return;
    this.api.handleRequest('get', '/api/posts/fetchComments/'+post_id).then((res: any) => {
      if (res) {
        this.posts[post_index].comments = res;
      }
    })
  }

  updateFollowers(follower_id:number | undefined){
    if(follower_id == undefined) return;
    let data = {follower_id: follower_id};
    this.api.handleRequest('post', '/api/user/followers', null, data).then((res: any) => {
      if (res) {
        this.getUserStats();
      }
    })
  }

  getUserStats(){
    this.api.handleRequest('get', '/api/user/stats').then((res: any) => {
      if (res) {
        this.userstats = res.stats;
      }
    })
  }

  getPostData(post_id: null | number){
    if(!post_id) return;
    this.api.handleRequest('get', '/api/posts/id/'+post_id).then((res: any) => {
      if (res) {
        this.posts = [res];
      }
    })
  }

  copyToClipboard(post: any) {
    let sharableUrl = window.location.origin + '/post/' + post.post_id;
    navigator.clipboard.writeText(sharableUrl).then(() => {
      this.api.info("LinkCopied to clipboard");
      let message:any = document.getElementById("copyMessage_"+post.post_id);
      if(!message) return;
      message.innerHTML = "Link Copied to clipboard";
      message.style.display = "inline";
      setTimeout(() => (message.style.display = "none"), 2000);

    }).catch(err => {
      console.error("Failed to copy: ", err);
    });
  }
}
