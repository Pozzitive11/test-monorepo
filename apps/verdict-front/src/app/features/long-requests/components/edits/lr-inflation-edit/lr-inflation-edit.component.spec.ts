import { ComponentFixture, TestBed } from '@angular/core/testing'

import { LrInflationEditComponent } from './lr-inflation-edit.component'

describe('LrInflationEditComponent', () => {
  let component: LrInflationEditComponent
  let fixture: ComponentFixture<LrInflationEditComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LrInflationEditComponent]
    })
      .compileComponents()

    fixture = TestBed.createComponent(LrInflationEditComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
