import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { AuthService } from '@auth0/auth0-angular';
import { CommonModule } from '@angular/common';
import { ImageModule } from 'primeng/image';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator, CommonModule, ImageModule],
    templateUrl: './login.html'
})
export class Login {
    private authService = inject(AuthService);
    private router = inject(Router);

    login() {
        console.log('Login clicked', this.email, this.password, this.checked);
        this.authService.loginWithRedirect();
    }

    email: string = '';

    password: string = '';

    checked: boolean = false;
}
