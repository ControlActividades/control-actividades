import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, tap } from 'rxjs';
//models
import { Reservas } from '../models/Reservas'; 
import { ReservasImprimir } from '../models/ReservaImprimir';

@Injectable({
  providedIn: 'root'
})
export class ReservasService {
  API_URI = 'http://localhost:3000/reservas'; //conexion
  private refreshSubject = new Subject<void>();

  constructor(private http: HttpClient) { } 

  getReservas() {
    return this.http.get<Reservas[]>(`${this.API_URI}`);
  }

  getReserva(idReserva: string | number) {
    return this.http.get<Reservas>(`${this.API_URI}/${idReserva}`); 
  }


  saveReserva(reserva: Reservas) {
    return this.http.post(`${this.API_URI}`, reserva).pipe(
      tap(() => this.refreshSubject.next())
    );
  }

  deleteReserva(idReserva: string | number) {
    return this.http.delete(`${this.API_URI}/${idReserva}`).pipe(
      tap(() => this.refreshSubject.next())
    );
  }

  updateReserva(idReserva: string | number, updateReserva: Reservas) {
    return this.http.put(`${this.API_URI}/${idReserva}`, updateReserva).pipe(
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

  //oficios de reservas
  getReservaImprimir(idReserva: string | number) {
    return this.http.get<ReservasImprimir>(`${this.API_URI}/imprimir/${idReserva}`);
  }

}
 