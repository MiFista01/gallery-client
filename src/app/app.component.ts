import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { RequestsService } from '@services/requests.service';
import { environment } from '@env';
import { CommonModule } from '@angular/common';
import { interval } from 'rxjs';
import { BgService } from '@services/bg.service';
interface bg {
  path: string
  status: boolean
}
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  activeBg: bg[] = []
  activeBgNumb = 0
  constructor(private bgService: BgService) { }
  ngOnInit(): void {
    this.bgService.getActiveBackgrounds().subscribe(data => {
      this.activeBg = data;
      if (this.activeBgNumb == this.activeBg.length - 1) {
        this.activeBgNumb = this.activeBg.length - 2
      }
    });

    interval(60 * 1000).subscribe(() => {
      if (this.activeBgNumb < this.activeBg.length - 1) {
        this.activeBgNumb++;
      } else {
        this.activeBgNumb = 0;
      }
    });
  }
  // ngOnInit(): void {
  //   this.req.Get<bg[]>(`${environment.apiUrl}/background-img`).subscribe(data => {
  //     this.activeBg = data.filter(
  //       (val) => {
  //         val.path = `${environment.apiUrl}/static/imgs/bg/${val.path}`
  //         return val.status == true
  //       })
  //   })
  //   interval(60 * 1000).subscribe(() => {
  //     if (this.activeBgNumb < this.activeBg.length - 1) {
  //       this.activeBgNumb++;
  //     } else {
  //       this.activeBgNumb = 0;
  //     }
  //   });
  // }
}
