import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Residence } from 'src/app/Core/Models/residence';
import { ResidenceService } from 'src/app/Core/Services/residence.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-update-residence',
  templateUrl: './update-residence.component.html',
  styleUrls: ['./update-residence.component.css']
})
export class UpdateResidenceComponent implements OnInit {
  residence: Residence = { id: 0, name: '', address: '', image: '', status: 'Disponible' };
  residenceForm: FormGroup;
  imagePreview: string | ArrayBuffer | null = null; // Image preview
  selectedFile!: File; // Stores the selected file

  constructor(
    private route: ActivatedRoute,
    private residenceService: ResidenceService,
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    // Initialize the form group
    this.residenceForm = this.fb.group({
      name: ['', [Validators.minLength(3)]],
      address: ['', [Validators.minLength(5)]],
      status: ['Disponible', Validators.required],
    });
  }

  ngOnInit() {
    // Get residence ID from the URL
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.residenceService.getResidenceById(id).subscribe((res) => {
      this.residence = res;
      this.initializeForm();
    });
  }

  // ✅ Populate form with existing data
  initializeForm() {
    this.residenceForm.patchValue({
      name: this.residence.name,
      address: this.residence.address,
      status: this.residence.status,
    });

    // Display the current image if available
    if (this.residence.image) {
      this.imagePreview = this.residence.image;
    }
  }

  // ✅ Handle image selection and preview
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (file) {
      this.selectedFile = file; // Store the selected file
      const reader = new FileReader();
      reader.onload = () => (this.imagePreview = reader.result); // Show preview
      reader.readAsDataURL(file);
    }
  }

  // ✅ Submit updated residence
  updateResidence() {
    if (!this.residence) return;

    // Merge form data with the existing residence
    const updatedResidence: Residence = {
      ...this.residence,
      ...this.residenceForm.value,
    };

    // ✅ Keep the existing image if no new file is uploaded
    if (!this.selectedFile) {
      this.saveUpdatedResidence(updatedResidence);
    } else {
      // ✅ Upload the new image and update the residence
      const formData = new FormData();
      formData.append('image', this.selectedFile);

      this.http.post<{ imageUrl: string }>('http://localhost:3001/upload', formData).subscribe((response) => {
        updatedResidence.image = response.imageUrl;
        this.saveUpdatedResidence(updatedResidence);
      });
    }
  }

  // ✅ Save the updated residence to JSON Server
  private saveUpdatedResidence(updatedResidence: Residence) {
    this.residenceService.updateResidence(updatedResidence.id, updatedResidence).subscribe(() => {
      alert('Residence updated successfully!');
      this.router.navigate(['/residences']);
    });
  }

  // ✅ Navigate back to the residence list
  cancel() {
    this.router.navigate(['/residences']);
  }
}
