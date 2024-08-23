import { ComponentFixture, TestBed } from '@angular/core/testing'

import { NumberFiltersComponent } from './number-filters.component'

describe('NumberFiltersComponent', () => {
  let component: NumberFiltersComponent
  let fixture: ComponentFixture<NumberFiltersComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NumberFiltersComponent]
    })
      .compileComponents()

    fixture = TestBed.createComponent(NumberFiltersComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
