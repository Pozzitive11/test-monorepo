import { ComponentFixture, TestBed } from '@angular/core/testing'

import { QualityUserUpdateComponent } from './quality-user-update.component'

describe('QualityUserUpdateComponent', () => {
  let component: QualityUserUpdateComponent
  let fixture: ComponentFixture<QualityUserUpdateComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [QualityUserUpdateComponent]
    })
    fixture = TestBed.createComponent(QualityUserUpdateComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
