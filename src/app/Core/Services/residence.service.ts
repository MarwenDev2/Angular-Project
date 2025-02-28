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

  // ✅ Get all residences (READ)
  getResidences(): Observable<Residence[]> {
    return this.http.get<Residence[]>(this.apiUrl);
  }

  // ✅ Get a single residence by ID (READ)
  getResidenceById(id: number): Observable<Residence> {
    return this.http.get<Residence>(`${this.apiUrl}/${id}`);
  }

  // ✅ Add a new residence (CREATE)
  addResidence(residence: Residence): Observable<Residence> {
    // Convert the id to a string before sending to JSON Server
    const residenceWithStringId = { ...residence, id: residence.id.toString() };
    return this.http.post<Residence>(this.apiUrl, residenceWithStringId);
  }

  // ✅ Update an existing residence (UPDATE)
  updateResidence(id: number, residence: Residence): Observable<Residence> {
    return this.http.put<Residence>(`${this.apiUrl}/${id}`, residence);
  }

  // ✅ Delete a residence (DELETE)
  deleteResidence(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
