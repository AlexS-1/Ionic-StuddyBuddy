import { TestBed } from '@angular/core/testing';

import { DbFirebaseService } from './db-firebase.service';

describe('DbFirebaseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DbFirebaseService = TestBed.get(DbFirebaseService);
    expect(service).toBeTruthy();
  });
});
