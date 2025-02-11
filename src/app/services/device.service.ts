import { Injectable } from '@angular/core';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  private apiUrl = environment.apiUrl;  // Replace with your actual API URL

  constructor(private http: HttpClient) { }

  addNewDevice(device_name: string, device_url: string, site_id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/device/${site_id}`, {"device_name": device_name, "device_url": device_url, "site_id": site_id}, {withCredentials: true})
  }

  getDeviceData(siteId: number, device_id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/stream-device-data/${device_id}`);
  }

  setDeviceTarget(device_id: number, location_id: number, new_targets: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/device-config/${device_id}`, 
    {
      "location_id": location_id,
      "new_targets": new_targets
    })
  }

  downloadDeviceLogs(device_id: number, format: string = 'csv'): Observable<Blob> {
    const params = new HttpParams().set('format', format);
    return this.http.get(`${this.apiUrl}/device/download-device-logs/${device_id}`, {
      params,
      responseType: 'blob'  // Ensure the response is treated as a Blob
    });
  }
}
