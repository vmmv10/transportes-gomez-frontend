import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { Subject, takeUntil } from 'rxjs';
import { PrimeNG } from 'primeng/config';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule],
    template: `<router-outlet></router-outlet>`,
})
export class AppComponent {
    private authService = inject(AuthService);
    private destroy$ = new Subject<void>();
    isAuthenticated: boolean = false;

    constructor(private config: PrimeNG) {}

    ngOnInit(): void {
        this.authService.isAuthenticated$.pipe(takeUntil(this.destroy$)).subscribe(isAuthenticated => {
            this.isAuthenticated = isAuthenticated
        })

        this.config.setTranslation({
            dayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
            dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
            dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
            monthNames: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
            monthNamesShort: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
            today: 'Hoy',
            clear: 'Limpiar',
            dateFormat: 'dd/mm/yy',
            firstDayOfWeek: 1
        });

    }


    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
