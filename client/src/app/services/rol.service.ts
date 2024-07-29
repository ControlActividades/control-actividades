import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Rol } from '../models/Rol';
import { Observable, Subject, tap } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class RolService {

  API_URI = 'http://localhost:3000/roles'; //conexion

  private refreshSubject = new Subject<void>();

  constructor(private http: HttpClient) { }

  getRoles() {
    return this.http.get<Rol[]>(`${this.API_URI}`);
  }

  getRol(idRoles: string | number) {
    return this.http.get<Rol>(`${this.API_URI}/${idRoles}`);
  }


  saveRol(rol: Rol) {
    return this.http.post(`${this.API_URI}`, rol).pipe(
      tap(() => this.refreshSubject.next())
    );
  }

  deleteRol(idRoles: string | number) {
    return this.http.delete(`${this.API_URI}/${idRoles}`).pipe(
      tap(() => this.refreshSubject.next())
    );
  }

  updateRol(idRoles: string | number, updateRol: Rol) {
    return this.http.put(`${this.API_URI}/${idRoles}`, updateRol).pipe(
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

  getRoleByName(rolNombre: string): Observable<any> {
    return this.http.get<any>(`${this.API_URI}/role/${rolNombre}`);
  }
}



