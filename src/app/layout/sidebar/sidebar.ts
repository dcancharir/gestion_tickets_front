import {
  Component, inject, resource, computed,
  signal, afterNextRender, effect
} from '@angular/core';
import { HttpClient }      from '@angular/common/http';
import { RouterLink, Router } from '@angular/router';
import { firstValueFrom }  from 'rxjs';

import { MenuSection }         from './menu.model';
import { AuthService }         from '../../core/services/auth.service';
import { LayoutService }       from '../../core/services/layout.service';
import { PermisoRolService }   from '../../features/maintenance/services/permiso-rol.service';

@Component({
  selector:    'app-sidebar',
  templateUrl: './sidebar.html',
  styleUrl:    './sidebar.css',
  imports:     [RouterLink],
})
export class Sidebar {
  router      = inject(Router);
  auth        = inject(AuthService);
  layoutSvc   = inject(LayoutService);
  permisoSvc  = inject(PermisoRolService);
  openModule: string | null = null;

  private http = inject(HttpClient);

  menuResource = resource({
    loader: () => firstValueFrom(
      this.http.get<MenuSection[]>('assets/main-menu.json')
    )
  });

  vistasResource = resource({
    loader: () => firstValueFrom(this.permisoSvc.getMisVistas())
  });

  private permisosSet = computed<Set<string>>(() =>
    new Set(this.vistasResource.value() ?? [])
  );

  menu = computed<MenuSection[]>(() => {
    if (this.menuResource.error()) return [];
    const raw = this.menuResource.value() ?? [];

    if (this.auth.getUserInfo()?.hasFullAccess) return raw;

    const permitidos = this.permisosSet();
    if (this.vistasResource.isLoading()) return [];

    return raw
      .map(section => ({
        ...section,
        modules: section.modules
          .filter(mod => {
            if (mod.directPath) return permitidos.has(mod.action ?? '');
            return mod.items.some(item => permitidos.has(item.action));
          })
          .map(mod => ({
            ...mod,
            items: mod.items.filter(item => permitidos.has(item.action))
          }))
      }))
      .filter(section => section.modules.length > 0);
  });

  constructor() {
    afterNextRender(() => {});
    effect(() => {
      if (this.menu().length) {
        this.openModule = this.getActiveModule();
      }
    });
  }

  getActiveModule(): string | null {
    for (const section of this.menu()) {
      for (const module of section.modules) {
        if (module.directPath && this.router.url.includes(`/${module.directPath}`))
          return module.name;
        if (module.items.some(item => this.router.url.includes(`/${item.path}`)))
          return module.name;
      }
    }
    return null;
  }

  toggleModule(module: any) {
    this.openModule = this.openModule === module.name ? null : module.name;
  }

  isAnyChildActive(items: any[]): boolean {
    return items.some(item => this.router.url === `/${item.path}`);
  }

  user() {
    return this.auth.getUserInfo();
  }

  avatarInitial(): string {
    const u = this.user();
    return u?.nombre?.charAt(0)?.toUpperCase() ?? '?';
  }

  avatarColor(): string {
    const colors = ['av-c0','av-c1','av-c2','av-c3','av-c4','av-c5'];
    const name = this.user()?.nombre ?? '';
    return colors[name.charCodeAt(0) % colors.length] ?? 'av-c0';
  }
}
