import { Component, DestroyRef, inject, Input, OnInit, signal } from '@angular/core'
import { AuthService } from '../../../../core/services/auth.service'
import { LwHttpService } from '../../services/lw-http.service'
import { ActivatedRoute } from '@angular/router'
import {
  TableWithFiltersComponent
} from '../../../../shared/components/table-with-filters/table-with-filters.component'
import { TTable } from '../../../../shared/models/basic-types'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { finalize } from 'rxjs'


@Component({
  selector: 'app-lawyers-file',
  templateUrl: './lawyers-file.component.html',
  styleUrls: ['./lawyers-file.component.css'],
  standalone: true,
  imports: [TableWithFiltersComponent]
})
export class LawyersFileComponent implements OnInit {
  private httpService = inject(LwHttpService)
  private authService = inject(AuthService)
  private activatedRoute = inject(ActivatedRoute)
  private readonly destroyRef = inject(DestroyRef)

  @Input() color: string = 'black'
  @Input() fontSize: number = 40
  @Input() name!: string

  session_id = String(this.authService.loadedUser?.username)

  zis: string[] = ['Об\'єднання', 'Сходження']

  full_table: any

  text_1: string | undefined
  text_2: string | undefined
  text_3: number = 0
  data: any

  tableData = signal<TTable>([])
  loading = signal<boolean>(false)

  download() {
    this.httpService.downloadFile(this.name, this.session_id)
  }

  update() {
    this.loading.set(true)
    this.httpService.getCash(this.name, this.session_id)
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.loading.set(false)))
      .subscribe((data) => {
        this.tableData.set(data)
        this.text_3 = data.length
      })
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      if ('name' in params) this.name = params['name']

      this.updateTexts()
      this.update()
    })

  }

  updateTexts() {
    if (this.name === 'judiciary_legal_case') {
      this.text_1 = 'Суд.влада + Лігал'
      this.text_2 = 'Номер справи'
    }
    if (this.name === 'judiciary_legal_court') {
      this.text_1 = 'Суд.влада + Лігал'
      this.text_2 = 'Номер справи + суд'
    }
    if (this.name === 'judiciary_legal_court_negative') {
      this.text_1 = 'Суд.влада + Лігал'
      this.text_2 = 'Номер справи + суд(нічого не знайдено)'
    }
    if (this.name === 'judiciary_case') {
      this.text_1 = 'Суд.влада '
      this.text_2 = 'Номер справи'
    }
    if (this.name === 'judiciary_court') {
      this.text_1 = 'Суд.влада'
      this.text_2 = 'Номер справи + суд'
    }
    if (this.name === 'judiciary_court_negative') {
      this.text_1 = 'Суд.влада'
      this.text_2 = 'Номер справи + суд(нічого не знайдено)'
    }
    if (this.name === 'legal_case') {
      this.text_1 = 'Лігал'
      this.text_2 = 'Номер справи'
    }
    if (this.name === 'legal_court') {
      this.text_1 = 'Лігал'
      this.text_2 = 'Номер справи + суд'
    }
    if (this.name === 'legal_court_negative') {
      this.text_1 = 'Лігал'
      this.text_2 = 'Номер справи + суд(нічого не знайдено)'
    }
    if (this.name === 'other_cases') {
      this.text_1 = 'Немає збігів'
      this.text_2 = 'Номер справи'
    }
    if (this.name === 'mistake_in_text') {
      this.text_1 = 'Описка'
      this.text_2 = 'Номер справи'
    }
    if (this.name === 'not_identified') {
      this.text_1 = 'Не ідентифіковано'
      this.text_2 = 'Номер справи'
    }
    if (this.name === 'all') {
      this.text_1 = 'Всього'
      this.text_2 = 'Всього справ'
    }
    if (this.name === 'judiciary_legal_case_event') {
      this.text_1 = 'Суд. Влада + Лігал'
      this.text_2 = 'Номер справи (Без події)'
    }
    if (this.name === 'judiciary_legal_court_event') {
      this.text_1 = 'Суд. Влада + Лігал'
      this.text_2 = 'Номер справи + суд (Без події)'
    }
    if (this.name === 'judiciary_legal_court_negative_event') {
      this.text_1 = 'Суд. Влада + Лігал'
      this.text_2 = 'Номер справи - суд (Без події)'
    }
    if (this.name === 'legal_case_event') {
      this.text_1 = 'Лігал'
      this.text_2 = 'Номер справи (Без події)'
    }
    if (this.name === 'legal_court_event') {
      this.text_1 = 'Лігал'
      this.text_2 = 'Номер справи + суд (Без події)'
    }
    if (this.name === 'legal_court_negative_event') {
      this.text_1 = 'Лігал'
      this.text_2 = 'Номер справи - суд (Без події)'
    }
    if (this.name === 'other_company') {
      this.text_1 = 'Не наш процес'
      this.text_2 = 'Номер справи'
    }
  }

}
