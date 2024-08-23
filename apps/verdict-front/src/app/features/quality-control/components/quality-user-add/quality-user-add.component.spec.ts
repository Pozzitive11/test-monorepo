import { ComponentFixture, TestBed } from '@angular/core/testing'

import { QualityUserAddComponent } from './quality-user-add.component'

describe('QualityUserAddComponent', () => {
  let component: QualityUserAddComponent
  let fixture: ComponentFixture<QualityUserAddComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [QualityUserAddComponent]
    })
    fixture = TestBed.createComponent(QualityUserAddComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
