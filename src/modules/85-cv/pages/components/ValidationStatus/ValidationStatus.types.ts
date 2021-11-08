import type { StatusOfValidation } from './ValidationStatus.constants'

export interface ValidationStatusProps {
  validationStatus?: StatusOfValidation
  onClick?: () => void
  onRetry?: () => void
  textToDisplay?: string
}
