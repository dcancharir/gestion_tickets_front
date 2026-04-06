import { Component, inject,resource,computed,signal, afterNextRender, effect } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { MenuSection,MenuItem,MenuModule } from "./menu.model";
import { firstValueFrom } from "rxjs";
import { RouterLink } from "@angular/router";
@Component({
    selector : 'app-sidebar',
    templateUrl : './sidebar.html',
    imports: [RouterLink]
})
export class Sidebar {
    constructor() {
        afterNextRender(() => {
            console.log('DOM listo');
        });

        effect(() => {
            if (this.menu().length) {
                console.log('Menú cargado y renderizado');
            }
        });
    }
    private http = inject(HttpClient);
       // resource para cargar el JSON
    menuResource = resource({
        loader: () => firstValueFrom(this.http.get<MenuSection[]>('assets/main-menu.json'))
    });

    // signal derivada (opcional)
    menu = computed(() => this.menuResource.value() ?? []);

    // estado UI (expandir/collapse)
    expandedSections = signal<Set<string>>(new Set());
        toggleSection(name: string) {
        const current = new Set(this.expandedSections());
        current.has(name) ? current.delete(name) : current.add(name);
        this.expandedSections.set(current);
    }

    isExpanded(name: string): boolean {
        return this.expandedSections().has(name);
    }
}