import { inject, Injectable } from '@angular/core'
import { ReqCheckHttpService } from './req-check-http.service'
import { BKI, BKICash } from '../models/req-bki.model'
import { Contactable } from '../models/req-contactable.model'
import { IncomeAndNcsCredits } from '../models/req-income-nks-credits.model'
import { HttpParams } from '@angular/common/http'
import { CanceledDocs } from '../models/req-cancelled-docs.model'
import { FinApiCashtan } from '../models/req-cashtan-fin.model'
import { SanctionsCashtan } from '../models/req-cashtan-sanctions.model'

@Injectable({
  providedIn: 'root'
})
export class ReqCheckElementsService {
  private readonly httpService = inject(ReqCheckHttpService)

  visionCash: number = 0

  cashGetCre?: BKICash
  cashGetBank: any
  cashGetWan: any
  cashGetSan?: SanctionsCashtan
  cashGetCan: any
  cashGetPep: any
  cashCancelledDocs?: CanceledDocs
  cass: number = 0

  updateInfo: number = 0

  getCashCash: any
  getCashCashLong: number = 0
  getCashClos: number = 0
  getCashTr: any
  getCashBla: any

  cashFinApi?: FinApiCashtan

  displayedINN: string = ''
  displayedInfo: number = 0
  fullInfo: number = 0
  fioSee: number = 0
  ipn: string = ''
  name: string = ''
  asepInfo: any
  bannedUser: boolean = false
  loader: number = 0
  openCredit: boolean = false
  bkiInfo?: BKI
  cashflowClean: number = 0
  getContactable?: Contactable
  courtData: any
  getIncomeNcsCredits?: IncomeAndNcsCredits
  paymentDelay: number = 0
  riskScoring: number = 0
  weekCredit: boolean = false
  creditTable: any
  military: any
  prop: any
  auto: any
  clientGone: any

  finapi: any

  index_check: number = 0
  loaderInfo: number = 0

  isClientGone() {
    this.httpService.isClientGone(this.ipn).subscribe((data) => {
      this.clientGone = data
    })
  }

  allCashtan() {
    this.httpService.cashtanAll().subscribe({
      next: (data) => {
        // console.log(data)
      },
      error: (err) => {
        this.updateInfo = 1
        // this.messageService.sendError(`${err.status}: ${err.error.detail}`)
      },
      complete: async () => {
        this.updateInfo = 1
        // console.log(this.updateInfo)
      }
    })
  }

  GetCashLong() {
    this.httpService.getCashtanCash_Long(this.ipn).subscribe({
      next: (data) => {
        this.getCashCashLong = data
      },
      error: (err) => {
        // this.messageService.sendError(`${err.status}: ${err.error.detail}`)
      },
      complete: async () => {
        // console.log(this.GetCashCashLong)
      }
    })
  }

  GetCashtanFin() {
    this.httpService.cashtanFinApi(this.ipn).subscribe({
      next: (data) => {
        this.cashFinApi = data
      },
      error: (err) => {
        // this.messageService.sendError(`${err.status}: ${err.error.detail}`)
      },
      complete: async () => {
        // console.log(this.CashFinApi)
      }
    })
  }

  GetCashtanCashflow() {
    this.httpService.getCashtanCash(this.ipn).subscribe({
      next: (data) => {
        this.getCashCash = data
      },
      error: (err) => {
        // this.messageService.sendError(`${err.status}: ${err.error.detail}`)
      },
      complete: async () => {
        // console.log(this.GetCashCash)
      }
    })
  }

  GetCashtanClosedInCash() {
    this.httpService.getCashtanClosed(this.ipn).subscribe({
      next: (data) => {
        this.getCashClos = data
      },
      error: (err) => {
        // this.messageService.sendError(`${err.status}: ${err.error.detail}`)
      },
      complete: async () => {
        // console.log(this.GetCashClos)
      }
    })
  }

  GetCashtanTrueInCash() {
    this.httpService.getCashtanTrue(this.ipn).subscribe({
      next: (data) => {
        this.getCashTr = data
      },
      error: (err) => {
        // this.messageService.sendError(`${err.status}: ${err.error.detail}`)
      },
      complete: async () => {
        // console.log(this.GetCashTr)
      }
    })
  }

  GetCashtanBlackInCash() {
    this.httpService.getCashtanBlack(this.ipn).subscribe({
      next: (data) => {
        this.getCashBla = data
      },
      error: (err) => {
        // this.messageService.sendError(`${err.status}: ${err.error.detail}`)
      },
      complete: async () => {
        // console.log(this.GetCashBla)
      }
    })
  }

  CashtanCre() {
    this.httpService.cashtanGetCredit(this.ipn).subscribe({
      next: (data) => {
        this.cashGetCre = data
      },
      error: (err) => {
        // this.messageService.sendError(`${err.status}: ${err.error.detail}`)
      },
      complete: async () => {
        // console.log(this.CashGetCre)
        this.visionCash++
      }
    })
  }

