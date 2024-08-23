import { ComponentFixture, TestBed } from '@angular/core/testing'

import { QualityMainPageComponent } from './quality-main-page.component'

describe('QualityMainPageComponent', () => {
  let component: QualityMainPageComponent
  let fixture: ComponentFixture<QualityMainPageComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [QualityMainPageComponent]
    })
    fixture = TestBed.createComponent(QualityMainPageComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
