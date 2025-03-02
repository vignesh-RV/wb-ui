import { Component, Input, OnInit } from '@angular/core';
import { Comment, Post } from '../dto/models';

import Quill from 'quill';
import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';
import { NSEService } from '../services/nse.service';

declare const $: any;
declare var Swiper: any;

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {

  @Input('post') post:Post = {post_id: 0, title: '', content: '', createdDate: new Date(), upvotes: 0, downvotes: 0, postedBy: {firstName: '', lastName: '', profileImage: '', email: '', phoneNumber: '', password: ''}, shareCount: 0, comments: []};

  newComments:Comment[] = [];

  get date():Date{
    return new Date();
  }

  constructor(public auth: AuthService, private api: ApiService, private nse: NSEService) {
   
  }

  

  ngOnInit(): void {
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

  createComment(post:any, parent_comment_id: undefined | number, comment:String) {
    let data = {content: comment, post_id: post.post_id, parent_comment_id: parent_comment_id};
    this.api.handleRequest('post', '/api/posts/saveComment', null, data).then((res: any) => {
      if (res) {
        this.resetComments();
        this.fetchAllComment(post.post_id);
      }else{
        this.api.error("Failed to create a post..");
      }
    })
  }

  fetchAllComment(post_id:undefined | number) {
    if(!post_id) return;
    this.api.handleRequest('get', '/api/posts/fetchComments/'+post_id).then((res: any) => {
      if (res) {
        this.post.comments = res;
      }
    })
  }
}
