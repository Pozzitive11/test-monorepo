export interface CourtData {
  records: [
    {
      record_date: string,
      record_number: string,
      type: string,
      debptor_code: string,
      debptor_name: string,
      case_number: string,
      court_name: string,
      start_action_date: string,
      end_action_date: string,
      deadline: string
    }
  ]
}
