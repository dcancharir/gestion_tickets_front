import { computed, inject, Injectable, signal } from '@angular/core';
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

  private _userInfo = signal<AuthResponse | null>(this.loadFromStorage());

  readonly hasFullAccess = computed(() => this._userInfo()?.hasFullAccess ?? false);

  private loadFromStorage(): AuthResponse | null {
    const data = localStorage.getItem('AUTH_INFO');
    return data ? JSON.parse(data) as AuthResponse : null;
  }

  login(payload: LoginPayload) {
    return this.http.post<AuthResponse>(`${this.api}api/auth/login`, payload).pipe(
      tap(res => {
        localStorage.setItem('TOKEN_KEY', res.token);
        localStorage.setItem('AUTH_INFO', JSON.stringify(res));
        this._userInfo.set(res);
      })
    );
  }

  logout() {
    localStorage.removeItem('TOKEN_KEY');
    localStorage.removeItem('AUTH_INFO');
    this._userInfo.set(null);
    this.router.navigate(['/']);
  }

  isLogged(): boolean {
    return !!localStorage.getItem('TOKEN_KEY');
  }

  getToken(): string | null {
    return localStorage.getItem('TOKEN_KEY');
  }

  getUserInfo(): AuthResponse | null {
    return this._userInfo();
  }
}