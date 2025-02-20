import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Residence } from '../Models/residence';

@Injectable({
  providedIn: 'root'
})
export class ResidenceService {
  private apiUrl = 'http://localhost:3000/residences'; // JSON Server URL

  constructor(private http: HttpClient) {}

  // ✅ Get all residences
  getResidences(): Observable<Residence[]> {
    return this.http.get<Residence[]>(this.apiUrl);
  }

  // ✅ Add a new residence
  addResidence(residence: Residence): Observable<Residence> {
    return this.http.post<Residence>(this.apiUrl, residence);
  }
}
