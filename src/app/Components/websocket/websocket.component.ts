import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import SockJS from 'sockjs-client';
import { WebSocketService } from 'src/app/Services/web-socket.service';
import * as Stomp from 'stompjs';

@Component({
  selector: 'app-websocket',
  templateUrl: './websocket.component.html',
  styleUrls: ['./websocket.component.css']
})
export class WebsocketComponent  {
  title = 'websocket-frontend';
  input!:string;
  constructor(public messageService: WebSocketService) {}
  sendMessage() {
    if (this.input) {
      this.input = '';
    }
  }
}