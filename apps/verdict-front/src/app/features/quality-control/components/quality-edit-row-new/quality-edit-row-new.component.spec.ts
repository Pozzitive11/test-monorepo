import { ComponentFixture, TestBed } from '@angular/core/testing'

import { QualityEditRowNewComponent } from './quality-edit-row-new.component'

describe('QualityEditRowNewComponent', () => {
  let component: QualityEditRowNewComponent
  let fixture: ComponentFixture<QualityEditRowNewComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [QualityEditRowNewComponent]
    })
    fixture = TestBed.createComponent(QualityEditRowNewComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
