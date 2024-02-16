import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth.component';
import {ForgotPasswordComponent} from "./forgot-password/forgot-password.component";
import {ReactiveFormsModule} from "@angular/forms";
import {FeatherIconModule} from "../../../core/feather-icon/feather-icon.module";
import {SharedModule} from "../../../shared/shared.module";
import {TranslateModule} from "@ngx-translate/core";
import {FirstTimeLoginComponent} from "./first-time-login/first-time-login.component";
import {ChangePasswordComponent} from "./change-password/change-password.component";
import { ChangeAuthPasswordComponent } from './changePassword/changePassword.component';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [

      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'activate',
        component: RegisterComponent
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent
      },
      {
        path: 'first-time-password',
        component: FirstTimeLoginComponent
      },
      {
        path: 'change-password',
        component: ChangePasswordComponent
      },
      {
        path: 'change-auth-password',
        component: ChangeAuthPasswordComponent
      }

    ]
  },
]

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    AuthComponent,
    FirstTimeLoginComponent,
    ChangePasswordComponent,
    ChangeAuthPasswordComponent
  ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        SharedModule,
        ReactiveFormsModule,
        FeatherIconModule,
        TranslateModule,
    ]
})
export class AuthModule { }
