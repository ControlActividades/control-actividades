import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

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

  login(nombUsuario: string, contrasenia: string): Observable<any> {
    return this.http.post(`${this.API_URI}/validate`, { nombUsuario, contrasenia }).pipe(
      tap(user => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.loggedIn.next(true);
        }
      })
    );
  }

  getUserRole(): number {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.idRoles;
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
}
