import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '@env';
import { map, tap } from 'rxjs/operators';
import { RequestsService } from './requests.service';

interface bg {
  id: number;
  path: string;
  status: boolean;
  createdAt:string
}

@Injectable({
  providedIn: 'root'
})
export class BgService {
  private bgSubject = new BehaviorSubject<bg[]>([]);
  private activeBgSubject = new BehaviorSubject<bg[]>([]);

  constructor(private req: RequestsService) {
    this.loadBackgrounds();
  }

  private loadBackgrounds() {
    this.req.Get<bg[]>(`${environment.apiUrl}/background-img`).pipe(
      map(data => data.map(bg => ({ ...bg, path: `${environment.apiUrl}/static/imgs/bg/${bg.path}` }))),
      tap(data => {
        this.bgSubject.next(data);
        this.updateActiveBackgrounds(data);
      })
    ).subscribe();
  }

  uploadBackground(file: File): Observable<void> {
    const formData: FormData = new FormData();
    formData.append('uploadImage', file, file.name);
    return this.req.Post<void>(`${environment.apiUrl}/background-img`, formData).pipe(
      tap(() => this.loadBackgrounds())
    );
  }

  private updateActiveBackgrounds(bgList: bg[]) {
    const activeBgs = bgList.filter(bg => bg.status);
    this.activeBgSubject.next(activeBgs);
  }

  getBackgrounds(): Observable<bg[]> {
    return this.bgSubject.asObservable();
  }

  getActiveBackgrounds(): Observable<bg[]> {
    return this.activeBgSubject.asObservable();
  }
  setBackgrounds(updatedBgs: bg[]): void {
    this.bgSubject.next(updatedBgs);
    this.updateActiveBackgrounds(updatedBgs);
  }
  deleteBackground(id: number): Observable<void> {
    return this.req.Delete<void>(`${environment.apiUrl}/background-img/${id}`).pipe(
      tap(() => {
        const updatedBgs = this.bgSubject.getValue().filter(bg => bg.id !== id);
        this.bgSubject.next(updatedBgs);
        this.updateActiveBackgrounds(updatedBgs);
      })
    );
  }

  updateBackgroundStatus(id: number, status: boolean): Observable<void> {
    return this.req.Patch<void>(`${environment.apiUrl}/background-img/${id}`, { status }).pipe(
      tap(() => {
        const updatedBgs = this.bgSubject.getValue().map(bg => bg.id === id ? { ...bg, status } : bg);
        this.bgSubject.next(updatedBgs);
        this.updateActiveBackgrounds(updatedBgs);
      })
    );
  }
}
