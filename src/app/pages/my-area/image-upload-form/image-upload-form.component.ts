import { Component, EventEmitter, Output } from '@angular/core';
import { FileUploaderService } from 'src/app/services/file-uploader.service';
import { FileUpload } from 'src/app/models/file-upload';

@Component({
  selector: 'app-image-upload-form',
  templateUrl: './image-upload-form.component.html',
  styleUrls: ['./image-upload-form.component.css']
})
export class ImageUploadFormComponent {

  @Output() profilePictureChanged = new EventEmitter<boolean>();

  selectedFiles?: FileList;
  fileUpload?: FileUpload;
  percentage = 0;

  constructor(private uploadService: FileUploaderService) { }

  selectFile(event: any): void{
    this.selectedFiles = event.target.files;
  }

  upload(): void {
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      this.selectedFiles = undefined;
      if (file) {
        this.fileUpload = new FileUpload(file);
        this.uploadService.pushFileToStorage(this.fileUpload)
        .subscribe(
        percentage => {
        this.percentage = Math.round(percentage ? percentage : 0);
        },
        error => { console.log(error); }
        );
      }
    }
  }

}
