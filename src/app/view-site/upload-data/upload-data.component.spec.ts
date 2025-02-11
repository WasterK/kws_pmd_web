import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UploadDataComponent } from './upload-data.component';

describe('UploadDataComponent', () => {
  let component: UploadDataComponent;
  let fixture: ComponentFixture<UploadDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
