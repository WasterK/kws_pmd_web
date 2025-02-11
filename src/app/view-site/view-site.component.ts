import { Component, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SiteService } from '../services/site.service';
import { DeviceService } from '../services/device.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UploadDataComponent } from './upload-data/upload-data.component';

import { forkJoin, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Component({
  selector: 'app-view-site',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './view-site.component.html',
  styleUrls: ['./view-site.component.css']
})
export class ViewSiteComponent {
  siteId: number | null = null; // Current site ID
  siteDetails: any = {}; // Site details
  devices: any[] = []; // List of devices
  allDeviceData: any = {}; // Device data
  isAddDeviceFormVisible = false; // Controls the form visibility
  dropdownOpen: { [key: number]: boolean } = {};
  isAnalyticsView = localStorage.getItem('isAnalyticsView') === 'true';
  analyticsData: any[] = [];
  todayDate: string = new Date().toLocaleDateString();

  newDevice = {
    device_name: '',
    device_url: ''
  }; // New device data

  constructor(
    private authService: AuthService,
    private deviceService: DeviceService, 
    private route: ActivatedRoute, 
    private siteService: SiteService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.siteId = Number(params.get('siteId'));
      if (this.siteId) {
        this.fetchSiteDetails();
        this.fetchDevices();
        this.refreshData();
      }
    });
  }

  toggleAnalyticsView() {
    this.isAnalyticsView = !this.isAnalyticsView;
    localStorage.setItem('isAnalyticsView', String(this.isAnalyticsView)); // Stores the correct toggled value
  
    if (this.isAnalyticsView) {
      this.showCumulativeAnalytics();
    }
  }
  

  showCumulativeAnalytics() {
    const aggregatedData: { [key: string]: any } = {};

    this.devices.forEach(device => {
      const data = this.allDeviceData[device.device_id] || {};
      const partName = data.part_name || 'N/A';

      if (!aggregatedData[partName]) {
        aggregatedData[partName] = {
          part_name: partName,
          daily_target: 0,
          daily_achieved: 0,
          weekly_target: 0,
          weekly_achieved: 0,
          monthly_target: 0,
          monthly_achieved: 0
        };
      }

      aggregatedData[partName].daily_target += data.target || 0;
      aggregatedData[partName].daily_achieved += data.current_count || 0;
      aggregatedData[partName].weekly_target += data.weekly_target || 0;
      aggregatedData[partName].weekly_achieved += data.weekly_achieved || 0;
      aggregatedData[partName].monthly_target += data.monthly_target || 0;
      aggregatedData[partName].monthly_achieved += data.monthly_achieved || 0;
    });

    this.analyticsData = Object.values(aggregatedData);
  }

  toggleDropdown(deviceId: number, status: string, event: Event): void {
    event.stopPropagation(); // Prevents event bubbling
    if (status === 'online') {
      Object.keys(this.dropdownOpen).forEach(key => {
        this.dropdownOpen[+key] = false;
      });
      this.dropdownOpen[deviceId] = !this.dropdownOpen[deviceId];
    }
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event): void {
    Object.keys(this.dropdownOpen).forEach(key => {
      this.dropdownOpen[+key] = false;
    });
  }

  downloadLogs(deviceId: number, event: Event, format: string = 'csv'): void {
    event.stopPropagation();
  
    // Find the device by ID
    const device = this.devices.find(d => d.device_id === deviceId);
    const deviceName = device ? device.device_name : `device_${deviceId}`; // Fallback in case device is not found
  
    this.deviceService.downloadDeviceLogs(deviceId, format).subscribe(
      (response) => {
        const blob = new Blob([response], { type: response.type });
        const downloadURL = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadURL;
        a.download = `${deviceName}_logs_${deviceId}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(downloadURL);
      },
      (error) => {
        console.error('Download failed:', error);
      }
    );
  }

  changeCurrentPart(deviceId: number, event: Event): void {
    event.stopPropagation();
    console.log(`Changing current part for device ${deviceId}`);
    // Implement part change logic here
  }

  onAddNewDevice() {
    this.deviceService.addNewDevice(this.newDevice.device_name, this.newDevice.device_url, this.siteId!).subscribe(
      (response) => {
        console.log('Device added successfully:', response);
        this.devices.push(response); 
        this.allDeviceData[response.device_id] = {}; 
        this.toggleAddDeviceForm();
        this.resetNewDeviceForm();
      },
      (error) => {
        if (error.status === 401) {
          this.authService.isLoggedIn = false;
        }
        this.router.navigate(['/dashboard']);
      }
    );
  }
  
  
  fetchSiteDetails() {
    this.siteService.getSiteById(this.siteId!).subscribe(
      (response: any) => {
        this.siteDetails = response;
      },
      (error) => {
        console.error('Error fetching site details:', error);
      }
    );
  }

  fetchDevices() {
    this.siteService.getDevicesBySiteId(this.siteId!).subscribe(
      (response: any) => {
        this.devices = response[0].devices;
        
        // If there are no devices, update analytics immediately
        if (this.devices.length === 0) {
          this.showCumulativeAnalytics();
          return;
        }
  
        const deviceDataObservables = this.devices.map(device => 
          this.deviceService.getDeviceData(this.siteId!, device.device_id).pipe(
            // Store device data or mark as offline in case of error
            tap((data: any) => {
              this.allDeviceData[device.device_id] = data;
              device.status = "online";
            }),
            catchError(() => {
              device.status = "offline";
              return of(null); // Continue even if a device fails
            })
          )
        );
  
        // Wait for all device data requests to complete
        forkJoin(deviceDataObservables).subscribe(
          () => {
            this.showCumulativeAnalytics(); // Now call the analytics function
          },
          (error) => {
            console.error('Error fetching device data:', error);
          }
        );
      },
      (error) => {
        if (error.status === 401) {
          this.authService.tokenRefresh().subscribe();
        }
      }
    );
  }
  

  toggleAddDeviceForm() {
    this.isAddDeviceFormVisible = !this.isAddDeviceFormVisible;
  }

  submitNewDevice() {
    if (!this.siteId) return;

    this.siteService.addDeviceToSite(this.siteId, this.newDevice).subscribe(
      (response: any) => {
        this.devices.push(response);
        this.toggleAddDeviceForm();
        this.resetNewDeviceForm();
      },
      (error) => {
        console.error('Error adding device:', error);
      }
    );
  }

  resetNewDeviceForm() {
    this.newDevice = { device_name: '', device_url: '' };
  }

  //refresh device data every 5 seconds
  refreshData() {
    setInterval(() => {
      for (let device of this.devices) {
        this.deviceService.getDeviceData(this.siteId!, device.device_id).subscribe(
          (response: any) => {
            this.allDeviceData[device.device_id] = response;
            this.showCumulativeAnalytics();
            device.status = "online"; 
          },
          (error) => {
            if (error.status === 500) {
              device.status = "offline";
            }
          }
        );
      }
    }, 500);
  }
  

  openUploadDialog(device_id: number, location_id: number, current_target: number) {
    const dialogRef = this.dialog.open(UploadDataComponent, {
      width: '400px',
      data: {current_target} // Pass empty or predefined data here
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Uploaded Data:', result);
        this.deviceService.setDeviceTarget(device_id, location_id, result.new_targets).subscribe(
          (response) => {
            this.refreshData()
          },
          (error) => {
            console.log(error)
          }
        )
      }
    });
  }
}
