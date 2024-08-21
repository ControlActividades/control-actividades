import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Edificios } from '../models/edificio';
import { Subject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EdificioService {
  API_URI = 'http://localhost:3000/edificios'; //conexion
  private refreshSubject = new Subject<void>();

  constructor(private http: HttpClient) { } 

  getEdificios() {
    return this.http.get<Edificios[]>(`${this.API_URI}`);
  }

  getEdificio(idEdificio: string | number) {
    return this.http.get<Edificios>(`${this.API_URI}/${idEdificio}`);
  }


  saveEdificio(edificio: Edificios) {
    return this.http.post(`${this.API_URI}`, edificio).pipe(
      tap(() => this.refreshSubject.next())
    );
  }

  deleteEdificio(idEdificio: string | number) {
    return this.http.delete(`${this.API_URI}/${idEdificio}`).pipe(
      tap(() => this.refreshSubject.next())
    );
  }

  updateEdificio(idEdificio: string | number, updateEdificio: Edificios) {
    return this.http.put(`${this.API_URI}/${idEdificio}`, updateEdificio).pipe(
      tap(() => this.refreshSubject.next())
    );
  }

  setTableIndex(index: number): void {
    localStorage.setItem('tableIndex', index.toString());
  }

  getTableIndex(): number {
    const index = localStorage.getItem('tableIndex');
    return index ? parseInt(index, 10) : 0;
  }

  get refresh$() {
    return this.refreshSubject.asObservable();
  }
}
