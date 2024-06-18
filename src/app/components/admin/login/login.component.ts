import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '@env';
import { RequestsService } from '@services/requests.service';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  user:string = ""
  password:string = ""
  wrongField = 0
  timerSub: Subscription | undefined
  constructor(private req:RequestsService, private router: Router){}
  login(){
    this.req.Post(`${environment.apiUrl}/user/login`,{user:this.user, password: this.password}).subscribe((data)=>{
      if(data){
        this.router.navigate(["admin","profile"])
      }
    },
    error => {
      this.wrongField = error.error.field
      if(this.timerSub){
        this.timerSub.unsubscribe()
      }
      this.timerSub = timer(1000).subscribe(()=>{
        this.wrongField = 0
      })
  })
  }
}
