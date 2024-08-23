export interface ISheetAccessInfoModel {
  sheetUid: string | null
  groupName: string | null
  accessLevel: TAccessLevel
  userId: number
  userLogin: string | null
  userFullName: string | null
}

export enum AccessLevelEnum {
  ADMIN,
  CONFIG,
  READ_WRITE,
  READ_ONLY,
}

export type TAccessLevel = typeof AccessLevelEnum[keyof typeof AccessLevelEnum]

export const accessLevels: { value: AccessLevelEnum; label: string }[] = [
  { value: AccessLevelEnum.ADMIN, label: 'Адміністатор' },
  { value: AccessLevelEnum.CONFIG, label: 'Конфігуратор таблиць' },
  { value: AccessLevelEnum.READ_WRITE, label: 'Перегляд/редагування таблиць' },
  { value: AccessLevelEnum.READ_ONLY, label: 'Тільки перегляд таблиць' }
]



