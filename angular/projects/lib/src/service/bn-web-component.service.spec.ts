import { TestBed } from '@angular/core/testing';

import { BnWebComponentbService } from './bn-web-component.service';

describe('BnWebComponentbService', () => {
  let service: BnWebComponentbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BnWebComponentbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
