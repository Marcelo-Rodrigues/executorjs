import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampoCodigoComponent } from './campo-codigo.component';

describe('CampoCodigoComponent', () => {
  let component: CampoCodigoComponent;
  let fixture: ComponentFixture<CampoCodigoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampoCodigoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampoCodigoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
