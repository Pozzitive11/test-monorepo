import { ComponentFixture, TestBed } from '@angular/core/testing'

import { LrOthersEpCardComponent } from './lr-others-ep-card.component'

describe('LrOthersEpCardComponent', () => {
  let component: LrOthersEpCardComponent
  let fixture: ComponentFixture<LrOthersEpCardComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LrOthersEpCardComponent]
    })
      .compileComponents()

    fixture = TestBed.createComponent(LrOthersEpCardComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
