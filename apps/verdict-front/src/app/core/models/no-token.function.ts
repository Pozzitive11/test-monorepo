import { HttpContextToken } from '@angular/common/http'

export const NO_TOKEN = new HttpContextToken(() => false)
