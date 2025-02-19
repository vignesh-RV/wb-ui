import { Component, OnInit } from '@angular/core';
import { Post } from '../dto/models';

import Quill from 'quill';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  posts:Post[] = [
    {
      title: 'Reflection',
      content: `            1. My parents were together for 55 years. One morning, my mom had a heart attack while going downstairs to make breakfast. My dad did his best to lift her and rushed her to the hospital, disregarding traffic signals. Unfortunately, by the time they got there, she had passed away.

                            2. At the funeral, my dad didn’t speak much, he was quiet and barely cried.
                            
                            3. Later that night, we gathered together, and my dad asked my brother, a theologian, about where mom might be now. We discussed life after death, but then my dad insisted we go to the cemetery. We hesitated, saying it was too late, but he firmly said, "Don’t argue with the man who just lost his wife of 55 years."`,
      id: 1,
      postedBy: {
        firstName: 'Vignesh',
        lastName :  'R',
        email: 'Vignesh@123',
        phoneNumber: '23232323',
        password: '2323232',
        profileImage: '/assets/images/Profile-image.jfif'
      },
      createdDate: new Date(),
      upvotes: 3,
      downvotes: 19,
      shareCount: 1,
      comments: []
    }
  ];

  showPostPopUp:boolean = false;

  quill:any = null;

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

  constructor(private auth: AuthService) { 
    this.posts = new Array(20).fill(this.posts[0]);
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.quill = new Quill('#qui-editor',{modules: {
      toolbar: this.toolbarOptions
    },theme: 'snow'})
  }

  createPost() {
    this.showPostPopUp = false;
    this.posts.splice(0,0,{
      title: 'Reflection ' +new Date().getTime(),
      content: this.quill.root.innerHTML,
      id: 1,
      postedBy: {
        firstName: 'Vignesh',
        lastName :  'R',
        email: 'Vignesh@123',
        phoneNumber: '23232323',
        password: '2323232',
        profileImage: '/assets/images/Profile-image.jfif'
      },
      createdDate: new Date(),
      upvotes: 3,
      downvotes: 19,
      shareCount: 1,
      comments: []
    });
  }

  logout() {
    this.auth.doLogout();
  }
}
