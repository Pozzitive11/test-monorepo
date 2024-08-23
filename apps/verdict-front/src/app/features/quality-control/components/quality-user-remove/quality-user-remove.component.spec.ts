import { ComponentFixture, TestBed } from '@angular/core/testing'

import { QualityUserRemoveComponent } from './quality-user-remove.component'

describe('QualityUserRemoveComponent', () => {
  let component: QualityUserRemoveComponent
  let fixture: ComponentFixture<QualityUserRemoveComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [QualityUserRemoveComponent]
    })
    fixture = TestBed.createComponent(QualityUserRemoveComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
