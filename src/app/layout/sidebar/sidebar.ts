import {
  Component, inject, resource, computed,
  signal, afterNextRender, effect
} from '@angular/core';
import { HttpClient }      from '@angular/common/http';
import { RouterLink, Router } from '@angular/router';
import { firstValueFrom }  from 'rxjs';

import { MenuSection }         from './menu.model';
import { AuthService }         from '../../core/services/auth.service';
import { PermisoRolService }   from '../../features/maintenance/services/permiso-rol.service';

@Component({
  selector:    'app-sidebar',
  templateUrl: './sidebar.html',
  styleUrl:    './sidebar.css',
  imports:     [RouterLink],
})
export class Sidebar {
  router       = inject(Router);
  auth         = inject(AuthService);
  permisoSvc   = inject(PermisoRolService);
  openModule: string | null = null;

  private http = inject(HttpClient);

  // ── Carga el menú completo desde assets ────────────────────────────────────
  menuResource = resource({
    loader: () => firstValueFrom(
      this.http.get<MenuSection[]>('assets/main-menu.json')
    )
  });

  // ── Carga las URIs de vistas autorizadas para el usuario autenticado ────────
  vistasResource = resource({
    loader: () => firstValueFrom(this.permisoSvc.getMisVistas())
  });

  // Set de URIs autorizadas (lookup O(1))
  private permisosSet = computed<Set<string>>(() => {
    return new Set(this.vistasResource.value() ?? []);
  });

  // ── Menú filtrado: solo items/módulos que el rol puede ver ─────────────────
  menu = computed<MenuSection[]>(() => {
    if (this.menuResource.error()) return [];
    const raw = this.menuResource.value() ?? [];

    // Si el usuario tiene acceso total, devolver el menú completo sin filtrar
    if (this.auth.getUserInfo()?.hasFullAccess) return raw;

    const permitidos = this.permisosSet();

    // Si los permisos todavía no cargaron, no mostramos nada aún
    if (this.vistasResource.isLoading()) return [];

    return raw
      .map(section => ({
        ...section,
        modules: section.modules
          // Módulo de link directo (directPath) → visible si action está permitido
          .filter(mod => {
            if (mod.directPath) return permitidos.has(mod.action ?? '');
            // Módulo con subitems → al menos uno visible
            return mod.items.some(item => permitidos.has(item.action));
          })
          // Filtrar subitems individuales
          .map(mod => ({
            ...mod,
            items: mod.items.filter(item => permitidos.has(item.action))
          }))
      }))
      // Eliminar secciones que quedaron vacías
      .filter(section => section.modules.length > 0);
  });

  expandedSections = signal<Set<string>>(new Set());

  constructor() {
    afterNextRender(() => {});

    effect(() => {
      if (this.menu().length) {
        this.openModule = this.getActiveModule();
        this.jqueryload();
      }
    });
  }

  toggleSection(name: string) {
    const current = new Set(this.expandedSections());
    current.has(name) ? current.delete(name) : current.add(name);
    this.expandedSections.set(current);
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

  isExpanded(name: string): boolean {
    return this.expandedSections().has(name);
  }

  isAnyChildActive(items: any[]): boolean {
    return items.some(item => this.router.url === `/${item.path}`);
  }

  logout(_event: any) {
    this.auth.logout();
  }

  jqueryload() {
    function update_sidebar_menu_height() {
      const headerHeight = 60;
      const footerHeight = 60;
      const menuHeight   = ($(window).height() ?? 0) - (headerHeight + footerHeight);
      $('.app-sidebar-menu').css('height', menuHeight + 'px');
    }
    $(window).on('resize', update_sidebar_menu_height);
    update_sidebar_menu_height();

    $('.app-sidebar-open-btn').on('click', function (e) {
      e.preventDefault();
      $('.app-sidebar').removeClass('open');
      if ($(this).hasClass('collapsed')) {
        $(this).removeClass('collapsed');
        $('.app-sidebar').removeClass('collapsed');
      } else {
        $(this).addClass('collapsed');
        $('.app-sidebar').addClass('collapsed');
      }
    });

    $('.app-sidebar-mobile-open').on('click', function () {
      $('.app-sidebar').removeClass('collapsed').addClass('open');
      $('.app-backdrop').addClass('show');
    });

    $('.app-sidebar-mobile-close').on('click', function () {
      $('.app-sidebar').removeClass('collapsed').removeClass('open');
      $('.app-backdrop').removeClass('show');
    });

    $('.app-backdrop').on('click', function () {
      $('#app-wrapper').removeClass('open');
      $('#app-sidebar').removeClass('open');
      $(this).removeClass('show');
    });
  }
}
