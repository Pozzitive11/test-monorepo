import { UserCasesType } from "../services/court-data.service";

export interface MiniCourtCard {
  id: number;
  caseNumber: string;
  courtName: string;
  judge: string;
  defendant: Person[];
  plaintiff: Person[];
  description: string;
  lastDate: string;
  expanded?: boolean;
  showNotifications?: boolean;
  notifications: any;
}

export interface Person {
  NAME: string;
  EDRPOU: string | null;
  TYPE: string | null;
}
 export interface UserCase {
  id: number;
  caseNumberId: number;
  renewal: any; // тип поля renewal не указан в вашем примере
  files: UploadedFile[];
}
export interface UploadedFile {
  fileName: string;
  createdAt: Date;
  judgmentFormId: number;
  instanceId: number | null;
}

 
interface NotificationType {
  courtChange: string;
  judgeChange: string;
  partyAddition: string;
  sessionAddition: string;
  decisionAddition: string;
  statusChange: string;
}






export interface FullCourtCard extends MiniCourtCard {
selectedCaseNumber: any;
  miniCourtData: any;
  uploadedFiles: any;
  caseNumber: string;
  courtName: string;
  judge: string;
  defendant: Person[];
  plaintiff: Person[];
  description: string;
  lastDate: string;
  courtsCodes: number[];
  region: string;
  defendantType: string;
  plaintiffType: string;
  thirdPerson: Person[];
  caseProc: string;
  dateStart: string;
  stageName: string;
  caseType: string;
  judgmentName: string;
  sumClaim: SumClaim;
  courtHearingDate: string;
  courtHearingCount: number;
  stages: {
    [key: number]: StageData;
  };
  showNotifications: boolean;
  notifications: any;
  nickname:  string;
  fileName: string;
  isExpanded?: boolean;
  showActions: boolean;
  isEditing: boolean;
  selectedAction: any;
  meetingDateTime: string;
  commentInput: string;
  selectedTemplate: string;
  userCase: UserCasesType;
  tag: string;
  instanceId: number;
  judgmentFormId: number;
  newTag:string
  userId: number;
  caseNumberId: number;
  id: number;
  renewal: number;
  isTagEditing:boolean;
  fileToUpload: File
  filenameInput: string;
  documentType?: string;
  instance?: string;
  templateType: string; 
  

  
}

export interface Decisions {
  fileId: any;
  courtName: string;
  document_text: string;
  document_type: string;
  receipt_date: string;
  date_publ: string;
  adjudication_date: string;
  id: string;
  judgment_forms_name: string;
  doc_text_id: string;
  files?: UploadedFile[];
}
export interface SumClaim {
  id: number;
  sumClaim: number;
  interest: number | null;
  commission: number | null;
  lawyerService: number | null;
  isMaterial: boolean;
  document_id: number;
  body: string | null;
  currencyId: number;
  fine: number | null;
  moralDamage: number | null;
  courtFee: number;
}


export interface StageData {
  claim_result?: string;
  court_name: string;
  decisions: Decisions[];
  stageName: string;
  files: UploadedFile[];
}
export interface Stage {
  stageName: string;
  courtName?: string;
  decisions: Decisions[];
  files?: UploadedFile[];
}


export interface ParticipantFilter {
  role: string;
  searchBy: 'name' | 'type';
  value: string;
}

export interface SearchCriteria {
  case_number: string | null,
  court_number: string | null,
  judge_name: string | null,
  region_code: string | null,
  plaintiff: Participant[];
  plaintiff_type: string | null,
  defendant: Participant[];
  defendant_type: string | null,
  third_person: Participant[],
  third_person_type: string | null,
  appellant: Participant[],
  appellant_type: string | null,
  cassant: Participant[],
  cassant_type: string | null,
  description: string | null,
  case_type: string | null,
  start_date: string | null,
  end_date: string | null,
  start_sum: string | null,
  end_sum: string | null
}

interface Participant {
  NAME: string;
  EDRPOU: string;
  TYPE: string;
}
