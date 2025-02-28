import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Residence } from 'src/app/Core/Models/residence';
import { ResidenceService } from 'src/app/Core/Services/residence.service';

@Component({
  selector: 'app-residence-details',
  templateUrl: './residence-details.component.html',
  styleUrls: ['./residence-details.component.css']
})
export class ResidenceDetailsComponent implements OnInit {
  residenceId!: number;
  residence: Residence | undefined;
  totalResidences: number = 0; // To track the total number of residences

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private residenceService: ResidenceService
  ) {}

  ngOnInit(): void {
    // Get residence ID from route params
    this.route.params.subscribe((params) => {
      this.residenceId = +params['id'];
      this.fetchResidenceById(this.residenceId);
    });

    // Fetch all residences to track navigation
    this.residenceService.getResidences().subscribe(residences => {
      this.totalResidences = residences.length;
    });
  }

  // ✅ Fetch the residence from JSON Server
  fetchResidenceById(id: number) {
    this.residenceService.getResidenceById(id).subscribe({
      next: (residence) => {
        this.residence = residence;
      },
      error: () => {
        alert('Residence not found!');
        this.router.navigate(['/residences']);
      }
    });
  }

  // ✅ Navigate to the next residence (loops back to the first)
  goToNextResidence() {
    const nextResidenceId = this.residenceId < this.totalResidences ? this.residenceId + 1 : 1;
    this.router.navigate(['/residences', nextResidenceId]);
  }

  // ✅ Navigate to apartments by residence
  viewApartmentsByResidence() {
    this.router.navigate(['/apartments', this.residenceId]);
  }
}
