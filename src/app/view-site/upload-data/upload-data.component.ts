import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-upload-data',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './upload-data.component.html',
  styleUrls: ['./upload-data.component.scss']
})
export class UploadDataComponent {
  uploadForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UploadDataComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.uploadForm = this.fb.group({
      new_targets: [data?.current_target || 0, Validators.required]
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
