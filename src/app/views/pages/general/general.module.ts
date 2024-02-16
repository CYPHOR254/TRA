import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeatherIconModule } from '../../../core/feather-icon/feather-icon.module';

import {
  NgbAccordionModule,
  NgbDropdownModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';

import { GeneralComponent } from './general.component';
import { BlankComponent } from './blank/blank.component';

import { Routes, RouterModule } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../../../shared/shared.module';
import { FeedbackComponent } from './feedback/feedback.component';
import { LandingHeaderComponent } from './landing-header/landing-header.component';
import { LandingFooterComponent } from './landing-footer/landing-footer.component';

// const routes: Routes = [
//   {
//     path: '',
//     component: GeneralComponent,
//     children: [
//       {
//         path: 'blank-page',
//         component: BlankComponent,
//       },
//     ],
//   },
// ];

@NgModule({
  declarations: [
    GeneralComponent,
    BlankComponent,

    FeedbackComponent,
    LandingHeaderComponent,
    LandingFooterComponent,
  ],
  imports: [
    CommonModule,
    // RouterModule.forChild(routes),
    FeatherIconModule,
    NgbAccordionModule,
    NgbDropdownModule,
    NgbTooltipModule,
    NgxDatatableModule,
    SharedModule,
  ],
  exports: [FeedbackComponent, LandingHeaderComponent, LandingFooterComponent],
})
export class GeneralModule {}
