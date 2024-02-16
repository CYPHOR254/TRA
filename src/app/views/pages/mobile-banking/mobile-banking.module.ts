import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FeatherIconModule } from '../../../core/feather-icon/feather-icon.module';
import { SharedModule } from '../../../shared/shared.module';
import { MobileBankingComponent } from './mobile-banking.component';
import { TranslateModule } from '@ngx-translate/core';
import { AuthGuard } from 'src/app/core/guard/auth.guard';
import { Ng2TelInputModule } from 'ng2-tel-input';
import { OurTeamComponent } from './our-team/our-team.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ReportsResultsComponent } from './reports-results/reports-results.component';
import { MyRequestsComponent } from './my-requests/my-requests.component';
import { AllCriteriaComponent } from './all-criteria/all-criteria.component';
import { AllStandardsComponent } from './all-standards/all-standards.component';
import { MakeRequestComponent } from './make-request/make-request.component';
import { ViewStandComponent } from './view-stand/view-stand.component';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';

const routes: Routes = [
  {
    path: '',
    component: MobileBankingComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'our-team',
        component: OurTeamComponent,
      },
      {
        path: 'report-results',
        component: ReportsResultsComponent,
      },
      {
        path: 'my-requests',
        component: MyRequestsComponent,
      },
      {
        path: 'make-request',
        component: MakeRequestComponent,
      },
      {
        path: 'criteria',
        component: AllCriteriaComponent,
      },
      {
        path: 'all-standards',
        component: AllStandardsComponent,
      },
      {
        path: 'standard/:id',
        component: ViewStandComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [
    MobileBankingComponent,
    OurTeamComponent,
    ReportsResultsComponent,
    MyRequestsComponent,
    AllCriteriaComponent,
    AllStandardsComponent,
    MakeRequestComponent,
    ViewStandComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    ReactiveFormsModule,
    Ng2TelInputModule,
    FeatherIconModule,
    TranslateModule,
    CarouselModule,
    NgbProgressbarModule
  ],
  providers: [DatePipe],
})
export class MobileBankingModule {}
