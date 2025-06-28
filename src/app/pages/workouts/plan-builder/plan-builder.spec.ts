import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanBuilder } from './plan-builder';

describe('PlanBuilder', () => {
  let component: PlanBuilder;
  let fixture: ComponentFixture<PlanBuilder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanBuilder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanBuilder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
