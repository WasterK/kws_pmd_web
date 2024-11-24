import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SiteService {
  private apiUrl = environment.apiUrl;  // Replace with your actual API URL

  constructor(private http: HttpClient) {}

  // Fetch all sites
  getSites(): Observable<{sites:any[]}> {
    return this.http.get<{sites: any[]}>(`${this.apiUrl}/sites`);
  }

  // Add a new site
  addSite(siteData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/sites`, siteData);
  }

  // Delete a site
  deleteSite(siteId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/sites/${siteId}`);
  }

   // Get devices for a specific site
  getDevicesBySiteId(siteId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/sites/${siteId}/devices`);
  }

  getSiteById(siteId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/sites/${siteId}`);
  }

  // Add a new device to a specific site
  addDeviceToSite(siteId: number, device: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/sites/${siteId}/devices`, device);
  }
}
