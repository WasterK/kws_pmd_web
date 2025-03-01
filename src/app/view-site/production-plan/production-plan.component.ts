import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DeviceService } from '../../services/device.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-production-plan',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './production-plan.component.html',
  styleUrl: './production-plan.component.css'
})
export class ProductionPlanComponent {
  uploadForm: FormGroup;
  availableParts: string[] = [];
  productionPlan: string[] = [];
  loading: boolean = false;
  device_id: number;

  constructor(
    private deviceService: DeviceService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProductionPlanComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.device_id = data.device_id;
    this.uploadForm = this.fb.group({
      productionPlan: this.productionPlan
    });
  }

  ngOnInit() {
    this.loading = true;
    this.deviceService.getDeviceParts(this.device_id).subscribe(
      (response) => {
        this.loading = false;
        this.availableParts = response.map((item: any) => item.part_name);
      },
      (error) => {
        this.loading = false;
        console.error("Failed to load parts:", error);
      }
    );

    this.deviceService.getProductionPlan(this.device_id).subscribe(
      (response) => {
        this.loading = false;
        this.productionPlan = response.data.map((item: any) => item.part_name);
        console.log(this.productionPlan)
      },
      (error) => {
        this.loading = false;
        console.error("Failed to load parts:", error);
      }
    );
  }

  addToPlan(part: string) {
    this.productionPlan.push(part);  
  }

  removeFromPlan(index: number) {
    this.productionPlan.splice(index, 1);
  }

  savePlan() {
    const formattedData = {
      data: this.productionPlan.map((part, index) => ({
        sequence: index+1,
        part_name: part,
        created_by: 0
      }))
    };
    this.dialogRef.close({ "device_id": this.device_id, "productionPlan": formattedData });
  }
}
