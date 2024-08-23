import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component'
import { EdAllEpDataService } from '../../services/ed-all-ep-data.service'
import { EdKnownWithStatusComponent } from '../../ui/all-ep/ed-known-with-status/ed-known-with-status.component'


@Component({
  selector: 'ed-all-ep-count-info',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, EdKnownWithStatusComponent],
  templateUrl: './ed-all-ep-count-info.component.html',
  styles: [`
    .nav-link {
      border: 1px solid #1277da;
      margin: 0.2rem 0;
    }
    .nav-pills {
      border-left: 1px dotted #1277da;
      padding-left: 1rem;
    }
  `]
})
export class EdAllEpCountInfoComponent {
  private readonly allEpDataService = inject(EdAllEpDataService)
  got?: number

//ветка открытых

  private active_after_assignmentEP = {
    show: false,
    count: this.got
  }
  private active_queue_property = {
    show: false,
    count: this.got
  }
  private active_queue_real_estate = {
    show: false,
    count: this.got
  }
  private active_queue_auto = {
    show: false,
    count: this.got
  }
  private active_auctionEP = {
    show: false,
    count: this.got
  }
  private active_property_estateEP = {
    show: false,
    count: this.got,

    active_queue_property: this.active_queue_property,
    active_queue_real_estate: this.active_queue_real_estate,
    active_queue_auto: this.active_queue_auto
  }
  private active_before_assignment = {
    show: false,
    count: this.got
  }
  private active_zvpEP = {
    show: false,
    count: this.got
  }
  private active_property_realizationEP = {
    show: false,
    count: this.got,

    active_property_estateEP: this.active_property_estateEP,
    active_auctionEP: this.active_auctionEP
  }


  private active_not_oursEP = {
    show: false,
    count: this.got
  }
  private active_oursEP = {
    show: false,
    count: this.got,

    active_zvpEP: this.active_zvpEP,
    active_property_realizationEP: this.active_property_realizationEP,
    acive_VP_MinusEP: 5
  }
  private active_previous_creditorEP = {
    show: false,
    count: this.got,

    active_after_assignmentEP: this.active_after_assignmentEP,
    active_before_assignmentEP: this.active_before_assignment
  }
  private active_our_debtorEP = {
    show: false,
    count: this.got
  }
  private active_otherEP = {
    show: false,
    count: this.got
  }
//ветка завершенных
  private closed_after_assignmentEP = {
    show: false,
    count: this.got
  }
  private closed_queue_property = {
    show: false,
    count: this.got
  }
  private closed_queue_real_estate = {
    show: false,
    count: this.got
  }
  private closed_queue_auto = {
    show: false,
    count: this.got
  }
  private closed_auctionEP = {
    show: false,
    count: this.got
  }
  private closed_property_estateEP = {
    show: false,
    count: this.got,

    closed_queue_property: this.closed_queue_property,
    closed_queue_real_estate: this.closed_queue_real_estate,
    closed_queue_auto: this.closed_queue_auto
  }
  private closed_before_assignment = {
    show: false,
    count: this.got
  }
  private closed_zvpEP = {
    show: false,
    count: this.got
  }
  private closed_property_realizationEP = {
    show: false,
    count: this.got,

    closed_property_estateEP: this.closed_property_estateEP,
    closed_auctionEP: this.closed_auctionEP
  }

  private closed_not_oursEP = {
    show: false,
    count: this.got
  }
  private closed_oursEP = {
    show: false,
    count: this.got,

    closed_zvpEP: this.closed_zvpEP,
    closed_property_realizationEP: this.closed_property_realizationEP,
    closed_VP_MinusEP: 5
  }
  private closed_previous_creditorEP = {
    show: false,
    count: this.got,

    closed_after_assignmentEP: this.closed_after_assignmentEP,
    closed_before_assignmentEP: this.closed_before_assignment
  }
  private closed_our_debtorEP = {
    show: false,
    count: this.got
  }
  private closed_otherEP = {
    show: false,
    count: this.got
  }


//основа всей ветки
  allEP = {
    show: true,
    count: this.got,


    openedEP: {
      show: false,
      count: this.got,

      active_not_oursEP: this.active_not_oursEP,
      active_oursEP: this.active_oursEP,
      active_previous_creditorEP: this.active_previous_creditorEP,
      active_our_debtorEP: this.active_our_debtorEP,
      active_otherEP: this.active_otherEP

    },

    buffer: {
      show: false,
      count: this.got
    },

    closed: {
      show: false,
      count: this.got,

      closed_not_oursEP: this.closed_not_oursEP,
      closed_oursEP: this.closed_oursEP,
      closed_previous_creditorEP: this.closed_previous_creditorEP,
      closed_our_debtorEP: this.closed_our_debtorEP,
      closed_otherEP: this.closed_otherEP
    }


  }

  constructor() {
    this.allEpDataService.loadAllWithBase().subscribe((data: { [key: string]: number }) => {
      this.initializeObjects(data)
    })
  }

  initializeObjects(data: { [key: string]: number }) {

    console.log('ok')
    console.log(this.allEpDataService.cachedResults)
    console.log(this.allEpDataService.cachedResults['active_after_assignment'])


    this.active_after_assignmentEP.count = data['active_after_assignment']
    this.active_auctionEP.count = data['active_auction']
    this.active_before_assignment.count = data['active_before_assignment']
    this.active_not_oursEP.count = data['active_not_ours']
    this.active_otherEP.count = data['active_other']
    this.active_our_debtorEP.count = data['active_our_debtor']
    this.active_oursEP.count = data['active_ours']
    this.active_previous_creditorEP.count = data['active_previous_creditor']
    this.active_property_estateEP.count = data['active_property_estate']
    this.active_property_realizationEP.count = data['active_property_realization']
    this.active_queue_auto.count = data['active_queue_auto']
    this.active_queue_property.count = data['active_queue_property']
    this.active_queue_real_estate.count = data['active_queue_real_estate']
    this.active_zvpEP.count = data['active_zvp']
    this.allEP.count = data['all']
    this.closed_after_assignmentEP.count = data['closed_after_assignment']
    this.closed_auctionEP.count = data['closed_auction']
    this.closed_before_assignment.count = data['closed_before_assignment']
    this.closed_not_oursEP.count = data['closed_not_ours']
    this.closed_otherEP.count = data['closed_other']
    this.closed_our_debtorEP.count = data['closed_our_debtor']
    this.closed_oursEP.count = data['closed_ours']
    this.closed_previous_creditorEP.count = data['closed_previous_creditor']
    this.closed_property_estateEP.count = data['closed_property_estate']
    this.closed_property_realizationEP.count = data['closed_property_realization']
    this.closed_queue_auto.count = data['closed_queue_auto']
    this.closed_queue_property.count = data['closed_queue_property']
    this.closed_queue_real_estate.count = data['closed_queue_real_estate']
    this.closed_zvpEP.count = data['closed_zvp']

    this.allEP.openedEP.count = data['active']
    this.allEP.buffer.count = data['buffer']
    this.allEP.closed.count = data['closed']


  }


}
