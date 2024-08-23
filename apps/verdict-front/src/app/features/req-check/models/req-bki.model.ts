export interface BKI {
  bki_date_diff: number,
  debt_part_percent: number,
  active_part_percent: number,
  closed_credits_sum: number,
  sum_amt_debt_exp: number,
  bki_sex: number
}


export interface BKICash {
  active_part_percent: number,
  all_credit_sum: number,
  closed_sum: number,
  debt_exp_sum: number,
  debt_part_percent: number,
  debt_sum: number,
  get_ubki_date: string,
  get_ubki_date_diff: number,
  open_sum: number,
  sold_sum: number
}
