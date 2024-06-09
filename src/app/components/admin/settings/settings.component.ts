import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { environment } from '@env';
import { BgService } from '@services/bg.service';
import { RequestsService } from '@services/requests.service';
interface bg {
  id: number;
  path: string;
  status: boolean;
  createdAt:string
}
@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  backgrounds$ = this.bgService.getBackgrounds();
  constructor(
    private readonly req:RequestsService,
    private bgService: BgService
  ){}
  trackByFn(index: number, item: any) {
    return item.id; // Предполагается, что у вас есть уникальный идентификатор для каждого элемента списка
  }
  uploadBgFile(e: any): void {
    const fileList: FileList = e.target.files;
    if (fileList.length < 1) {
      return;
    }
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      this.bgService.uploadBackground(file).subscribe(() => {
        e.target.value = "";
        console.log(`Background ${file.name} uploaded`);
      });
    }
  }
  toggleBackgroundStatus(bg: bg): void {
    this.bgService.updateBackgroundStatus(bg.id, !bg.status).subscribe(() => {
      console.log(`Background with id ${bg.id} status updated to ${!bg.status}`);
    });
  }
  deleteBackground(id: number): void {
    this.bgService.deleteBackground(id).subscribe(() => {
      console.log(`Background with id ${id} deleted`);
    });
  }
}
