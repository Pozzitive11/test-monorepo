export interface IncomeAndNcsCredits {
  user_income: number,
  user_factoring_credit: boolean,
  is_user_in_slist: boolean
  user_factoring_credit_details: [
    {
      name: string,
      stop_list: string,
      is_actual: boolean,
      contract_num: string,
      nks: number
    }
  ]
}

