import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '@auth0/auth0-angular';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from '../../../environments';

@Injectable({
    providedIn: 'root'
})
export class AuthHttpService {
    private readonly apiUrl = environment.apiBaseUrl; // Cambia según tu backend

    constructor(
        private http: HttpClient,
        private auth: AuthService
    ) {}

    // GET
    get<T>(endpoint: string): Observable<T> {
        return this.auth.getAccessTokenSilently().pipe(
            switchMap((token) => {
                const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
                return this.http.get<T>(`${this.apiUrl}/${endpoint}`, { headers });
            })
        );
    }

    // POST
    post<T>(endpoint: string, body: any): Observable<T> {
        return this.auth.getAccessTokenSilently().pipe(
            switchMap((token) => {
                const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
                return this.http.post<T>(`${this.apiUrl}/${endpoint}`, body, { headers });
            })
        );
    }

    // PUT
    put<T>(endpoint: string, body: any): Observable<T> {
        return this.auth.getAccessTokenSilently().pipe(
            switchMap((token) => {
                const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
                return this.http.put<T>(`${this.apiUrl}/${endpoint}`, body, { headers });
            })
        );
    }

    // DELETE
    delete<T>(endpoint: string): Observable<T> {
        return this.auth.getAccessTokenSilently().pipe(
            switchMap((token) => {
                const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
                return this.http.delete<T>(`${this.apiUrl}/${endpoint}`, { headers });
            })
        );
    }

    // POST que devuelve un blob (PDF u otros archivos)
    postBlob(endpoint: string, body: any, options?: { [key: string]: any }): Observable<Blob> {
        return this.auth.getAccessTokenSilently().pipe(
            switchMap((token) => {
                let headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
                // Combina los headers con las otras opciones
                const finalOptions = {
                    ...options,
                    headers,
                    responseType: 'blob' as 'json' // Cast necesario para TypeScript
                };
                return this.http.post<Blob>(`${this.apiUrl}/${endpoint}`, body, finalOptions);
            })
        );
    }
}
