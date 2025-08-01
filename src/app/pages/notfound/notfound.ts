import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { ImageModule } from 'primeng/image';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-notfound',
    standalone: true,
    imports: [RouterModule, CommonModule, AppFloatingConfigurator, ButtonModule, ImageModule],
    template: ` <app-floating-configurator />
        <div
            class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden"
            [ngStyle]="{
                'background-image': 'url(/assets/images/not-found.jpg)',
                'background-size': 'cover',
                'background-position': 'center',
                'background-repeat': 'no-repeat'
            }"
        >
            <div class="flex flex-col items-center opacity-90 justify-center">
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, color-mix(in srgb, #2178bd, transparent 60%) 10%, var(--surface-ground) 30%)">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20 flex flex-col items-center" style="border-radius: 53px">
                        <p-image src="/assets/images/logo_transparente.png" alt="Logo Transporte Gomez" width="200" height="200" />
                        <span class="font-bold text-3xl" style="color: #2178bd;">404</span>
                        <h1 class="text-surface-900 dark:text-surface-0 font-bold text-3xl lg:text-5xl mb-2">Pagina No Encontrada</h1>
                        <div class="text-surface-600 font-bold dark:text-surface-200 mb-8">El recurso solicitado no está disponible.</div>
                        <p-button severity="info" label="Volver a Inicio" routerLink="/" size="large" />
                    </div>
                </div>
            </div>
        </div>`
})
export class Notfound {}
