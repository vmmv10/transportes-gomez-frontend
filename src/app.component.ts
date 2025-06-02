import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule],
    template: `<router-outlet></router-outlet>`
})
export class AppComponent {
    private authService = inject(AuthService);
    private destroy$ = new Subject<void>();
    isAuthenticated: boolean = false;

    ngOnInit(): void {
        this.authService.isAuthenticated$.pipe(takeUntil(this.destroy$)).subscribe(isAuthenticated => {
            this.isAuthenticated = isAuthenticated
        })

    }


    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
