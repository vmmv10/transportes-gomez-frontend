import { HTTP_INTERCEPTORS, provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import Aura from '@primeng/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { appRoutes } from './app.routes';
import { AuthModule } from '@auth0/auth0-angular';
import { environment } from './environments';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(appRoutes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }), withEnabledBlockingInitialNavigation()),
        provideHttpClient(withFetch()),
        provideAnimationsAsync(),
        providePrimeNG({ theme: { preset: Aura, options: { darkModeSelector: '.app-dark' } } }),
        importProvidersFrom(
            AuthModule.forRoot({
                domain: environment.domain,
                clientId: environment.production ? environment.clientId : environment.clientIdQa,
                authorizationParams: {
                    redirect_uri: window.location.origin,
                    audience: environment.production ? 'https://www.transportesgv.cl/api' : 'http://localhost:8081'
                },
                httpInterceptor: {
                    allowedList: [
                        {
                            uri: environment.production ? 'https://www.transportesgv.cl/api/*' : 'http://localhost:8081/api/*',
                            tokenOptions: {
                                authorizationParams: {
                                    audience: environment.production ? 'https://www.transportesgv.cl/api' : 'http://localhost:8081'
                                }
                            }
                        }
                    ]
                }
            })
        )
    ]
};
