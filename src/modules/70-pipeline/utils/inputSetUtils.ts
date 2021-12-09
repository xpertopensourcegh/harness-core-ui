import type { InputSetSummaryResponse } from 'services/pipeline-ng'

export interface InputSetSummaryResponseExtended extends InputSetSummaryResponse {
  action?: string
  lastUpdatedBy?: string
  createdBy?: string
  inputFieldSummary?: string
}

export const isInputSetInvalid = (data: InputSetSummaryResponseExtended): boolean => {
  if (data.entityValidityDetails?.valid === false) {
    return true
  }
  if (
    data.inputSetErrorDetails?.uuidToErrorResponseMap &&
    Object.keys(data.inputSetErrorDetails.uuidToErrorResponseMap)?.length
  ) {
    return true
  }
  if (data.overlaySetErrorDetails && Object.keys(data.overlaySetErrorDetails)?.length) {
    return true
  }
  return false
}
