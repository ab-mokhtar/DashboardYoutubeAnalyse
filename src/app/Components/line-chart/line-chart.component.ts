import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { filter } from 'rxjs';
import { ChannelsService } from 'src/app/Services/channels.service';
declare var SockJS:any;
declare var Stomp:any;
import {environment} from '../../environments/environment';
import { WebSocketService } from 'src/app/Services/web-socket.service';
@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit {
  public chart!: Chart;
  constructor(private channelService:ChannelsService,private sockServ:WebSocketService) { }
  
public categories:any[]=[];
public stompClient:any;

ngOnInit(): void {
    
    this.channelService.getAllCateg().subscribe(
      data=>{
        this.categories=data
        console.log(this.categories.length)
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
    
    let labelsChannels = this.categories
    .map(categ => categ.id.date)
    .filter((date, index, self) => self.indexOf(date) === index).sort();
  let alldata=[]
  let tab=[]
  for (let index = 0; index < this.categories.length; index++) {
    tab=[]
    const categoryIdToFilter = this.categories[index].id.categoryid;
    tab = this.categories
    .filter(x => x.id.categoryid === categoryIdToFilter)
    .sort((a, b) => a.id.date.localeCompare(b.id.date)) // Trie par id.date
    .map(x => x.nbvideo);
      let data = {
      label: this.categories[index].id.categoryid ,
      data: tab,
     
    };
    alldata.push(data);
        
      }

      console.log("alldata"+alldata.length)
     

      console.log(alldata)
      
        
      const filteredData = [];

for (let i = 0; i < alldata.length; i++) {
  let isDuplicate = false;

  for (let j = 0; j < filteredData.length; j++) {
    if (alldata[i].label === filteredData[j].label) {
      isDuplicate = true;
      break;
    }
  }

  if (!isDuplicate) {
    filteredData.push(alldata[i]);
  }
}
alldata=filteredData
   console.log(alldata)

    this.chart = new Chart("CategoriesChart", {
      type: 'line',
      data: {
        labels: labelsChannels,
        datasets: alldata
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
      that.stompClient.subscribe('/topic/categories', (message:any) => {
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






