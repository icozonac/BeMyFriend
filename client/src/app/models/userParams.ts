import { User } from './user';

export class UserParams {
  gender: string;
  minAge = 12;
  maxAge = 99;
  pageNumber = 1;
  pageSize = 8;
  orderBy = 'lastActive';

  constructor(user: User) {
    this.gender = 'all';
  }
}
