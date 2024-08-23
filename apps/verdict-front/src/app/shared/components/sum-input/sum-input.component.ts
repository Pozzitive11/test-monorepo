import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { UtilFunctions } from '../../utils/util.functions'
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'app-sum-input',
  templateUrl: './sum-input.component.html',
  standalone: true,
  imports: [FormsModule]
})
export class SumInputComponent implements OnInit {
  @Input() maxSum: number = Infinity
  @Input() minSum: number = 0
  @Input() sum: number | undefined = 0

  @Output() sumChange = new EventEmitter<number>()
  @Output() inputBlur = new EventEmitter()

  get sumString(): string {
    return UtilFunctions.formatNumber(this.sum)
  }

  set sumString(newSum) {
    this.sum = UtilFunctions.nfs(newSum)
    this.changeSum()
  }

  ngOnInit(): void {
    if (!this.sum)
      this.sum = 0
  }

  changeSum() {
    if ((this.sum || 0) > this.maxSum)
      this.sum = this.maxSum
    if ((this.sum || 0) < this.minSum)
      this.sum = this.minSum

    this.sumChange.emit(this.sum)
  }
}
