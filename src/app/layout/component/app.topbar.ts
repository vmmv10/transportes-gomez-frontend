import { Component, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { LayoutService } from '../service/layout.service';
import { AuthService } from '@auth0/auth0-angular';
import { TooltipModule } from 'primeng/tooltip';
import { ImageModule } from 'primeng/image';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, TooltipModule, ImageModule],
    template: ` <div class="layout-topbar">
        <div class="flex flex-row gap-1 w-12 ">
            <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                <i class="pi pi-bars"></i>
            </button>
            <a class="flex flex-row gap-1 md:justify-content-start justify-content-center md:w-auto w-12" routerLink="/">
                <p-image src="/assets/images/icon.png" alt="Logo Transporte Gomez" width="40" height="40" />
                <span style="color: #2178bd" class="hidden md:flex font-bold text-2xl md:justify-content-center align-items-center">Transportes Gomez Velasquez</span>
                <span style="color: #2178bd" class="md:hidden flex font-bold text-2xl md:justify-content-center align-items-center">Transportes GV</span>
            </a>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()">
                    <i [ngClass]="{ 'pi ': true, 'pi-moon': layoutService.isDarkTheme(), 'pi-sun': !layoutService.isDarkTheme() }"></i>
                </button>
            </div>

            <button class="layout-topbar-menu-button layout-topbar-action" pStyleClass="@next" enterFromClass="hidden" enterActiveClass="animate-scalein" leaveToClass="hidden" leaveActiveClass="animate-fadeout" [hideOnOutsideClick]="true">
                <i class="pi pi-ellipsis-v"></i>
            </button>

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <button type="button" class="layout-topbar-action">
                        <i class="pi pi-inbox"></i>
                        <span>Notificaciones</span>
                    </button>
                    <button type="button" class="layout-topbar-action" [routerLink]="['/usuarios/perfil']" pTooltip="Perfil" tooltipPosition="bottom">
                        <i class="pi pi-user"></i>
                        <span>Perfil</span>
                    </button>
                    <button type="button" class="layout-topbar-action" (click)="logout()" pTooltip="Salir" tooltipPosition="bottom">
                        <i class="pi pi-sign-out"></i>
                        <span>Salir</span>
                    </button>
                </div>
            </div>
        </div>
    </div>`
})
export class AppTopbar {
    items!: MenuItem[];
    public authService = inject(AuthService);

    constructor(public layoutService: LayoutService) {}

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

    logout() {
        this.authService.logout();
    }
}
