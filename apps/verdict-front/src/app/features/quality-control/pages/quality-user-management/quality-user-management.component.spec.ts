import { ComponentFixture, TestBed } from '@angular/core/testing'

import { QualityUserManagementComponent } from './quality-user-management.component'

describe('QualityUserManagementComponent', () => {
  let component: QualityUserManagementComponent
  let fixture: ComponentFixture<QualityUserManagementComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [QualityUserManagementComponent]
    })
    fixture = TestBed.createComponent(QualityUserManagementComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
