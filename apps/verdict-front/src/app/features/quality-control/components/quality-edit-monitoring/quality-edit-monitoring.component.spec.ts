import { ComponentFixture, TestBed } from '@angular/core/testing'

import { QualityEditMonitoringComponent } from './quality-edit-monitoring.component'

describe('QualityEditMonitoringComponent', () => {
  let component: QualityEditMonitoringComponent
  let fixture: ComponentFixture<QualityEditMonitoringComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [QualityEditMonitoringComponent]
    })
    fixture = TestBed.createComponent(QualityEditMonitoringComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
