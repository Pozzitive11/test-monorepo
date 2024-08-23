import { ComponentFixture, TestBed } from '@angular/core/testing'

import { QualityMonitoringManagementComponent } from './quality-monitoring-management.component'

describe('QualityMonitoringManagementComponent', () => {
  let component: QualityMonitoringManagementComponent
  let fixture: ComponentFixture<QualityMonitoringManagementComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [QualityMonitoringManagementComponent]
    })
    fixture = TestBed.createComponent(QualityMonitoringManagementComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
