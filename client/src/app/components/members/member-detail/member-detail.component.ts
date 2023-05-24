import { MembersService } from 'src/app/services/members.service';
import { Member } from './../../../models/member';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryOptions } from '@kolkov/ngx-gallery';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.scss'],
})
export class MemberDetailComponent implements OnInit {
  member: Member | undefined;
  galleryOptions: NgxGalleryOptions[] = [];
  galleryImages: { small: string; medium: string; big: string }[] = [];

  constructor(
    private memberService: MembersService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadMember();

    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false,
      },
    ];

    this.galleryImages = this.getImages();
  }

  getImages() {
    if (!this.member) return [];
    const imageUrls = [];
    for (const photo of this.member.photos) {
      imageUrls.push({
        small: photo.url,
        medium: photo.url,
        big: photo.url,
      });
    }
    return imageUrls;
  }

  loadMember() {
    const username = this.route.snapshot.paramMap.get('username');
    if (!username) return;
    this.memberService.getMember(username).subscribe({
      next: (member) => {
        this.member = member;
        this.galleryImages = this.getImages();
      },
    });
  }
}
