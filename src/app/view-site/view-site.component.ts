import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SiteService } from '../services/site.service';
import { DeviceService } from '../services/device.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UploadDataComponent } from './upload-data/upload-data.component';

import { forkJoin } from 'rxjs';

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
        for (let device of this.devices) {
          this.deviceService.getDeviceData(this.siteId!, device.device_id).subscribe(
            (response: any) => {
              this.allDeviceData[device.device_id] = response;
              device.status = "online"
            },
            (error) => {
              if (error.status === 500) {
                  device.status = "offline"
              }
              // console.error('Error fetching device data:', error);
            }
          );
        }
        // console.log(this.allDeviceData);
      },
      (error) => {
        if (error.status === 401) {
          this.authService.tokenRefresh().subscribe(
            (response) => {
              
            }
          );
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
            device.status = "online"; 
          },
          (error) => {
            if (error.status === 500) {
              device.status = "offline";
            }
          }
        );
      }
    }, 2000);
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
