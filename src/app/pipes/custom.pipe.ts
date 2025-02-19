import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'postTime'
})
export class PostTimePipe implements PipeTransform {

  transform(date: any ): unknown {
    const now:any = new Date();
    const diffInSeconds = Math.floor((now - (new Date(date) as any)) / 1000); // Difference in seconds
  
    const seconds = diffInSeconds;
    const minutes = Math.floor(diffInSeconds / 60); // Difference in minutes
    const hours = Math.floor(diffInSeconds / 3600); // Difference in hours
    const days = Math.floor(diffInSeconds / 86400); // Difference in days
    const months = Math.floor(diffInSeconds / 2592000); // Difference in months (30 days)
    const years = Math.floor(diffInSeconds / 31536000); // Difference in years (365 days)
  
    if (years > 1) {
      return `${years} years ago`;
    } else if (years === 1) {
      return "1 year ago";
    } else if (months > 1) {
      return `${months} months ago`;
    } else if (months === 1) {
      return "1 month ago";
    } else if (days > 1) {
      return `${days} days ago`;
    } else if (days === 1) {
      return "Yesterday";
    } else if (hours > 1) {
      return `${hours} hours ago`;
    } else if (hours === 1) {
      return "1 hour ago";
    } else if (minutes > 1) {
      return `${minutes} minutes ago`;
    } else if (minutes === 1) {
      return "1 minute ago";
    } else if (seconds > 1) {
      return `${seconds} seconds ago`;
    } else {
      return "Just now";
    }
  }

}
