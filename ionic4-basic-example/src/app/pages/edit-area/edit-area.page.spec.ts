import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAreaPage } from './edit-area.page';

describe('EditAreaPage', () => {
  let component: EditAreaPage;
  let fixture: ComponentFixture<EditAreaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAreaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAreaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
