export interface UserRole {
  Id: number
  Name: string
  Level: number
}
export interface UserLogin {
  id: number
  FullName: string
  Login: number
}
export interface UserLead {
  FullName: string
  Id: number
  Login: string
  RoleName: string
}
export interface UserFromDB {
  Id: number
  Login: string
  FullName: string
  RoleName: string
  EmploymentDate: string
  DismissalDate: boolean
}
export interface SubordinatesUser {
  Id: number
  Login: string
  FullName: string
  RoleName: string
  EmploymentDate: string
  DismissalDate: string | null
  Email: string
  Probation: boolean
}
export interface UserShortInfo {
  [key: string]: string | number | null
}

export interface UserInfo {
  UserId: number
  RoleId: number
  EmploymentDate: string
  Probation: boolean
  Email: string
  password: string
  Id: number
  DismissalDate: string
}

export interface UserManager {
  Id: number
  IsActual: boolean
  StartDate: string
  ManagerId: number
  UserId: number
}
