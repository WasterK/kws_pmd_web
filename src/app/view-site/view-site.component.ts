import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SiteService } from '../services/site.service';
import { DeviceService } from '../services/device.service';

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

  constructor(private deviceService: DeviceService, private route: ActivatedRoute, private siteService: SiteService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.siteId = Number(params.get('siteId'));
      if (this.siteId) {
        this.fetchSiteDetails();
        this.fetchDevices();
      }
    });
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
        this.devices = response.devices;
        for (let device of this.devices) {
          this.deviceService.getDeviceData(this.siteId!, device.device_id).subscribe(
            (response: any) => {
              this.allDeviceData[device.device_id] = response;
            },
            (error) => {
              console.error('Error fetching device data:', error);
            }
          );
        }
        // console.log(this.allDeviceData);
      },
      (error) => {
        console.error('Error fetching devices:', error);
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
}