  CashtanPe() {
    this.httpService.cashtanGetPep(this.ipn).subscribe({
      next: (data) => {
        this.cashGetPep = data
      },
      error: (err) => {
        // this.messageService.sendError(`${err.status}: ${err.error.detail}`)
      },
      complete: async () => {
        // console.log(this.CashGetPep)
      }
    })
  }

  CashtanBank() {
    this.httpService.cashtanGetBankruptcy(this.ipn).subscribe({
      next: (data) => {
        this.cashGetBank = data
      },
      error: (err) => {
        // this.messageService.sendError(`${err.status}: ${err.error.detail}`)
      },
      complete: async () => {
        // console.log(this.CashGetBank)
      }
    })
  }

  CashtanWan() {
    this.httpService.cashtanGetWanted(this.ipn).subscribe({
      next: (data) => {
        this.cashGetWan = data
      },
      error: (err) => {
        // this.messageService.sendError(`${err.status}: ${err.error.detail}`)
      },
      complete: async () => {
        // console.log(this.CashGetWan)
      }
    })
  }

  CashtanSan() {
    this.httpService.cashtanGetSanctions(this.ipn).subscribe({
      next: (data) => {
        this.cashGetSan = data
      },
      error: (err) => {
        // this.messageService.sendError(`${err.status}: ${err.error.detail}`)
      },
      complete: async () => {
        // console.log(this.CashGetSan)
      }
    })
  }

  CashtanCan() {
    this.httpService.cashtanGetCancelled(this.ipn).subscribe({
      next: (data) => {
        this.cashGetCan = data
      },
      error: (err) => {
        // this.messageService.sendError(`${err.status}: ${err.error.detail}`)
      },
      complete: async () => {
        // console.log(this.CashGetCan)
      }
    })
  }

  userAsepInfo() {
    this.httpService.asepReq(this.ipn).subscribe({
      next: (data) => {
        this.asepInfo = data
      },
      error: (err) => {
        // this.messageService.sendError(`${err.status}: ${err.error.detail}`)
        this.loaderInfo++
      },
      complete: async () => {
        // console.log(this.asepInfo)
        this.loaderInfo++
      }
    })
  }

  userProperty() {
    this.httpService.getProperty(this.ipn).subscribe({
      next: (data) => {
        this.prop = data
      },
      error: (err) => {
        // this.messageService.sendError(`${err.status}: ${err.error.detail}`)
      },
      complete: async () => {
        // console.log(this.prop)
      }
    })
  }

  userAuto() {
    this.httpService.getAuto(this.ipn).subscribe({
      next: (data) => {
        this.auto = data
      },
      error: (err) => {
        // this.messageService.sendError(`${err.status}: ${err.error.detail}`)
      },
      complete: async () => {
        // console.log(this.auto)
      }
    })
  }

  userMilitaryInfo() {
    this.httpService.military(this.ipn).subscribe({
      next: (data) => {
        this.military = data
      },
      error: (err) => {
        // this.messageService.sendError(`${err.status}: ${err.error.detail}`)
        this.index_check++
      },
      complete: async () => {
        // console.log(this.military)
        this.index_check++
        if (this.index_check === 10) {
          this.requestLog()
        }
      }
    })
  }

  creditK1() {
    this.httpService.creditTable(this.ipn).subscribe({
      next: (data) => {
        this.creditTable = data
        // console.log(this.creditTable)
      },
      error: (err) => {
        // this.messageService.sendError(`${err.status}: ${err.error.detail}`)
        this.index_check++
      },
      complete: async () => {
        // console.log(this.creditTable)
        this.index_check++
        if (this.index_check === 10) {
          this.requestLog()
        }
      }
    })
  }

  userBanned() {
    this.httpService.banned(this.ipn).subscribe({
      next: (data) => {
        this.bannedUser = data
      },
      error: (err) => {
        // this.messageService.sendError(`${err.status}: ${err.error.detail}`)
        this.index_check++
      },
      complete: async () => {
        // console.log(this.bannedUser)
        this.index_check++
        if (this.index_check === 10) {
          this.requestLog()
        }
      }
    })
  }

  userBkiInfo() {
    this.httpService.bki(this.ipn).subscribe({
      next: (data) => {
        this.bkiInfo = data
      },
      error: (err) => {
        // this.messageService.sendError(`${err.status}: ${err.error.detail}`)
        this.index_check++
      },
      complete: async () => {
        // console.log(this.bkiInfo)
        this.index_check++
        if (this.index_check === 10) {
          this.requestLog()
        }
      }
    })
  }

