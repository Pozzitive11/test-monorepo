import { faL } from '@fortawesome/free-solid-svg-icons'
import { pageNamesModel } from './page-names.model'

export interface NavLinkInfo {
  link: string
  name: string
  disabled: boolean
  child_links?: NavLinkInfo[]
}

export const navLinksDataModel: { mainPartsPages: NavLinkInfo[]; [key: string]: NavLinkInfo[] } = {
  mainPartsPages: [
    { name: pageNamesModel.purposePayments, link: '/purpose_payments', disabled: false },
    { name: pageNamesModel.privateEntrepreneurs, link: '/private_entrepreneurs', disabled: false },
    { name: pageNamesModel.callcenter, link: '/callcenter', disabled: false },
    { name: pageNamesModel.discounts, link: '/discounts', disabled: false },
    { name: pageNamesModel.asepBot, link: '/asep_bot', disabled: false },
    { name: pageNamesModel.lawyers, link: '/lawyers', disabled: false },
    { name: pageNamesModel.epDashboards, link: '/ep_dashboards', disabled: false },
    { name: pageNamesModel.postukr, link: '/postukr', disabled: false },
    { name: pageNamesModel.reqCheck, link: '/req-check', disabled: false },
    { name: pageNamesModel.qualityControl, link: '/quality-control', disabled: false },
    { name: pageNamesModel.electronic_court, link: '/electronic-court', disabled: false },
    { name: pageNamesModel.nksErrors, link: '/nks-errors', disabled: false },
    { name: pageNamesModel.opencourt, link: '/opencourt', disabled: false },
    { name: pageNamesModel.verdictSheets, link: '/verdict-sheets', disabled: false },
    { name: pageNamesModel.documentationTable, link: '/documentation-table', disabled: false }
  ],

  [pageNamesModel.main]: [{ link: '/dashboard', name: 'Dashboard', disabled: false }],
  [pageNamesModel.purposePayments]: [
    { link: '/purpose_payments/process_purpose_payments', name: 'Обробка платежів', disabled: false },
    { link: '/purpose_payments', name: 'Рознесення платежів', disabled: false },
    { link: '/purpose_payments/history', name: 'Історія змін', disabled: false },
    { link: '/purpose_payments/verification', name: 'Звірка платежів', disabled: false }
  ],
  [pageNamesModel.callcenter]: [
    { name: 'Сегменти RPC і NC', link: '/callcenter/SegmentsRPCNC', disabled: false },
    { name: 'Щоденна робота КЦ', link: '/callcenter/EverydayCallCenter', disabled: false },
    { name: 'Дохід', link: '/callcenter/Income', disabled: false },
    { name: 'Платежі у розрізі проектів та ознаки ВП', link: '/callcenter/ProjectEPReturns', disabled: false },
    { name: 'Перетин ІПН', link: '/callcenter/IntersectionsINN', disabled: false },
    { name: 'Сегментація', link: '/callcenter/Segmentation', disabled: false },
    { name: 'Звіт з листів', link: '/callcenter/Mails', disabled: false },
    { name: 'План/факт за часом', link: '/callcenter/TimePlanFact', disabled: false },
    { name: 'Метрики по Проєктам', link: '/callcenter/ProjectMetrics', disabled: false }
  ],
  [pageNamesModel.discounts]: [
    // { link: '/discounts', name: 'ДС/РС', disabled: false },
    { link: '/discounts/nks-requests', name: 'Запити по НКС', disabled: false },
    { link: '/discounts/military_docs', name: 'Облік документів військових', disabled: false },
    { link: '/discounts/promotions_table', name: 'Узгодження', disabled: false },
    { link: '/discounts/sending_docs', name: 'Відправка документів', disabled: false },
    { link: '/discounts/promotions_table/templates', name: 'Шаблони', disabled: false },
    { link: '/discounts/long_requests', name: 'Довгі заявки', disabled: false },
    { link: '/discounts/long_requests/consolidated_info', name: 'Консолідована інформація', disabled: false }
  ],
  [pageNamesModel.asepBot]: [
    { link: '/asep_bot', name: 'Загальна інформація', disabled: false },
    { link: '/asep_bot/uploaded', name: 'Завантажені файли', disabled: false }
  ],
  [pageNamesModel.lawyers]: [
    { link: '/lawyers', name: 'Пошук ЄДРСР', disabled: false },
    { link: '/lawyers/case_stages', name: 'Банкрутство', disabled: false },
    { link: '/lawyers/bot', name: 'Суд-бот', disabled: false },
    { link: '/lawyers/events', name: 'Очікувані події', disabled: false }
  ],
  [pageNamesModel.epDashboards]: [
    {
      link: '',
      name: 'Робота з ВП',
      disabled: false,
      child_links: [
        { link: '/ep_dashboards/all_ep', name: 'Звіт по всім ВП', disabled: false },
        { link: '/ep_dashboards/all_ep_wp', name: 'Звіт по ВП наших компаній', disabled: false },
        { link: '/ep_dashboards/actuallyreport', name: 'Звіт по фактично виконаним ВП', disabled: false },
        {
          link: '/ep_dashboards/actuallycurator',
          name: 'Звіт по опрацюванню фактично виконаних ВП кураторами',
          disabled: false
        },
        { link: '/ep_dashboards/actuallyreasons', name: 'Причини завершення ВП', disabled: false },
        { link: '/ep_dashboards/avans', name: 'Звіт по поверненню авансових платежів', disabled: false },
        { link: '/ep_dashboards/dept', name: 'Звіт по заміні сторони на ДЕБТ', disabled: false },
        { link: '/ep_dashboards/dfs', name: 'Звіт по перепровірці ДФС', disabled: false }
      ]
    },
    {
      link: '',
      name: 'Звіти по торгам',
      disabled: false,
      child_links: [
        { link: '/ep_dashboards/auctions', name: 'Звіт по торгам', disabled: false },
        { link: '/ep_dashboards/auctionnot', name: '3/4 торги які не відбулися', disabled: false },
        { link: '/ep_dashboards/cashflow', name: 'Cash flow по торгам', disabled: false },
        { link: '/ep_dashboards/sum', name: 'Очікувана сума після реалізації з торгів', disabled: false }
      ]
    },
    {
      link: '',
      name: 'Звіти по опису майна',
      disabled: false,
      child_links: [
        { link: '/ep_dashboards/describefirst', name: 'Черга майна на опрацювання', disabled: false },
        { link: '/ep_dashboards/describesecond', name: 'Черга на опис нерухомості', disabled: false },
        { link: '/ep_dashboards/describethird', name: 'Черга на опис нерухомості ПВ', disabled: false },
        { link: '/ep_dashboards/auctionpriority', name: 'Черга на опис майна пріоритетні', disabled: false },
        { link: '/ep_dashboards/describefourth', name: 'Черга на опис з обрізкою по сумі', disabled: false }
      ]
    },
    {
      link: '',
      name: 'Звіти по платежам',
      disabled: false,
      child_links: [
        { link: '/ep_dashboards/payments', name: 'Платежі після заяви в суд', disabled: false },
        {
          link: '/ep_dashboards/refunds',
          name: 'Повернені кошти по зупиненим,завершеним,негативним рішення і скасуванню ВНН',
          disabled: false
        },
        { link: '/ep_dashboards/wpwk', name: 'Платежі після заміни у ВП на ВК', disabled: false },
        { link: '/ep_dashboards/wpdept', name: 'Платежі після заміни у ВП на ДЕБТ', disabled: false },
        { link: '/ep_dashboards/wpfop', name: 'Платежі після заміни у ВП на ФОП', disabled: false }
      ]
    },
    {
      link: '',
      name: 'Звіти по СЛ і закриттю ВП',
      disabled: false,
      child_links: [
        { link: '/ep_dashboards/slreport', name: 'Звіт по виконаним угодам для СЛ і закриття ВП', disabled: false },
        {
          link: '/ep_dashboards/factslreport',
          name: 'Звіт по фактично виконаним ВП для СЛ і закриття ВП',
          disabled: false
        }
      ]
    }
  ],
  [pageNamesModel.privateEntrepreneurs]: [
    { link: '/private_entrepreneurs', name: 'Рахунки ФОП', disabled: false },
    { link: '/private_entrepreneurs/table', name: 'Таблиця', disabled: false }
  ],
  [pageNamesModel.postukr]: [
    { link: '/postukr', name: 'Адреси', disabled: false },
    { link: '/postukr/post-reestr', name: 'Реєстр', disabled: false },
    { link: '/postukr/post-editing-shipments', name: 'Редагування відправлень', disabled: false },
    { link: '/postukr/post-tracking-shipments', name: 'Відстеження відправлень', disabled: false },
    { link: '/postukr/post-ukr-show-reestr', name: 'Перегляд реєстрів', disabled: false }
  ],
  [pageNamesModel.reqCheck]: [{ link: '/req-check', name: 'Перевірка заявок', disabled: false }],
  [pageNamesModel.qualityControl]: [
    { link: '/quality-control/quality-control-evaluation', name: 'Керування листом оцінювання', disabled: false },
    { link: '/quality-control/quality-control-penalty', name: 'Керування листом штрафів', disabled: false },
    { link: '/quality-control/quality-control-monitoring', name: 'Керування моніторингами', disabled: false },
    { link: '/quality-control/quality-control-report', name: 'Керування звітами', disabled: false },
    { link: '/quality-control/quality-control-user', name: 'Керування користувачами', disabled: false },
    { link: '/quality-control/quality-calls', name: 'Керування дзвінками', disabled: false }
  ],
  [pageNamesModel.electronic_court]: [],
  [pageNamesModel.nksErrors]: [],
  [pageNamesModel.opencourt]: [],
  [pageNamesModel.verdictSheets]: [
    { link: '/verdict-sheets', name: 'ВК таблиці', disabled: false },
    { link: '/verdict-sheets/config', name: 'Конфігурація', disabled: false }
  ],
  [pageNamesModel.documentationTable]: []
}
