import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing-header',
  templateUrl: './landing-header.component.html',
  styleUrls: ['./landing-header.component.scss'],
})
export class LandingHeaderComponent implements OnInit {
  // showMenuItems: boolean = true;
  // showDashbord: boolean = false;
  profile: string | null;

  constructor() {

  }

  ngOnInit(): void {}
}
