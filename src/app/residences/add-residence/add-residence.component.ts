import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ResidenceService } from 'src/app/Core/Services/residence.service';
import { Residence } from 'src/app/Core/Models/residence';

@Component({
  selector: 'app-add-residence',
  templateUrl: './add-residence.component.html',
  styleUrls: ['./add-residence.component.css']
})
export class AddResidenceComponent {
  residence: Residence = {
    id: 0, // ID will be assigned by the server
    name: '',
    address: '',
    image: '',
    status: 'Disponible'
  };
  imagePreview: string | null = null;

  constructor(private router: Router, private residenceService: ResidenceService) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
        this.residence.image = this.imagePreview; // Store base64 string
      };
      reader.readAsDataURL(file);
    }
  }

  submitResidence() {
    this.residenceService.addResidence(this.residence).subscribe(() => {
      alert('Residence added successfully!');
      this.router.navigate(['/residences']);
    });
  }

  cancel() {
    this.router.navigate(['/residences']);
  }
}
