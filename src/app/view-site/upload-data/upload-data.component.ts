import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';

import { DeviceService } from '../../services/device.service';

@Component({
  selector: 'app-upload-data',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule, CommonModule, MatListModule ],
  templateUrl: './upload-data.component.html',
  styleUrls: ['./upload-data.component.scss']
})
export class UploadDataComponent {
  uploadForm: FormGroup;
  isPartSelection: boolean;
  device_id: number;
  partList: {[key: string]: number} = {};
  selectedPart: string = '';
  loading: Boolean = false;

  constructor(
    private fb: FormBuilder,
    private deviceService: DeviceService,
    public dialogRef: MatDialogRef<UploadDataComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isPartSelection = data.isPartSelection;
    this.device_id = data.device_id;
    this.uploadForm = this.fb.group({
      new_targets: [data?.current_target || 0, Validators.required],
      selectedPartLocation: [this.partList[this.selectedPart]],
      isPartSelection: [this.isPartSelection],
      current_part: [data?.part_name]
    });
  }

  ngOnInit() {
    if (this.isPartSelection) {
      this.loading = true;
      this.deviceService.getDeviceParts(this.device_id).subscribe(
        (response) => {
          this.loading = false;
          response.forEach((item: any) => {
            this.partList[item.part_name] = item.location_id;
          });
  
          // Automatically select the first part (optional)
          if (Object.keys(this.partList).length > 0) {
            this.selectPart(Object.keys(this.partList)[this.partList[this.data.current_part]-1]);
          }
        },
        (error) => {
          this.loading = false;
          console.error("Failed to load parts:", error);
        }
      );
    }
  }

  partKeys(): string[] {
    return Object.keys(this.partList).map(String);
  }

  selectPart(part: string) {
    this.selectedPart = part;
    this.uploadForm.patchValue({
      selectedPartLocation: this.partList[part]
    });
  }

  submitForm() {
    if (this.uploadForm.valid) {
      this.dialogRef.close(this.uploadForm.value);
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
