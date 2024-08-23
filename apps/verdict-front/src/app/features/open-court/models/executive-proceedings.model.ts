export interface MiniExecutiveCard {
    id: number;
    DEBTOR_NAME: string;
    DEBTOR_BIRTHDATE: string | null;
    DEBTOR_CODE: string;
    CREDITOR_NAME: string;
    CREDITOR_CODE: string | null;
    VP_ORDERNUM: number;
    VP_BEGINDATE: string;
    VP_STATE: number;
    ORG_NAME: string;
    ORG_NAME_ID: string | null;
    DVS_CODE: string;
    PHONE_NUM: string;
    EMAIL_ADDR: string;
    BANK_ACCOUNT: string;
  }
  export interface FullEcecutiveCard extends MiniExecutiveCard{
    id: number;
    DEBTOR_NAME: string;
    DEBTOR_BIRTHDATE: string | null;
    DEBTOR_CODE: string;
    CREDITOR_NAME: string;
    CREDITOR_CODE: string | null;
    VP_ORDERNUM: number;
    VP_BEGINDATE: string;
    VP_STATE: number;
    ORG_NAME: string;
    ORG_NAME_ID: string | null;
    DVS_CODE: string;
    PHONE_NUM: string;
    EMAIL_ADDR: string;
    BANK_ACCOUNT: string;
  }
  export interface DvsInfo {
    id: number;
    Name: string;
  }
  export interface DvsResponds{
    count: number;
    dvs_names: DvsInfo[];
  }
  export interface PrivateAgentsInfo {
    id: number;
    FIO: string;
  }
  export interface PrivateAgentsResponds{
    count: number;
    private_agents: PrivateAgentsInfo[];
  }

  