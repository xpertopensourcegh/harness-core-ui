export enum ValidationStatus {
  IN_PROGRESS = 'in-progress',
  NO_DATA = 'no-data',
  SUCCESS = 'success',
  ERROR = 'error'
}

export interface TierRecord {
  id: number
  name: string
  appId: number
  service?: string
  validationStatus?: ValidationStatus
  metricData?: any
  totalTiers?: number
}

export interface ApplicationRecord {
  id: number
  name: string
  environment?: string
}
