import { ComponentFixture, TestBed } from '@angular/core/testing'

import { QualityUserDeleteComponent } from './quality-user-delete.component'

describe('QualityUserDeleteComponent', () => {
  let component: QualityUserDeleteComponent
  let fixture: ComponentFixture<QualityUserDeleteComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [QualityUserDeleteComponent]
    })
    fixture = TestBed.createComponent(QualityUserDeleteComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
