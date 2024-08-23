// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  BACKEND_URL: 'http://localhost:8050',
  API_BASE_URL: '/api/v0',

  common_url: '/common',
  SOCKET_ENDPOINT: 'ws://localhost:8050/api/v0/websocket',
  asep_socket: 'ws://localhost:8020/api/v0/ASVPBot',
  postukr_socket: 'ws://localhost:8020/api/v0/ukr_post',
  electronic_court_socket: 'ws://localhost:8020/api/v0/e_court/send_claims_socket',
  auth_api_url: '/auth',
  purpose_api_url: '/PurposePayments',
  cc_api_url: '/callcenter',
  discounts_api_url: '/discounts',
  long_requests_api_url: '/long_req',
  ep_dashboard_api_url: '/ep_dashboards',
  private_entrepreneurs_url: '/private_entrepreneurs',
  req_check: '/request_check',
  quality_control: '/quality_control',
  electronic_court: '/e_court',
  nks_errors: '/nks_errors',
  opencourt: '/opencourt',
  verdict_sheets: '/verdict-sheets',

  asep_api_url: 'http://localhost:8020/api/v0/ASVPBot',
  case_stages: 'http://localhost:8020/api/v0/ArbitrCourt/arbtr/pivot_tables',

  edrsr: 'http://localhost:8020/api/v0/edrsr_cases',
  judiciary: 'http://localhost:8020/api/v0/judiciary',

  ukrpost: 'http://localhost:8020/api/v0/ukr_post'
}

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