  getCancel() {
    this.httpService.getCancelledDocs(this.ipn).subscribe({
      next: (data) => {
        this.cashCancelledDocs = data
      },
      error: (err) => {
        // this.messageService.sendError(`Проблема в кансел докс`)
      },
      complete: async () => {
        // console.log(this.CashCancelledDocs)
      }
    })
  }

  userCashflowClean() {
    this.httpService.cashflow(this.ipn).subscribe({
      next: (data) => {
        this.cashflowClean = data
      },
      error: (err) => {
        // this.messageService.sendError(`${err.status}: ${err.error.detail}`)
        this.index_check++
      },
      complete: async () => {
        // console.log(this.cashflowClean)
        this.index_check++
        if (this.index_check === 10) {
          this.requestLog()
        }
      }
    })
  }

  userContactable() {
    this.httpService.contact(this.ipn).subscribe({
      next: (data) => {
        this.getContactable = data
      },
      error: (err) => {
        // this.messageService.sendError(`${err.status}: ${err.error.detail}`)
        this.index_check++
      },
      complete: async () => {
        // console.log(this.getContactable)
        this.index_check++
        if (this.index_check === 10) {
          this.requestLog()
        }
      }
    })
  }

  userCourtData() {
    this.httpService.court(this.ipn).subscribe({
      next: (data) => {
        this.courtData = data
      },
      error: (err) => {
        // this.messageService.sendError(`${err.status}: ${err.error.detail}`)
        this.loaderInfo++
      },
      complete: async () => {
        // console.log(this.courtData)
        this.loaderInfo++
      }
    })
  }

  userIncomeNcsCredits() {
    this.httpService.inNkCredits(this.ipn).subscribe({
      next: (data) => {
        this.getIncomeNcsCredits = data
      },
      error: (err) => {
        // this.messageService.sendError(`${err.status}: ${err.error.detail}`)
        this.loaderInfo++
      },
      complete: async () => {
        // console.log(this.getIncomeNcsCredits)
        this.loaderInfo++
      }
    })
  }

  userOpenCredit() {
    this.httpService.openCredit(this.ipn).subscribe({
      next: (data) => {
        this.openCredit = data
      },
      error: (err) => {
        // this.messageService.sendError(`${err.status}: ${err.error.detail}`)
        this.index_check++
      },
      complete: async () => {
        // console.log(this.openCredit)
        this.index_check++
        if (this.index_check === 10) {
          this.requestLog()
        }
      }
    })
  }

  userPaymentDelay() {
    this.httpService.payment(this.ipn).subscribe({
      next: (data) => {
        this.paymentDelay = data
      },
      error: (err) => {
        // this.messageService.sendError(`${err.status}: ${err.error.detail}`)
        this.index_check++
      },
      complete: async () => {
        // console.log(this.paymentDelay)
        this.index_check++
        if (this.index_check === 10) {
          this.requestLog()
        }
      }
    })
  }

  userRiskScoring() {
    this.httpService.risk(this.ipn).subscribe({
      next: (data) => {
        this.riskScoring = data
      },
      error: (err) => {
        // this.messageService.sendError(`${err.status}: ${err.error.detail}`)
        this.index_check++
      },
      complete: async () => {
        // console.log(this.riskScoring)
        this.index_check++
        if (this.index_check === 10) {
          this.requestLog()
        }
      }
    })
  }

  userWeekCredit() {
    this.httpService.weekCredit(this.ipn).subscribe({
      next: (data) => {
        this.weekCredit = data
      },
      error: (err) => {
        // this.messageService.sendError(`${err.status}: ${err.error.detail}`)
        this.index_check++
      },
      complete: async () => {
        // console.log(this.weekCredit)
        this.index_check++
        if (this.index_check === 10) {
          this.requestLog()
        }
      }
    })
  }

  requestLog() {
    if (this.index_check === 8) {
      this.httpService
        .getRequestLog(
          this.ipn,
          this.asepInfo,
          this.bannedUser,
          this.openCredit,
          this.bkiInfo,
          this.cashflowClean,
          this.getContactable,
          this.courtData,
          this.getIncomeNcsCredits,
          this.paymentDelay,
          this.riskScoring,
          this.weekCredit
        )
        .subscribe({
          // next: () => console.log('ok'),
          error: (err) => {
            // this.messageService.sendError(`${err.status}: ${err.error.detail}`)
          }
          // complete: async () => console.log('gotovo')
        })
    }
  }

  uploadFinApi() {
    let params: HttpParams
    if (this.ipn != '') {
      params = new HttpParams().set('ipn', this.ipn)
    } else {
      params = new HttpParams().set('name', this.name)
    }
    this.httpService.finApiRequest(params).subscribe({
      next: (data) => (this.finapi = data),
      error: (err) => {
        // console.log(err)
      },
      complete: async () => {
        // console.log(this.finap)
        // console.log(params)
        this.fioSee = 1
      }
    })
  }
}
