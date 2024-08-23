import { DctAbstractDataModel } from './dct-abstract.data.model'
import { DctGuaranteeLetterDataModel } from './dct-guarantee-letter-data.model'
import { DctInformLetterDataModel } from './dct-inform-letter-data.model'
import { DctWritingOffDataModel } from './dct-writing-off-data.model'

export type DctDataType =
  DctInformLetterDataModel
  | DctWritingOffDataModel
  | DctGuaranteeLetterDataModel
  | DctAbstractDataModel
