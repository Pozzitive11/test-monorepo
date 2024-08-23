import { ComponentFixture, TestBed } from '@angular/core/testing'

import { QualityEditRowTableComponent } from './quality-edit-row-table.component'

describe('QualityEditRowTableComponent', () => {
  let component: QualityEditRowTableComponent
  let fixture: ComponentFixture<QualityEditRowTableComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [QualityEditRowTableComponent]
    })
    fixture = TestBed.createComponent(QualityEditRowTableComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
