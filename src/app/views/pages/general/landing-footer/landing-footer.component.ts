import {
  Component,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
  Type,
} from '@angular/core';

@Component({
  selector: 'app-landing-footer',
  templateUrl: './landing-footer.component.html',
  styleUrls: ['./landing-footer.component.scss'],
})
export class LandingFooterComponent implements OnInit {
  showLeaveCommentForm: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  toggleLeaveCommentForm() {
    if (this.showLeaveCommentForm) {
      this.showLeaveCommentForm = false;
    } else {
      this.showLeaveCommentForm = true;
    }
  }
}
