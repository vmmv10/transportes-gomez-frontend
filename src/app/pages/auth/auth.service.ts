// auth.service.ts
import { Injectable } from '@angular/core';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private auth0: Auth0Service) { }

    async getAccessToken(): Promise<string> {
        try {
            console.log('Requesting access token...');
            return await firstValueFrom(this.auth0.getAccessTokenSilently());
        } catch (err) {
            console.error('Error getting token:', err);
            return '';
        }
    }
}
