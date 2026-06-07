import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  readonly collapsed = signal(false);
  readonly mobileOpen = signal(false);

  init(): void {
    if (localStorage.getItem('lt-nav-collapsed') === '1') {
      this.collapsed.set(true);
    }
  }

  toggleCollapsed(): void {
    this.collapsed.update(v => !v);
    localStorage.setItem('lt-nav-collapsed', this.collapsed() ? '1' : '0');
  }

  openMobile(): void {
    this.mobileOpen.set(true);
  }

  toggleMobile(): void {
    this.mobileOpen.update(v => !v);
  }

  closeMobile(): void {
    this.mobileOpen.set(false);
  }
}
