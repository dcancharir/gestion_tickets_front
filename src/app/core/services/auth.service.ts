import { computed, inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { LoginPayload } from '../models/login-payload';
import { AuthResponse } from '../models/auth-response';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = environment.api_url;
  private http = inject(HttpClient);
  private router = inject(Router);


  login(paylaoad : LoginPayload) {
    return this.http.post<AuthResponse>(`${this.api}api/auth/login`, paylaoad).pipe(
      tap(res => {
        localStorage.setItem('TOKEN_KEY', res.token);
      })
    );
  }

  logout() {
    localStorage.removeItem('TOKEN_KEY');
  }

  isLogged(): boolean {
    return !!localStorage.getItem('TOKEN_KEY');
  }
  getToken():string | null {
    return localStorage.getItem('TOKEN_KEY');
  }
}