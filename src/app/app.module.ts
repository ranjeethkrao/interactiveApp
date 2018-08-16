import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // this is needed!
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import * as firebase from 'firebase';

import { fb } from '../environments/firebase';
import { AppComponent } from './app.component';
import { SidebarModule } from './sidebar/sidebar.module';
import { FooterModule } from './shared/footer/footer.module';
import { NavbarModule} from './shared/navbar/navbar.module';
import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';

import { AppRoutes } from './app.routing';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './services/auth.guard';

firebase.initializeApp(fb.firebase);

@NgModule({
    imports:[
        CommonModule,
        BrowserAnimationsModule,
        FormsModule,
        RouterModule.forRoot(AppRoutes, {useHash: true}),
        HttpModule,
        SidebarModule,
        NavbarModule,
        FooterModule    
    ],
    declarations: [
        AppComponent,
        AdminLayoutComponent,
        AuthLayoutComponent
    ],
    providers: [
        AuthService,
        AuthGuard
      ],
    bootstrap:[ 
        AppComponent 
    ]
})
export class AppModule { }
