import { ComponentFixture, TestBed } from '@angular/core/testing'

import { QualityReportManagementComponent } from './quality-report-management.component'

describe('QualityReportManagementComponent', () => {
  let component: QualityReportManagementComponent
  let fixture: ComponentFixture<QualityReportManagementComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [QualityReportManagementComponent]
    })
    fixture = TestBed.createComponent(QualityReportManagementComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
