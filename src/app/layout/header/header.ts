import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { AuthResponse } from '../../core/models/auth-response';
@Component({
  selector: 'app-header',
  templateUrl: './header.html'
})
export class Header {
  service = inject(AuthService)
  user = signal<AuthResponse | null>(null)
  constructor(){
    if(this.service.isLogged()){
      this.user.set(this.service.getUserInfo())
    }
  }
}