import { Component, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { LayoutService } from '../service/layout.service';
import { AuthService } from '@auth0/auth0-angular';
import { TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, TooltipModule],
    template: ` <div class="layout-topbar">
        <div class="layout-topbar-brand">
            <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()" aria-label="Menú">
                <i class="pi pi-bars"></i>
            </button>
            <a class="layout-topbar-logo layout-topbar-brand-link" routerLink="/">
                <img class="layout-topbar-brand-image" src="assets/images/icon.png" alt="Logo Transporte Gomez" width="40" height="40" />
                <span class="layout-topbar-brand-text">
                    <span class="layout-topbar-brand-kicker">Transportes</span>
                    <span class="layout-topbar-brand-name hidden md:block">Gomez Velásquez</span>
                    <span class="layout-topbar-brand-name md:hidden">GV</span>
                </span>
            </a>
        </div>

        <div class="layout-topbar-actions">
            <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()" [pTooltip]="layoutService.isDarkTheme() ? 'Modo claro' : 'Modo oscuro'" tooltipPosition="bottom">
                <i [ngClass]="{ pi: true, 'pi-moon': layoutService.isDarkTheme(), 'pi-sun': !layoutService.isDarkTheme() }"></i>
            </button>

            <button type="button" class="layout-topbar-action" pTooltip="Notificaciones" tooltipPosition="bottom">
                <i class="pi pi-bell"></i>
            </button>

            <span class="layout-topbar-divider hidden md:block"></span>

            <div class="layout-topbar-user-wrapper" *ngIf="authService.user$ | async as user">
                <button
                    type="button"
                    class="layout-topbar-user"
                    pStyleClass="@next"
                    enterFromClass="hidden"
                    enterActiveClass="animate-scalein"
                    leaveToClass="hidden"
                    leaveActiveClass="animate-fadeout"
                    [hideOnOutsideClick]="true"
                >
                    <img *ngIf="user.picture; else iniciales" class="layout-topbar-avatar" [src]="user.picture" [alt]="user.name" referrerpolicy="no-referrer" />
                    <ng-template #iniciales>
                        <span class="layout-topbar-avatar">{{ getIniciales(getNombre(user)) }}</span>
                    </ng-template>
                    <span class="layout-topbar-user-info hidden md:flex">
                        <span class="layout-topbar-user-name">{{ getNombre(user) }}</span>
                        <span class="layout-topbar-user-email">{{ user.name && !user.name.includes('@') ? user.email : 'Mi cuenta' }}</span>
                    </span>
                    <i class="pi pi-chevron-down layout-topbar-user-caret"></i>
                </button>

                <div class="layout-topbar-dropdown hidden">
                    <div class="layout-topbar-dropdown-header">
                        <span class="layout-topbar-user-name">{{ getNombre(user) }}</span>
                        <span class="layout-topbar-user-email">{{ user.email }}</span>
                    </div>
                    <a class="layout-topbar-dropdown-item" [routerLink]="['/usuarios/perfil']">
                        <i class="pi pi-user"></i>
                        <span>Mi perfil</span>
                    </a>
                    <button type="button" class="layout-topbar-dropdown-item layout-topbar-dropdown-item-danger" (click)="logout()">
                        <i class="pi pi-sign-out"></i>
                        <span>Cerrar sesión</span>
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

    getNombre(user: { name?: string; given_name?: string; email?: string }): string {
        const nombre = user.given_name || user.name || user.email || '';
        return nombre.includes('@') ? nombre.split('@')[0] : nombre;
    }

    getIniciales(nombre?: string): string {
        if (!nombre) {
            return '?';
        }
        const partes = nombre.split('@')[0].trim().split(/\s+/);
        return partes
            .slice(0, 2)
            .map((p) => p.charAt(0).toUpperCase())
            .join('');
    }

    logout() {
        this.authService.logout();
    }
}
