import { Component } from '@angular/core';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'wb-ui';

  get showLoader(): boolean {
    return this.api.loaderCount > 0 ? true : false
  }

  constructor(private api: ApiService) { }
}
