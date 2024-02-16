import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FeatherIconModule } from '../../../core/feather-icon/feather-icon.module';
import { SharedModule } from '../../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { HomeComponent } from './home.component';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { Ng2TelInputModule } from 'ng2-tel-input';
import { LandingPageComponent } from '../main/landing-page/landing-page.component';
import { GeneralModule } from '../general/general.module';
import { AllStandardsComponent } from '../main/all-standards/all-standards.component';
import { ViewStandardComponent } from '../main/view-standard/view-standard.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'landing',
        component: LandingPageComponent,
      },
      {
        path: 'all-standards',
        component: AllStandardsComponent,
      },
      {
        path: 'view/:id',
        component: ViewStandardComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [
    HomeComponent,

    LandingPageComponent,
    AllStandardsComponent,
    ViewStandardComponent,
  ],
  imports: [
    CommonModule,
    Ng2TelInputModule,
    RouterModule.forChild(routes),
    SharedModule,
    NgbModule,
    CarouselModule,
    ReactiveFormsModule,
    FeatherIconModule,
    TranslateModule,
    GeneralModule,
  ],
  exports: [],
  providers: [NgbActiveModal],
})
export class HomeModule {}
