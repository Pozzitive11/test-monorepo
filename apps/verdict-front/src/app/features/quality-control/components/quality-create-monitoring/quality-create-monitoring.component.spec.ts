import { ComponentFixture, TestBed } from '@angular/core/testing'

import { QualityUserEditComponent } from './quality-user-edit.component'

describe('QualityUserEditComponent', () => {
  let component: QualityUserEditComponent
  let fixture: ComponentFixture<QualityUserEditComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [QualityUserEditComponent]
    })
    fixture = TestBed.createComponent(QualityUserEditComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
