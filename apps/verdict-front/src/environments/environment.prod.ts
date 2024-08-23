export const environment = {
  production: true,
  BACKEND_URL: 'http://10.11.32.57:8020',
  API_BASE_URL: '/api/v0',

  SOCKET_ENDPOINT: 'ws://10.11.32.57:8020/api/v0/websocket',
  asep_socket: 'ws://test.data-factory.ua/enforcement/api/v0/ASVPBot',
  postukr_socket: 'ws://10.11.32.60:8000/api/v0/ukr_post',
  electronic_court_socket: 'ws://10.11.32.60:8000/api/v0/e_court/send_claims_socket',

  common_url: '/common',
  auth_api_url: '/auth',
  purpose_api_url: '/PurposePayments',
  cc_api_url: '/callcenter',
  discounts_api_url: '/discounts',
  long_requests_api_url: '/long_req',
  ep_dashboard_api_url: '/ep_dashboards',
  private_entrepreneurs_url: '/private_entrepreneurs',
  req_check: '/request_check',
  quality_control: '/quality_control',
  nks_errors: '/nks_errors',
  opencourt: '/opencourt',
  verdict_sheets: '/verdict-sheets',

  asep_api_url: 'http://dev.data-factory.ua/enforcement/api/v0/ASVPBot',
  case_stages: 'http://10.11.32.60:8000/api/v0/ArbitrCourt/arbtr/pivot_tables',
  edrsr: 'http://10.11.32.60:8000/api/v0/edrsr_cases',
  judiciary: 'http://10.11.32.60:8000/api/v0/judiciary',
  ukrpost: 'http://10.11.32.60:8000/api/v0/ukr_post',
  electronic_court: 'http://10.11.32.60:8000/api/v0/e_court'
}
