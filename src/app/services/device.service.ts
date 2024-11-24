import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  private apiUrl = environment.apiUrl;  // Replace with your actual API URL

  constructor(private http: HttpClient) { }

  getDeviceData(siteId: number, device_id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/device/${siteId}/${device_id}`);
  }
}
