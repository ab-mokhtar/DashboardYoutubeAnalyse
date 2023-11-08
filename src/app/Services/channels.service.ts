import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ChannelsService {
  private Channel_API_URL = 'http://localhost:9090/channels';
  private CategorieApi = "http://localhost:9090/categories";

  constructor(private httpClient : HttpClient) {

   }
   getAllChannels() : Observable<any[]>{
    return this.httpClient.get<any>("http://localhost:9090/channels");
  }
  getAllCateg() : Observable<any[]>{
    return this.httpClient.get<any>(this.CategorieApi);
  }
  getTodayCateg() : Observable<any[]>{
    return this.httpClient.get<any>(this.CategorieApi+"/Today");
  }
}
