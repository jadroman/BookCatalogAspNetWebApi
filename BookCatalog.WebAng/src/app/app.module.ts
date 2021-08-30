import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';
import { NotFoundComponent } from './error-pages/not-found/not-found.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';
import { AuthGuard } from './shared/guards/auth.guard';
import { DialogInfoComponent } from './shared/dialog-info/dialog-info.component';
import { MaterialModule } from './material.module';
import { DialogInfoService } from './shared/dialog-info/dialog-info.service';
import { DialogLoadingService } from './shared/dialog-loading/dialog-loading.service';
import { DialogLoadingComponent } from './shared/dialog-loading/dialog-loading.component';
import { CoreModule } from './core/core.module';

export function tokenGetter() {
  return localStorage.getItem("token");
}


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MenuComponent,
    NotFoundComponent,
    DialogInfoComponent,
    DialogLoadingComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MaterialModule, 
    CoreModule,
    RouterModule.forRoot([
      { path: 'home', component: HomeComponent },
      { path: 'category', loadChildren: () => 
                import('./category/category.module').then(m => m.CategoryModule), canActivate: [AuthGuard]  },
      { path: 'book', loadChildren: () => 
                import('./book/book.module').then(m => m.BookModule), canActivate: [AuthGuard]  },
      { path: 'authentication', loadChildren: () => 
                import('./authentication/authentication.module').then(m => m.AuthenticationModule) },
      { path: '404', component : NotFoundComponent},
      { path: '', redirectTo: '/home', pathMatch: 'full' },
      { path: '**', redirectTo: '/404', pathMatch: 'full'}
    ]),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter, 
        whitelistedDomains: ["localhost:5001", "bookcatalogwebapistaging.jadro.space"],
        blacklistedRoutes: []
      }
    }),
    BrowserAnimationsModule
  ],
  providers: [DialogInfoService, DialogLoadingService],
  bootstrap: [AppComponent]
})
export class AppModule { }
