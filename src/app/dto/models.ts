export interface Post {
    post_id: undefined | number;
    title: string;
    content: string;
    postedBy: User;
    createdDate: Date;
    upvotes: number;
    downvotes: number;
    shareCount: number;
    comments: any;
    commentCount?: number;
    showComments?: boolean;
}

export interface User {
    user_id?: number;
    firstName: string;
    lastName?: string;
    email: string;
    phoneNumber: string;
    password: string;
    password_last_modified_date?: Date;
    password_history?: any[];
    profileImage: string;
  }

export interface Comment {
    comment_id?: undefined | number;
    post_id: null | number;
    content: string;
    postedBy: User;
    createdDate?: Date;
    parent_comment_id?: number;
}