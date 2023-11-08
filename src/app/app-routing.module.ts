import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { WebsocketComponent } from './Components/websocket/websocket.component';

const routes: Routes = [
  { path: '', component:AppComponent },
  {path:'ws',component:WebsocketComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
