import { Component, inject,resource,computed,signal, afterNextRender, effect } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { MenuSection,MenuItem,MenuModule } from "./menu.model";
import { firstValueFrom } from "rxjs";
import { RouterLink, Router } from "@angular/router";
@Component({
    selector : 'app-sidebar',
    templateUrl : './sidebar.html',
    styleUrl:'./sidebar.css',
    imports: [RouterLink]
})
export class Sidebar {
    router = inject(Router);
    openModule: string | null = null;
    constructor() {
        afterNextRender(() => {
            console.log('DOM listo');
        });
        
        effect(() => {
            if (this.menu().length) {
                this.openModule = this.getActiveModule();
                console.log('Menú cargado y renderizado');
               
                this.jqueryload()
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
        getActiveModule(): string | null {
        for (let section of this.menu()) {
            for (let module of section.modules) {
            if (module.items.some(item => this.router.url.includes(`/${item.path}`))) {
                return module.name;
            }
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
    jqueryload(){
        // update sidebar menu height
        function update_sidebar_menu_height() {
            let headerHeight = 60;
            let footerHeight = 60;
            let menuHeight = $(window).height()?? 0 - (headerHeight + footerHeight)
            $('.app-sidebar-menu').css('height',  menuHeight + 'px');
        }
    
        $(window).on('resize', function(){
            update_sidebar_menu_height()
        });
    
    
        // initialize
        (function() {
            update_sidebar_menu_height();
        })();

        $('.app-sidebar-open-btn').on('click', function(e){
            e.preventDefault();
            $('.app-sidebar').removeClass('open');
            if($(this).hasClass('collapsed')) {
                $(this).removeClass('collapsed');
                $('.app-sidebar').removeClass('collapsed')
            }
            else {
                $(this).addClass('collapsed');
                $('.app-sidebar').addClass('collapsed')
            }
        })

        $('.app-sidebar-mobile-open').on('click', function(){
            $('.app-sidebar').removeClass('collapsed').addClass('open');
            $('.app-backdrop').addClass('show');
        });

        $('.app-sidebar-mobile-close').on('click', function(){
            $('.app-sidebar').removeClass('collapsed').removeClass('open');
            $('.app-backdrop').removeClass('show');
        });

        $('.app-backdrop').on('click', function(){
            $('#app-wrapper').removeClass('open');
            $('#app-sidebar').removeClass('open');
            $(this).removeClass('show');
        });
    }
}