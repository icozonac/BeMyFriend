import { Component, OnInit } from '@angular/core';
import {
  fadeInLeftAnimation,
  fadeInRightAnimation,
} from 'lib';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    fadeInLeftAnimation({ anchor: 'enterLeft' }),
    fadeInRightAnimation({ anchor: 'enterRight', delay: 600 }),
  ],
})
export class HomeComponent implements OnInit {
  users: any;
  animationState = false;

  constructor() {}

  ngOnInit(): void {
    setTimeout(() => {
      this.animationState = true;
    }, 1);
  }
}
