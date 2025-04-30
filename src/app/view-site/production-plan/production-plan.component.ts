import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DeviceService } from '../../services/device.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-production-plan',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './production-plan.component.html',
  styleUrl: './production-plan.component.css'
})
export class ProductionPlanComponent {
  uploadForm: FormGroup;
  availableParts: string[] = [];
  productionPlan: { part_name: string; target: number }[] = [];
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
        console.log(`this is response : ${JSON.stringify(response)}`)
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
        this.productionPlan = response.data.map((item: any) => ({
          part_name: item.part_name,
          target: item.target
        }));
        console.log(this.productionPlan);
      },
      (error) => {
        this.loading = false;
        console.error("Failed to load production plan:", error);
      }
    );
  }

  addToPlan(part: { part_name: string; target: number }) {
    this.productionPlan.push(part);  
  }

  removeFromPlan(index: number) {
    this.productionPlan.splice(index, 1);
  }
  

  confirmationText = '';
  
 
  savePlan() {
    const formattedData = {
      data: this.productionPlan.map((part, index) => {
        const quantityInput = document.getElementById(`qty-${index}`) as HTMLInputElement;
        const quantity = quantityInput ? parseInt(quantityInput.value, 10) || 0 : 0;
        return {
          sequence: index + 1,
          part_name: part.part_name,
          quantity: quantity,
          created_by: 0
        };
      })
    };
    this.dialogRef.close({ "device_id": this.device_id, "productionPlan": formattedData });
  }
}
