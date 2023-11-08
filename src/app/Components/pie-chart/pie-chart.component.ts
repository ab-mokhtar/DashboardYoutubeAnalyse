import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { ChannelsService } from 'src/app/Services/channels.service';
declare var SockJS:any;
declare var Stomp:any;
import {environment} from '../../environments/environment';
import { WebSocketService } from 'src/app/Services/web-socket.service';
@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {
  public chart: any;
  constructor(private channelService:ChannelsService,private sockServ:WebSocketService) { }
public categories:any[]=[];
public stompClient:any;

ngOnInit(): void {
    
    this.channelService.getTodayCateg().subscribe(
      data=>{
        this.categories=data
        console.log(this.categories.length)
        this.createChart();
      },
      error=>{console.log(error.message)}
    );
     this.initializeWebSocketConnection();

  }
  
  createChart() {
    if(this.chart != undefined){
      this.chart.destroy();

    }
    
    
    let labelsChannels = this.categories
    .map(categ => categ.id.categoryid); 
  let alldata:any=this.categories
  .map(categ => categ.nbvideo);
 console.log(labelsChannels);
 console.log(alldata);
 let colors=this.categories.map(categ=> {
   const seed = categ.id.categoryid;
  const random = (seed * 9301 + 49297) % 233280;
  const randomValue = random / 233280;
  
  return `rgb(
    ${Math.floor(Math.random() * 256)},
    ${Math.floor(randomValue * 256)},
    ${Math.floor(Math.random() * 256)})`;});
 
    this.chart = new Chart("PieChart", {
      type: 'pie',
      data: {
        labels: labelsChannels,
        datasets: [{
          label: 'Nombre de videos',
          data: alldata,
          backgroundColor:colors,
          hoverOffset: 4
        }]
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
      that.stompClient.subscribe('/topic/categories/today', (message:any) => {
        if (message.body) {
          //console.log(message.body)
          that.categories=JSON.parse(message.body);
          console.log(that.categories);
          //that.sockServ.sendMessage("categories");

          that.createChart()

        }
      });
    });
   }
}






