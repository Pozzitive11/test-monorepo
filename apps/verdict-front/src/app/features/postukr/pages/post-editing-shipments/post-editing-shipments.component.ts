import { Component, inject } from '@angular/core';
import { PostUkrHttpService } from '../../postukr-http.service';
import { AddShipment } from './shipment.model';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { MessageHandlingService } from 'apps/verdict-front/src/app/shared/services/message-handling.service';

@Component({
  selector: 'app-post-editing-shipments',
  templateUrl: './post-editing-shipments.component.html',
  styleUrls: ['./post-editing-shipments.component.css'],
  standalone: true,
  imports: [NgIf, FormsModule, NgbTooltip],
})
export class PostEditingShipmentsComponent {
  private readonly httpService = inject(PostUkrHttpService);
  private readonly message = inject(MessageHandlingService);

  block = 0;
  test_server: boolean = false;
  personType: string = 'fiz';
  deliveryType: string = 'None';
  registryTitle_edit: string = '';
  index: string = '';
  registryName: string = '';
  registryName2: string = '';
  region: string = '';
  city: string = '';
  street: string = '';
  houseNumber: string = '';
  apartment: string = '';
  firstName: string = '';
  firstName_edit: string = '';
  lastName: string = '';
  lastName_edit: string = '';
  patronymic: string = '';
  patronymic_edit: string = '';
  registryTitle: string = '';
  weight: number = 0;
  ipn: string = '';
  phone: string = '';
  phone_edit: string = '';
  nks1: string = '';
  legal: number = 0;
  nks2: string = '';
  uuid: string = '';
  barcode: string = '';
  main: string = '';
  barcode2: string = '';
  result?: AddShipment;
  district: string = '';
  express: boolean = false;
  barcode_edit: string = '';
  itemForm: boolean = false;

  uploadPostWithoutUuid() {
    if (
      this.index != '' &&
      this.registryName != '' &&
      this.city != '' &&
      this.phone != '' &&
      this.nks1 != ''
    ) {
      if (this.personType === 'fiz') {
        this.legal = 0;
        if (
          this.firstName != '' &&
          this.lastName != '' &&
          this.patronymic != ''
        ) {
          this.result = {
            POSTCODE: this.index,
            group_name: this.registryName,
            REGION_NAME: this.region,
            DISTRICT_NAME: this.district,
            CITY_NAME: this.city,
            STREET_NAME: this.street,
            HOUSENUMBER_: this.houseNumber,
            APARTMENT: this.apartment,
            Name: this.registryTitle,
            IPN: this.ipn,
            FIRST_NAME: this.firstName,
            LAST_NAME: this.lastName,
            MIDDLE_NAME: this.patronymic,
            phone: this.phone,
            nks: this.nks1,
            uuid: this.uuid,
            legal: this.legal,
            test_server: this.test_server,
          };

          console.log(this.result);

          this.httpService.uploadShipment(this.result).subscribe({
            next: (info) => {
              console.log(info);
            },
            complete: async () =>
              this.message.sendInfo('Відправлення створене'),
          });
        } else {
          this.message.sendError('Не всі потрібні поля заповнені!');
        }
      } else {
        if (this.registryTitle != '') {
          this.legal = 1;

          this.result = {
            POSTCODE: this.index,
            group_name: this.registryName,
            REGION_NAME: this.region,
            DISTRICT_NAME: this.district,
            CITY_NAME: this.city,
            STREET_NAME: this.street,
            HOUSENUMBER_: this.houseNumber,
            APARTMENT: this.apartment,
            Name: this.registryTitle,
            IPN: this.ipn,
            FIRST_NAME: this.firstName,
            LAST_NAME: this.lastName,
            MIDDLE_NAME: this.patronymic,
            phone: this.phone,
            nks: this.nks1,
            uuid: this.uuid,
            legal: this.legal,
            test_server: this.test_server,
          };

          console.log(this.result);

          this.httpService.uploadShipment(this.result).subscribe({
            next: (info) => {
              console.log(info);
            },
            complete: async () =>
              this.message.sendInfo('Відправлення створене'),
          });
        } else {
          this.message.sendError('Не всі потрібні поля заповнені!');
        }
      }
    } else {
      this.message.sendError('Не всі потрібні поля заповнені!');
    }
  }

  uploadPostWithUuid() {
    if (this.nks2 != '' && this.uuid != '' && this.registryName2 != '') {
      const result = {
        POSTCODE: '',
        nks: this.nks2,
        group_name: this.registryName2,
        uuid: this.uuid,
      };

      this.httpService.uploadShipment(result).subscribe({
        next: (info) => {
          console.log(info);
        },
        complete: async () => this.message.sendInfo('Відправлення створене'),
      });
    } else {
      this.message.sendError('Не всі потрібні поля заповнені!');
    }
  }

  deletePost() {
    if (this.barcode != '') {
      const deleted = {
        barcode: this.barcode,
        express: this.express,
        main_barcode: '',
        test_server: this.test_server,
      };

      this.httpService.deletedShipment(deleted).subscribe({
        next: (info) => {
          this.message.sendInfo(info.description);
        },
      });
    } else {
      this.message.sendError('Не всі потрібні поля заповнені!');
    }
  }

  editPost() {
    if (this.barcode_edit != '') {
      const editer = {
        barcode: this.barcode_edit,
        deliveryType: this.deliveryType,
        name: this.registryTitle_edit,
        first_name: this.firstName_edit,
        last_name: this.lastName_edit,
        middle_name: this.patronymic_edit,
        weight: this.weight,
        phoneNumber: this.phone_edit,
        test_server: this.test_server,
      };

      this.httpService.editShipment(editer).subscribe({
        next: (info) => {
          console.log(info);
          this.message.sendInfo(info.description);
        },
        complete: async () =>
          this.message.sendInfo(
            'Посилку ' + this.barcode_edit + ' відредаговано'
          ),
      });
    } else {
      this.message.sendError('Не всі потрібні поля заповнені!');
    }
  }

  checked() {
    if (!this.itemForm) {
      this.itemForm = true;
    }
    if (this.itemForm) {
      this.itemForm = false;
    }
  }

  checked_express() {
    if (!this.express) {
      this.express = true;
    }
    if (this.express) {
      this.express = false;
    }
  }

  postAdd() {
    this.block = 1;
  }

  postDelete() {
    this.block = 3;
  }

  postEdit() {
    this.block = 2;
  }
}
