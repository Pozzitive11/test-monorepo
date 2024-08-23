import { ComponentFixture, TestBed } from '@angular/core/testing'

import { QualityUserViewComponent } from './quality-user-view.component'

describe('QualityUserViewComponent', () => {
  let component: QualityUserViewComponent
  let fixture: ComponentFixture<QualityUserViewComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [QualityUserViewComponent]
    })
    fixture = TestBed.createComponent(QualityUserViewComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
