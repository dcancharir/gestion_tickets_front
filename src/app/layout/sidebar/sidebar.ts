import { Component, inject,resource,computed,signal, afterNextRender, effect } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { MenuSection,MenuItem,MenuModule } from "./menu.model";
import { firstValueFrom } from "rxjs";
import { RouterLink, Router } from "@angular/router";
@Component({
    selector : 'app-sidebar',
    templateUrl : './sidebar.html',
    imports: [RouterLink]
})
export class Sidebar {
    router = inject(Router);
    constructor() {
        afterNextRender(() => {
            console.log('DOM listo');
        });
        
        effect(() => {
            if (this.menu().length) {
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

    isExpanded(name: string): boolean {
        return this.expandedSections().has(name);
    }
    jqueryload(){
        const url = this.router.url;
        console.log('URL actual:', url);
        console.log('Menú actual:', this.menu());
        this.menu().forEach(section => {
            section.modules.forEach(module => {
                module.items.forEach(item => {
                    console.log('Comparando:', item.path, url);
                    if (item.path === url) {
                        console.log(item.path, url);
                        // Marcar el enlace como activo
                        $(`.app-sidebar-menu-item a[href="/${item.path}"]`).addClass('active');
                        $(`.app-sidebar-menu-item a[href="/${item.path}"]`).addClass('current-menu');
                        // Expandir la sección correspondiente
                        $(`.app-sidebar-menu-item a[href="/${item.path}"]`).closest('.app-sidebar-submenu').show();
                        $(`.app-sidebar-menu-item a[href="/${item.path}"]`).closest('.app-sidebar-submenu').prev('.menu-link').addClass('active');
                    }
                });
            });
        });

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

        $('.app-sidebar-menu-item').each(function() {
            let $this = $(this);
            if ($this.find('.menu-current').length > 0) {
                $this.find('.menu-current').addClass('active');
                $this.parent().show()
                $this.parent().parent().children('.menu-link').addClass('active')
            }
        });
    
        // list open hidden
        $('.menu-link').on('click', function() {
            $(this).toggleClass('active');
            $(this).next('.app-sidebar-submenu').slideToggle(300);
        });
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