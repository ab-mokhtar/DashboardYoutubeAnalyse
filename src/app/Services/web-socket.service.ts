import { Injectable } from '@angular/core';
declare var SockJS:any;
declare var Stomp:any;
import {environment} from '../environments/environment';
import { Message } from 'stompjs';
@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  constructor() {
    this.initializeWebSocketConnection();
  }
  public stompClient:any;
  public msg:any=[];
  initializeWebSocketConnection() {
    const serverUrl = environment.app_url;
    console.log(serverUrl);
    const ws = new SockJS(serverUrl);
    this.stompClient = Stomp.over(ws);
    const that = this;
    // tslint:disable-next-line:only-arrow-functions
    this.stompClient.connect({}, function(frame:any) {
      that.stompClient.subscribe('/topic', (message:any) => {
        if (message.body) {
          //console.log(message.body)
          that.msg=JSON.parse(message.body);
          console.log(that.msg);
          
        }
      });
    });
  }

  sendMessage(topic:any) {
    this.stompClient.send('/app/send/'+topic , {});
    
  }
}