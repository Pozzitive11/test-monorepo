import { INavbarData } from './i-navbar-data.model'

export const navbarData: INavbarData[] = [
  {
    routeLink: 'dashboard',
    external: false,
    icon: 'fa-solid fa-table-columns',
    label: 'Звіти К1',
    items: [
      {
        routeLink: 'http://10.11.32.60:8050/',
        external: true,
        label: 'Дашборд К1'
      },
      {
        routeLink: 'http://10.11.32.60:8050/req_check',
        external: true,
        label: 'Видача кредиту'
      }
    ]
  },
  {
    routeLink: 'dashboard',
    external: false,
    icon: 'fa-sharp fa-solid fa-table-list',
    label: 'Звіти КЦ',
    items: [
      {
        routeLink: 'callcenter',
        external: false,
        label: 'Дашборд КЦ'
      },
      {
        routeLink: 'http://10.11.32.60:8080/',
        external: true,
        label: 'Скіп К1'
      }
    ]
  },
  {
    routeLink: 'dashboard',
    external: false,
    icon: 'fa-sharp fa-solid fa-table-list',
    label: 'Виконавчі Провадження',
    items: [
      {
        routeLink: 'ep_dashboards',
        external: false,
        label: 'Звіти за ВП'
      }
    ]
  },
  {
    routeLink: 'products',
    external: false,
    icon: 'fa-solid fa-coins',
    label: 'Фінансові звіти',
    items: [
      {
        routeLink: 'http://10.11.33.15:8050/reports',
        external: true,
        label: 'Дашборд Фін'
      }
    ]
  },
  {
    routeLink: 'statistics',
    external: false,
    icon: 'fa fa-scale-unbalanced-flip',
    label: 'Роботи для юристів',
    items: [
      {
        routeLink: '/asep_bot',
        external: true,
        label: 'ГІС-бот'
      },
      {
        routeLink: '/lawyers/bot',
        external: true,
        label: 'Суд-бот'
      },
      {
        routeLink: 'lawyers',
        external: true,
        label: 'Пошук ЄДРСР'
      },
      {
        routeLink: 'lawyers/case_stages',
        external: true,
        label: 'Банкрутство'
      }
    ]

  },
  {
    routeLink: 'coupens',
    external: false,
    icon: 'fa-solid fa-chart-line',
    label: 'Застосунки КЦ',
    items: [
      {
        routeLink: 'http://10.11.32.57:8080/',
        external: true,
        label: 'Quality control'
      },
      {
        routeLink: 'purpose_payments',
        external: false,
        label: 'Рознесення платежів'
      },
      {
        routeLink: 'discounts',
        external: false,
        label: 'Дисконти'
      },
      {
        routeLink: 'http://10.11.32.60:8080/',
        external: true,
        label: 'Карась'
      }
    ]
  },
  {
    routeLink: 'pages',
    external: false,
    icon: 'fa-solid fa-business-time',
    label: 'Інші застосунки',
    items: [
      {
        routeLink: 'http://10.11.32.57:8000',
        external: true,
        label: 'Розбивка часу'
      }
    ]
  },
  {
    routeLink: 'pages',
    external: false,
    icon: 'fa-solid fa-scale-balanced',
    label: 'Звіти по судах',
    items: [
      {
        routeLink: '',
        external: false,
        label: 'Заставні',
        items: [
          {
            routeLink: '',
            external: false,
            label: 'Звіт подачі нерухомості'
          }
        ]
      },
      {
        routeLink: '',
        external: false,
        label: 'Беззаставні',
        items: [
          {
            routeLink: '',
            external: false,
            label: 'Звіт подачі беззалог'
          }
        ]
      }
    ]
  }

]
