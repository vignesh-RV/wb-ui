export interface Post {
    id: number;
    title: string;
    content: string;
    postedBy: User;
    createdDate: Date;
    upvotes: number;
    downvotes: number;
    shareCount: number;
    comments: any;
}

export interface User {
    firstName: string;
    lastName?: string;
    email: string;
    phoneNumber: string;
    password: string;
    profileImage: string;
  }