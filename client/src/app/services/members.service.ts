import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../models/member';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  baseUrl = environment.apiUrl;

  constructor(private hhtp: HttpClient) {}

  getMembers() {
    return this.hhtp.get<Member[]>(this.baseUrl + 'users');
  }

  getMember(username: string) {
    return this.hhtp.get<Member>(this.baseUrl + 'users/' + username);
  }


}
