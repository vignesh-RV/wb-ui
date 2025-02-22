import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class NSEService {
  constructor(private api: ApiService) { }

  getNseData(indexName: string) {
    return this.api.handleRequest('post', '/nse/getStockData', null, {index: indexName});
  }
}


