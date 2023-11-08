import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { ChannelsService } from 'src/app/Services/channels.service';
import { WebSocketService } from 'src/app/Services/web-socket.service';
declare var SockJS:any;
declare var Stomp:any;
import {environment} from '../../environments/environment';
@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {
  public chart: any;
  constructor(private channelService:ChannelsService,public sockServ:WebSocketService) { }
public channels:any[]=[];
public stompClient:any;
  async ngOnInit() {
  
    this.channelService.getAllChannels().subscribe(
      data=>{
        this.channels=data
        console.log(this.channels.length)
        this.createChart();
      },
      error=>{console.log(error.message)}
    ) 
    this.initializeWebSocketConnection();

  }
  createChart() {
    if(this.chart != undefined){
      this.chart.destroy();

    }
    let labelsChannels = this.channels.map(channel => channel.title);
    let tab=this.channels.map(channel=>channel.subscribercount)
    let data = {
      label: "subscribes",
      data: tab,
      backgroundColor: 'blue'
    };
    
   
    console.log(this.channels);

    this.chart = new Chart("MyChart", {
      type: 'bar',
      data: {
        labels: labelsChannels,
        datasets: [data]
      },
      options: {
        aspectRatio: 2
      }
    });
  }
  
  initializeWebSocketConnection() {
    const serverUrl = environment.app_url;
    console.log(serverUrl);
    const ws = new SockJS(serverUrl);
    this.stompClient = Stomp.over(ws);
    const that = this;
    // tslint:disable-next-line:only-arrow-functions
    this.stompClient.connect({}, function(frame:any) {
      that.stompClient.subscribe('/topic/channels', (message:any) => {
        if (message.body) {
          //console.log(message.body)
          that.channels=JSON.parse(message.body);
          console.log(that.channels);
          //that.sockServ.sendMessage("channels");

          that.createChart()

        }
      });
    });
   }
}






