import { Component, inject, OnInit } from '@angular/core';
import { NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { LwHttpService } from './services/lw-http.service';
import { RouterLink } from '@angular/router';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { DatePickerRangePopupComponent } from '../../shared/components/date-picker-range-popup/date-picker-range-popup.component';
import { AuthService } from '../../core/services/auth.service';
import { UtilFunctions } from '../../shared/utils/util.functions';

@Component({
  selector: 'app-lawyers',
  templateUrl: './lawyers.component.html',
  styleUrls: ['./lawyers.component.css'],
  standalone: true,
  imports: [
    DatePickerRangePopupComponent,
    NgMultiSelectDropDownModule,
    FormsModule,
    NgIf,
    LoadingSpinnerComponent,
    NgFor,
    NgClass,
    RouterLink,
  ],
})
export class LawyersComponent implements OnInit {
  private authService = inject(AuthService);
  private calendar = inject(NgbCalendar);
  private httpService = inject(LwHttpService);

  loading: boolean = false;

  session_id = String(this.authService.loadedUser?.username);

  searchFullTable: boolean = false;

  search_module = {};
  search_data: any;

  dec_date = {};
  eff_date = {};
  add_date = {};
  mod_date = {};

  dates1: { fromDate: NgbDate | null; toDate: NgbDate | null } = {
    fromDate: null,
    toDate: null,
  };
  dates2: { fromDate: NgbDate | null; toDate: NgbDate | null } = {
    fromDate: null,
    toDate: null,
  };
  dates3: { fromDate: NgbDate | null; toDate: NgbDate | null } = {
    fromDate: null,
    toDate: null,
  };
  dates4: { fromDate: NgbDate | null; toDate: NgbDate | null } = {
    fromDate: null,
    toDate: null,
  };

  full_tabls = [
    'judiciary_legal_case_event',
    'judiciary_legal_court_event',
    'judiciary_legal_court_negative_event',
    '',
    'legal_case_event',
    'legal_court_event',
    'legal_court_negative_event',
  ];

  full_tabl = [
    'judiciary_legal_case',
    'judiciary_legal_court',
    'judiciary_legal_court_negative',
    'judiciary_case',
    'legal_case',
    'legal_court',
    'legal_court_negative',
    'other_cases',
    'no_upload',
    'mistake_in_text',
    'not_identified',
    'other_company',
    'all',
  ];

  powers = false;
  check = [
    { id: 1, select: false, name: 'Рішення' },
    { id: 2, select: false, name: 'Постанова' },
    { id: 3, select: false, name: 'Ухвала' },
  ];
  check1 = [
    { id: 1, select: false, name: 'Відміна ВНН' },
    { id: 2, select: false, name: 'Стягнення заборгованості' },
    { id: 3, select: false, name: 'Банкрутство' },
    { id: 4, select: false, name: 'Стягнення 3% річних' },
    { id: 5, select: false, name: 'Звернення стягнення' },
    { id: 6, select: false, name: 'Інший тип' },
  ];
  check2 = [
    { id: 1, select: false, name: 'Вердикт Капітал' },
    { id: 2, select: false, name: 'Вердикт Фінанс' },
    { id: 3, select: false, name: 'Кредит Фінанс' },
    { id: 4, select: false, name: 'Веста' },
    { id: 5, select: false, name: 'Женева' },
    { id: 6, select: false, name: 'Ассісто' },
    { id: 7, select: false, name: 'Кредекс' },
    { id: 8, select: false, name: 'Форвард' },
    { id: 9, select: false, name: 'Коллект' },
    { id: 10, select: false, name: 'Кампсіс Фінанс' },
    { id: 11, select: false, name: 'Дебт Форс' },
    { id: 12, select: false, name: 'Еко Фін' },
    { id: 13, select: false, name: 'Інша або помилка' },
    { id: 14, select: false, name: 'Знайдено в тексті' },
  ];

  check3 = [
    { id: 1, select: false, name: 'Заміна сторони' },
    { id: 2, select: false, name: 'Дублікат ВД' },
    { id: 3, select: false, name: 'Поновлення ВД' },
    { id: 4, select: false, name: 'Заміна сторони та видача дублікату ВД' },
    { id: 5, select: false, name: 'Заміна сторони та поновлення ВД' },
    { id: 6, select: false, name: 'Видача дублікату ВД та поновлення ВД' },
    {
      id: 7,
      select: false,
      name: 'Заміна сторони, видача дублікату ВД та поновлення ВД',
    },
    { id: 8, select: false, name: 'Виправлення описки' },
    { id: 9, select: false, name: 'Відновлення втраченого провадження' },
    {
      id: 10,
      select: false,
      name: 'Відновлення втраченого провадження у заміні сторони',
    },
    {
      id: 11,
      select: false,
      name: 'Відновлення втраченого провадження у видачі дублікату ВД',
    },
    {
      id: 12,
      select: false,
      name: 'Відновлення втраченого провадження у поновленні строку ВД',
    },
    {
      id: 13,
      select: false,
      name: 'Відновлення втраченого провадження у видачі дублікату ВД та поновленні строку ВД',
    },
    {
      id: 14,
      select: false,
      name: 'Відновлення втраченого провадження у заміні сторони та видачі дублікату ВД',
    },
    {
      id: 15,
      select: false,
      name: 'Відновлення втраченого провадження у заміні сторони та поновленні строку ВД',
    },
    {
      id: 16,
      select: false,
      name: 'Відновлення втраченого провадження у заміні сторони та видачі дублікату ВД та поновленні строку ВД',
    },
    { id: 17, select: false, name: 'Виправлення описки у заміні сторони' },
    { id: 18, select: false, name: 'Забезпечення позову' },
    { id: 19, select: false, name: 'Перегляд заочного рішення' },
    { id: 20, select: false, name: 'Скасування ВД' },
    { id: 21, select: false, name: 'Повернення судового збору' },
    { id: 22, select: false, name: 'Заборона виїзду' },
    { id: 23, select: false, name: 'Додаткове рішення' },
    { id: 24, select: false, name: 'Поворот виконання судового рішення' },
    { id: 25, select: false, name: 'Інший тип' },
  ];
  check4 = [
    { id: 1, select: false, name: 'Відкриття провадження' },
    { id: 2, select: false, name: 'Залишити без руху' },
    { id: 3, select: false, name: 'Залишити без розгляду' },
    { id: 4, select: false, name: 'Вважати неподаною' },
    { id: 5, select: false, name: 'Відзив представника' },
    { id: 6, select: false, name: 'Направити за підсудністю' },
    { id: 7, select: false, name: 'Визнати банкрутом' },
    { id: 8, select: false, name: 'Задоволено' },
    { id: 9, select: false, name: 'Відмовлено' },
    { id: 10, select: false, name: 'Інший тип' },
  ];
  messageService: any;
  chekChoise: Array<string> = [];
  chekChoise1: Array<string> = [];
  chekChoise2: Array<string> = [];
  chekChoise3: Array<string> = [];
  chekChoise4: Array<string> = [];
  datesRange: { MinDate: NgbDate | null; MaxDate: NgbDate | null } = {
    MinDate: this.calendar.getPrev(this.calendar.getToday(), 'm', 168),
    MaxDate: this.calendar.getToday(),
  };
  dropdownList: any = [];
  dropdownList_2: any = [];
  dropdownList_3: any = [];
  dropdownList_4: any = [];
  dropdownList_5: any = [];
  dropdownSettings: any = [];
  selectedItems: any = [];
  selectedItems1: any = [];
  selectedItems2: any = [];
  selectedItems4: any = [];
  selectedItems5: any = [];
  z: any;

  change() {
    if (this.powers === true) {
      this.powers = false;
    } else {
      this.powers = true;
    }
    console.log(this.powers);
  }

  search() {
    this.loading = true;
    this.searchFullTable = false;
    this.search_module = {
      dec_date: this.dec_date,
      eff_date: this.eff_date,
      add_date: this.add_date,
      mod_date: this.mod_date,
      doc_form: this.chekChoise,
      doc_type: this.chekChoise4,
      proc_type: this.chekChoise1,
      proc_sub_type: this.chekChoise3,
      company: this.chekChoise2,
      check_eff: this.powers,
      username: this.session_id,
    };

    console.log(this.search_module);

    /*this.httpService.starProcessing_EDRSR(this.search_module)
    .subscribe( {
    next: info => {
      this.messageService.sendInfo(info.description)
    },
    error: err => {

      this.messageService.sendError(err.error.detail)
    },
  })*/

    this.httpService.starProcessing_EDRSR(this.search_module).subscribe({
      next: (data) => {
        this.search_data = data;
        console.log(this.search_data);
      },
      error: (err) => {
        this.messageService.sendError(err.error.detail);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
        this.searchFullTable = true;
      },
    });
  }

  OnChange(event: any) {
    const id = event.target.value;
    const isCheked = event.target.checked;

    console.log(id, isCheked);

    this.check = this.check.map((d) => {
      if (d.id == id) {
        if (d.select != isCheked) {
          this.chekChoise.push(d.name);
          return d;
        } else {
          this.chekChoise.pop();
          return d;
        }
      }
      return d;
    });

    console.log(this.chekChoise);
  }

  OnChange1(event: any) {
    const id = event.target.value;
    const isCheked = event.target.checked;

    console.log(id, isCheked);

    this.check1 = this.check1.map((d) => {
      if (d.id == id) {
        if (d.select != isCheked) {
          this.chekChoise1.push(d.name);
          return d;
        } else {
          this.chekChoise1.pop();
          return d;
        }
      }
      return d;
    });

    console.log(this.chekChoise1);
  }

  OnChange2(event: any) {
    const id = event.target.value;
    const isCheked = event.target.checked;

    console.log(id, isCheked);

    this.check2 = this.check2.map((d) => {
      if (d.id == id) {
        if (d.select != isCheked) {
          this.chekChoise2.push(d.name);
          return d;
        } else {
          this.chekChoise2.pop();
          return d;
        }
      }
      return d;
    });

    console.log(this.chekChoise2);
  }

  OnChange3(event: any) {
    const id = event.target.value;
    const isCheked = event.target.checked;

    console.log(id, isCheked);

    this.check3 = this.check3.map((d) => {
      if (d.id == id) {
        if (d.select != isCheked) {
          this.chekChoise3.push(d.name);
          return d;
        } else {
          this.chekChoise3.pop();
          return d;
        }
      }
      return d;
    });

    console.log(this.chekChoise3);
  }

  updateData() {
    const dateFilter1 = {
      start: this.dates1.fromDate
        ? UtilFunctions.ngbDateStructToStringDate(this.dates1.fromDate)
        : null,
      end: this.dates1.toDate
        ? UtilFunctions.ngbDateStructToStringDate(this.dates1.toDate)
        : null,
    };
    const dateFilter2 = {
      start: this.dates2.fromDate
        ? UtilFunctions.ngbDateStructToStringDate(this.dates2.fromDate)
        : null,
      end: this.dates2.toDate
        ? UtilFunctions.ngbDateStructToStringDate(this.dates2.toDate)
        : null,
    };
    const dateFilter3 = {
      start: this.dates3.fromDate
        ? UtilFunctions.ngbDateStructToStringDate(this.dates3.fromDate)
        : null,
      end: this.dates3.toDate
        ? UtilFunctions.ngbDateStructToStringDate(this.dates3.toDate)
        : null,
    };
    const dateFilter4 = {
      start: this.dates4.fromDate
        ? UtilFunctions.ngbDateStructToStringDate(this.dates4.fromDate)
        : null,
      end: this.dates4.toDate
        ? UtilFunctions.ngbDateStructToStringDate(this.dates4.toDate)
        : null,
    };

    if (dateFilter1.end === null) {
      dateFilter1.end = '';
    }
    if (dateFilter2.end === null) {
      dateFilter2.end = '';
    }
    if (dateFilter3.end === null) {
      dateFilter3.end = '';
    }
    if (dateFilter4.end === null) {
      dateFilter4.end = '';
    }
    if (dateFilter1.start === null) {
      dateFilter1.start = '';
    }
    if (dateFilter2.start === null) {
      dateFilter2.start = '';
    }
    if (dateFilter3.start === null) {
      dateFilter3.start = '';
    }
    if (dateFilter4.start === null) {
      dateFilter4.start = '';
    }

    this.dec_date = dateFilter1;
    this.eff_date = dateFilter2;
    this.add_date = dateFilter3;
    this.mod_date = dateFilter4;

    console.log(this.dec_date);
    console.log(this.eff_date);
    console.log(this.add_date);
    console.log(this.mod_date);
  }

  ngOnInit(): void {
    this.dropdownList = [
      { item_id: 1, item_text: 'Рішення' },
      { item_id: 2, item_text: 'Постанова' },
      { item_id: 3, item_text: 'Ухвала' },
    ];
    this.dropdownList_2 = [
      { item_id: 1, item_text: 'Відміна ВНН' },
      { item_id: 2, item_text: 'Стягнення заборгованості' },
      { item_id: 3, item_text: 'Банкрутство' },
      { item_id: 4, item_text: 'Стягнення 3% річних' },
      { item_id: 5, item_text: 'Звернення стягнення' },
      { item_id: 6, item_text: 'Інший тип' },
    ];
    this.dropdownList_3 = [
      { item_id: 1, item_text: 'Вердикт Капітал' },
      { item_id: 2, item_text: 'Вердикт Фінанс' },
      { item_id: 3, item_text: 'Кредит Фінанс' },
      { item_id: 4, item_text: 'Веста' },
      { item_id: 5, item_text: 'Женева' },
      { item_id: 6, item_text: 'Ассісто' },
      { item_id: 7, item_text: 'Кредекс' },
      { item_id: 8, item_text: 'Форвард' },
      { item_id: 9, item_text: 'Коллект' },
      { item_id: 10, item_text: 'Кампсіс Фінанс' },
      { item_id: 11, item_text: 'Дебт Форс' },
      { item_id: 12, item_text: 'Еко Фін' },
      { item_id: 13, item_text: 'Інша або помилка' },
      { item_id: 14, item_text: 'Знайдено в тексті' },
    ];
    this.dropdownList_4 = [
      { item_id: 1, item_text: 'Заміна сторони' },
      { item_id: 2, item_text: 'Дублікат ВД' },
      { item_id: 3, item_text: 'Поновлення ВД' },
      { item_id: 4, item_text: 'Заміна сторони та видача дублікату ВД' },
      { item_id: 5, item_text: 'Заміна сторони та поновлення ВД' },
      { item_id: 6, item_text: 'Видача дублікату ВД та поновлення ВД' },
      {
        item_id: 7,
        item_text: 'Заміна сторони, видача дублікату ВД та поновлення ВД',
      },
      { item_id: 8, item_text: 'Виправлення описки' },
      { item_id: 9, item_text: 'Відновлення втраченого провадження' },
      {
        item_id: 10,
        item_text: 'Відновлення втраченого провадження у заміні сторони',
      },
      {
        item_id: 11,
        item_text: 'Відновлення втраченого провадження у видачі дублікату ВД',
      },
      {
        item_id: 12,
        item_text: 'Відновлення втраченого провадження у поновленні строку ВД',
      },
      {
        item_id: 13,
        item_text:
          'Відновлення втраченого провадження у видачі дублікату ВД та поновленні строку ВД',
      },
      {
        item_id: 14,
        item_text:
          'Відновлення втраченого провадження у заміні сторони та видачі дублікату ВД',
      },
      {
        item_id: 15,
        item_text:
          'Відновлення втраченого провадження у заміні сторони та поновленні строку ВД',
      },
      {
        item_id: 16,
        item_text:
          'Відновлення втраченого провадження у заміні сторони та видачі дублікату ВД та поновленні строку ВД',
      },
      { item_id: 17, item_text: 'Виправлення описки у заміні сторони' },
      { item_id: 18, item_text: 'Забезпечення позову' },
      { item_id: 19, item_text: 'Перегляд заочного рішення' },
      { item_id: 20, item_text: 'Скасування ВД' },
      { item_id: 21, item_text: 'Повернення судового збору' },
      { item_id: 22, item_text: 'Заборона виїзду' },
      { item_id: 23, item_text: 'Додаткове рішення' },
      { item_id: 24, item_text: 'Поворот виконання судового рішення' },
      { item_id: 25, item_text: 'Інший тип' },
    ];
    this.dropdownList_5 = [
      { item_id: 1, item_text: 'Відкриття провадження' },
      { item_id: 2, item_text: 'Залишити без руху' },
      { item_id: 3, item_text: 'Залишити без розгляду' },
      { item_id: 4, item_text: 'Вважати неподаною' },
      { item_id: 5, item_text: 'Відзив представника' },
      { item_id: 6, item_text: 'Направити за підсудністю' },
      { item_id: 7, item_text: 'Визнати банкрутом' },
      { item_id: 8, item_text: 'Задоволено' },
      { item_id: 9, item_text: 'Відмовлено' },
      { item_id: 10, item_text: 'Інший тип' },
    ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      itemsShowLimit: 2,
      allowSearchFilter: true,
      enableCheckAll: false,
    };
  }

  OnSelect_1(event: any) {
    for (let i = 0; i < this.check.length; i++) {
      if (event.item_id === this.check[i].id) {
        this.chekChoise.push(event.item_text);
        console.log(this.chekChoise);
      }
    }
  }

  onDeSelect_1(event: any) {
    for (let i = 0; i < this.check.length; i++) {
      if (event.item_id === this.check[i].id) {
        var myIndex = this.chekChoise.indexOf(event.item_text);
        if (myIndex !== -1) {
          this.chekChoise.splice(myIndex, 1);
        }
        console.log(this.chekChoise);
      }
    }
  }

  OnSelect_2(event: any) {
    for (let i = 0; i < this.check1.length; i++) {
      if (event.item_id === this.check1[i].id) {
        this.chekChoise1.push(event.item_text);
        console.log(this.chekChoise1);
      }
    }
  }

  onDeSelect_2(event: any) {
    for (let i = 0; i < this.check1.length; i++) {
      if (event.item_id === this.check1[i].id) {
        var myIndex = this.chekChoise1.indexOf(event.item_text);
        if (myIndex !== -1) {
          this.chekChoise1.splice(myIndex, 1);
        }
        console.log(this.chekChoise1);
      }
    }
  }

  OnSelect_3(event: any) {
    for (let i = 0; i < this.check2.length; i++) {
      if (event.item_id === this.check2[i].id) {
        this.chekChoise2.push(event.item_text);
        console.log(this.chekChoise2);
      }
    }
  }

  onDeSelect_3(event: any) {
    for (let i = 0; i < this.check2.length; i++) {
      if (event.item_id === this.check2[i].id) {
        var myIndex = this.chekChoise2.indexOf(event.item_text);
        if (myIndex !== -1) {
          this.chekChoise2.splice(myIndex, 1);
        }
        console.log(this.chekChoise2);
      }
    }
  }

  OnSelect_4(event: any) {
    for (let i = 0; i < this.check3.length; i++) {
      if (event.item_id === this.check3[i].id) {
        this.chekChoise3.push(event.item_text);
        console.log(this.chekChoise3);
      }
    }
  }

  onDeSelect_4(event: any) {
    for (let i = 0; i < this.check3.length; i++) {
      if (event.item_id === this.check3[i].id) {
        var myIndex = this.chekChoise3.indexOf(event.item_text);
        if (myIndex !== -1) {
          this.chekChoise3.splice(myIndex, 1);
        }
        console.log(this.chekChoise3);
      }
    }
  }

  OnSelect_5(event: any) {
    for (let i = 0; i < this.check4.length; i++) {
      if (event.item_id === this.check4[i].id) {
        this.chekChoise4.push(event.item_text);
        console.log(this.chekChoise4);
      }
    }
  }

  onDeSelect_5(event: any) {
    for (let i = 0; i < this.check4.length; i++) {
      if (event.item_id === this.check4[i].id) {
        var myIndex = this.chekChoise4.indexOf(event.item_text);
        if (myIndex !== -1) {
          this.chekChoise4.splice(myIndex, 1);
        }
        console.log(this.chekChoise4);
      }
    }
  }

  OnSelect_All_1() {
    if (this.chekChoise.length === 0) {
      for (let i = 0; i < this.check.length; i++) {
        this.chekChoise.push(this.check[i].name);
      }
    } else {
      for (let i = 0; i < this.chekChoise.length; i++) {
        this.z = this.check.filter((word) => word.name != this.chekChoise[i]);
      }
      for (let i = 0; i < this.check.length; i++) {
        this.chekChoise.push(this.z[i].name);
      }
    }
    console.log(this.chekChoise);
    console.log(this.z);
  }
}
