import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Responsable } from '../models/responsable';  // Asegúrate de ajustar la ruta correctamente


@Injectable({
  providedIn: 'root'
})
export class ResponsableService {
  private API_URI = 'http://localhost:3000/responsables';
  public loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) {}

  private hasToken(): boolean {
    return !!localStorage.getItem('user');
  }

  getResponsables(): Observable<any> {
    return this.http.get(this.API_URI);
  }

  getResponsable(idResp: string | number): Observable<any> {
    return this.http.get(`${this.API_URI}/${idResp}`);
  }

  saveResponsable(responsable: any): Observable<any> {
    return this.http.post(this.API_URI, responsable);
  }

  deleteResponsable(idResp: string | number): Observable<any> {
    return this.http.delete(`${this.API_URI}/${idResp}`);
  }

  updateResponsable(idResp: string | number, updateResp: any): Observable<any> {
    return this.http.put(`${this.API_URI}/${idResp}`, updateResp);
  }

  getUserId(): number {
    const user: Responsable = JSON.parse(localStorage.getItem('user') || '{}');
    console.log(user.idResp);
    return user.idResp || 0; // Asegúrate de que `idResp` sea la propiedad correcta
  }

  login(nombUsuario: string, contrasenia: string): Observable<Responsable> {
    return this.http.post<Responsable>(`${this.API_URI}/validate`, { nombUsuario, contrasenia }).pipe(
      tap(user => {
        console.log('Usuario autenticado:', user); 
        if (user && user.idResp) {
          localStorage.setItem('user', JSON.stringify(user));
          this.loggedIn.next(true);
        } else {
          console.error('Error al autenticar: Usuario inválido.');
        }
      }),
      catchError(error => {
        console.error('Error de autenticación:', error);
        return throwError(error);
      })
    );
  }

  getUserRole(): number {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.idRoles || 0;
  }

  isLoggedIn(): boolean {
    return this.loggedIn.value;
  }

  logout(): void {
    this.loggedIn.next(false);
    localStorage.removeItem('user');
  }

  buscarResponsable(correoElec: string, telefono: string): Observable<any> {
    return this.http.post(`${this.API_URI}/buscar`, { correoElec, telefono });
  }

  updateContrasenia(idResp: string | number, updateData: any): Observable<any> {
    return this.http.put(`${this.API_URI}/contrasenia/${idResp}`, updateData);
  }

  getResponsableById(idResp: string | number): Observable<any> {
    return this.http.get(`${this.API_URI}/${idResp}`);
  }

 //correo electrónico
 enviarCorreoAscenso(razon: string): Observable<any> {
  const userId = this.getUserId(); // Obtiene el ID del usuario autenticado
  return this.http.post(`${this.API_URI}/ascenso/correo`, { razon, userId });
}

  
}
