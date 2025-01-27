import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SiteService } from '../services/site.service';
import { DeviceService } from '../services/device.service';

@Component({
  selector: 'app-manage-device',
  standalone: true,
  imports: [],
  templateUrl: './manage-device.component.html',
  styleUrl: './manage-device.component.css'
})
export class ManageDeviceComponent {
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
        this.refreshData();
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
      },
      (error) => {
        console.error('Error fetching devices:', error);
      }
    );
  }

  refreshData() {
    setInterval(() => {
      this.fetchDevices();
    }, 10000);
  }

  toggleAddDeviceForm() {
    this.isAddDeviceFormVisible = !this.isAddDeviceFormVisible;
  }
}
