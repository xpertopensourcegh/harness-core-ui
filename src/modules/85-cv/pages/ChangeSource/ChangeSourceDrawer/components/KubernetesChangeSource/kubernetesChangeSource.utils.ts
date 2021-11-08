import type { GetDataError } from 'restful-react'
import { StatusOfValidation } from '@cv/pages/components/ValidationStatus/ValidationStatus.constants'
import type { Failure } from 'services/cv'
import type { UseStringsReturn } from 'framework/strings'
import { getErrorMessage } from '@cv/utils/CommonUtils'

export function determineValidationStatus({
  isEdit,
  loading,
  error,
  result,
  getString
}: {
  isEdit?: boolean
  loading: boolean
  error?: GetDataError<Failure | Error> | null
  result?: boolean
  getString: UseStringsReturn['getString']
}): {
  status?: StatusOfValidation
  text?: string
} {
  if (isEdit) {
    return {}
  }

  if (loading) {
    return { status: StatusOfValidation.IN_PROGRESS, text: getString('cv.changeSource.kubernetes.validatingConnector') }
  }

  if (error) {
    return { status: StatusOfValidation.ERROR, text: getErrorMessage(error) }
  }

  if (result === true) {
    return { status: StatusOfValidation.SUCCESS }
  }

  if (result === false) {
    return {
      status: StatusOfValidation.ERROR,
      text: getString('cv.changeSource.kubernetes.invalidConnector')
    }
  }

  return {}
}
