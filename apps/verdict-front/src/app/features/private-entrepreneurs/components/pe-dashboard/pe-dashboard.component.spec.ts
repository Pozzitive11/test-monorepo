import { ComponentFixture, TestBed } from '@angular/core/testing'

import { PeDashboardComponent } from './pe-dashboard.component'

describe('PeDashboardComponent', () => {
  let component: PeDashboardComponent
  let fixture: ComponentFixture<PeDashboardComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeDashboardComponent]
    })
      .compileComponents()

    fixture = TestBed.createComponent(PeDashboardComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
