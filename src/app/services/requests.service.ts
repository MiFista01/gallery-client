import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {
  constructor(private http: HttpClient) { }
  Get<T>(url: string, reg = false, responeType: "json" | "text" = "json") {
    if(reg){
      return this.http.get<T>(url, {withCredentials: true, params:{reg:reg}});
    }else{
      return this.http.get<T>(url, {withCredentials: true, responseType: responeType as "json"});
    }
  }
  Post<T>(url:string, body:any){
    return this.http.post<T>(url, body, { withCredentials: true });
  }
  Patch<T>(url:string, body?:any){
    return this.http.patch<T>(url, body, { withCredentials: true });
  }
  Delete<T>(url:string){
    return this.http.delete<T>(url, { withCredentials: true });
  }
}
