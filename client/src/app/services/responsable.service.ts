import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Responsable } from '../models/Responsable';
import { Subject, tap } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ResponsableService {
  API_URI = 'http://localhost:3000/responsables'; //conexion
  private refreshSubject = new Subject<void>();

  constructor(private http: HttpClient) { }

  getResponsables() {
    return this.http.get<Responsable[]>(`${this.API_URI}`);
  }

  getResponsable(idResp: string | number) {
    return this.http.get<Responsable>(`${this.API_URI}/${idResp}`);
  }

  saveResponsable(responsable: Responsable) {
    return this.http.post(`${this.API_URI}`, responsable).pipe(
      tap(() => this.refreshSubject.next())
    );
  }

  deleteResponsable(idResp: string | number) {
    return this.http.delete(`${this.API_URI}/${idResp}`).pipe(
      tap(() => this.refreshSubject.next())
    );
  }

  updateResponsable(idResp: string | number, updateResp: Responsable) {
    return this.http.put(`${this.API_URI}/${idResp}`, updateResp).pipe(
      tap(() => this.refreshSubject.next())
    );
  }

}
