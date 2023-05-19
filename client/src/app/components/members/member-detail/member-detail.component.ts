import { Member } from './../../../models/member';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.scss'],
})
export class MemberDetailComponent implements OnInit {
  member: Member | undefined;

  constructor() {}

  ngOnInit(): void {}
}
