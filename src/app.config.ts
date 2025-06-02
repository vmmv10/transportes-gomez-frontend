import { HTTP_INTERCEPTORS, provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import Aura from '@primeng/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { appRoutes } from './app.routes';
import { AuthModule } from '@auth0/auth0-angular';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(
            appRoutes,
            withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
            withEnabledBlockingInitialNavigation()
        ),
        provideHttpClient(withFetch()),
        provideAnimationsAsync(),
        providePrimeNG({ theme: { preset: Aura, options: { darkModeSelector: '.app-dark' } } }),
        importProvidersFrom(
            AuthModule.forRoot({
                domain: 'dev-7y2aghw84icxg0pg.us.auth0.com',
                clientId: '9g06n4aAaWB6BZEtI1Q9d8tuzfRDeSBN',
                authorizationParams: {
                    redirect_uri: window.location.origin,
                    audience: 'http://localhost:8081',
                },
                httpInterceptor: {
                    allowedList: [
                        {
                            uri: 'http://localhost:8081/api/*',
                            tokenOptions: {
                                authorizationParams: {
                                    audience: 'http://localhost:8081',
                                }
                            }
                        }
                    ]
                }
            })
        ),
    ]
};
