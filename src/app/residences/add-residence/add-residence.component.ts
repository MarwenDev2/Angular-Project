import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ResidenceService } from 'src/app/Core/Services/residence.service';
import { Residence } from 'src/app/Core/Models/residence';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-residence',
  templateUrl: './add-residence.component.html',
  styleUrls: ['./add-residence.component.css']
})
export class AddResidenceComponent {
  residenceForm: FormGroup; // Define the form group
  imagePreview: string | null = null;
  selectedFile!: File;

  constructor(
    private router: Router,
    private residenceService: ResidenceService,
    private http: HttpClient,
    private fb: FormBuilder // Inject FormBuilder
  ) {
    this.residenceForm = this.fb.group({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      address: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
      ]),      
      status: new FormControl('Disponible', [Validators.required]),
      image: new FormControl(null, [Validators.required])
    });
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];

      // Show image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(this.selectedFile);

      // Update the form control value
      this.residenceForm.patchValue({ image: this.selectedFile });
      this.residenceForm.get('image')?.updateValueAndValidity();
    }
  }

  submitResidence() {
    if (this.residenceForm.invalid) {
      alert('Please fill out the form correctly.');
      return;
    }

    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('image', this.selectedFile);

      // Upload image to the backend (Express server)
      this.http.post<{ imageUrl: string }>('http://localhost:3001/upload', formData).subscribe(response => {
        const residence: Residence = {
          id: 0, // Will be calculated later
          name: this.residenceForm.value.name,
          address: this.residenceForm.value.address,
          image: response.imageUrl,
          status: this.residenceForm.value.status
        };

        // ✅ Step 1: Get existing residences to calculate the new ID
        this.residenceService.getResidences().subscribe(residences => {
          // Convert all IDs to numbers, find the maximum, and increment
          const maxId = residences.length > 0 ? Math.max(...residences.map(r => +r.id)) : 0;
          residence.id = maxId + 1; // ✅ Step 2: Assign the next available ID as a number

          console.log('Adding new residence:', residence); // Log the new residence

          // ✅ Step 3: Add the residence to JSON Server
          this.residenceService.addResidence(residence).subscribe(() => {
            alert('Residence added successfully!');
            this.router.navigate(['/residences']); // Navigate back to the list
          });
        });
      });
    } else {
      alert('Please upload an image.');
    }
  }

  cancel() {
    this.router.navigate(['/residences']);
  }
}
