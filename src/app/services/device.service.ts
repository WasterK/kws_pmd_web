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
    return this.http.get<any[]>(`${this.apiUrl}/${device_id}/stream-device-data`);
  }

  getDeviceParts(device_id: number) {
    return this.http.get<Part[]>(`${this.apiUrl}/${device_id}/get-device-parts`)
  }

  setCurrentPart(device_id: number, location_id: number) {
    return this.http.post(`${this.apiUrl}/${device_id}/device-config`, {"function_code": "set-last-used", "location_id": location_id});
  }

  setDeviceTarget(device_id: number, location_id: number, new_targets: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${device_id}/device-config`, 
    {
      "location_id": location_id,
      "new_targets": new_targets,
      "function_code": "update-target"
    })
  }

  uploadProductionPlan(device_id: number, production_plan: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${device_id}/production-plan`, production_plan)
  }

  getProductionPlan(device_id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${device_id}/production-plan`)
  }

  downloadDeviceLogs(device_id: number, format: string = 'csv'): Observable<Blob> {
    const params = new HttpParams().set('format', format);
    return this.http.get(`${this.apiUrl}/${device_id}/download-device-logs`, {
      params,
      responseType: 'blob'  // Ensure the response is treated as a Blob
    });
  }

}

interface Part {
  location_id: number;
  part_name: string;
}