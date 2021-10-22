import type { SelectOption } from '@wings-software/uicore'
import { get } from 'lodash-es'
import { Color, Utils } from '@wings-software/uicore'
import type { UseStringsReturn } from 'framework/strings'
import type { ResponseListEnvironmentResponse, EnvironmentResponse } from 'services/cd-ng'

export enum RiskValues {
  NO_DATA = 'NO_DATA',
  NO_ANALYSIS = 'NO_ANALYSIS',
  HEALTHY = 'HEALTHY',
  OBSERVE = 'OBSERVE',
  NEED_ATTENTION = 'NEED_ATTENTION',
  UNHEALTHY = 'UNHEALTHY'
}

export function getRiskColorValue(riskStatus?: keyof typeof RiskValues, realCSSColor = true): string {
  switch (riskStatus) {
    case RiskValues.HEALTHY:
      return realCSSColor ? Utils.getRealCSSColor(Color.GREEN_500) : Color.GREEN_500
    case RiskValues.OBSERVE:
      return realCSSColor ? Utils.getRealCSSColor(Color.YELLOW_800) : Color.YELLOW_800
    case RiskValues.NEED_ATTENTION:
      return realCSSColor ? Utils.getRealCSSColor(Color.ORANGE_600) : Color.ORANGE_600
    case RiskValues.UNHEALTHY:
      return realCSSColor ? Utils.getRealCSSColor(Color.RED_600) : Color.RED_600
    default:
      return realCSSColor ? Utils.getRealCSSColor(Color.GREY_400) : Color.GREY_400
  }
}

export function getSecondaryRiskColorValue(riskStatus?: keyof typeof RiskValues, realCSSColor = true): string {
  switch (riskStatus) {
    case RiskValues.HEALTHY:
      return realCSSColor ? Utils.getRealCSSColor(Color.GREEN_50) : Color.GREEN_50
    case RiskValues.OBSERVE:
      return realCSSColor ? Utils.getRealCSSColor(Color.YELLOW_50) : Color.YELLOW_50
    case RiskValues.NEED_ATTENTION:
      return realCSSColor ? Utils.getRealCSSColor(Color.ORANGE_50) : Color.ORANGE_50
    case RiskValues.UNHEALTHY:
      return realCSSColor ? Utils.getRealCSSColor(Color.RED_50) : Color.RED_50
    default:
      return realCSSColor ? Utils.getRealCSSColor(Color.GREY_50) : Color.GREY_50
  }
}

export function roundNumber(value: number, precision = 2) {
  if (Number.isInteger(precision) && precision >= 0) {
    const factor = 10 ** precision
    return Math.round(value * factor) / factor
  }
}

export function getErrorMessage(errorObj?: any): string | undefined {
  return get(errorObj, 'data.detailedMessage') || get(errorObj, 'data.message') || get(errorObj, 'message')
}

export const getEnvironmentOptions = (
  environmentList: ResponseListEnvironmentResponse | null,
  loading: boolean,
  getString: UseStringsReturn['getString']
): SelectOption[] => {
  if (loading) {
    return [{ label: getString('loading'), value: 'loading' }]
  }
  if (environmentList?.data?.length) {
    const allOption: SelectOption = { label: getString('all'), value: getString('all') }
    const environmentSelectOption: SelectOption[] =
      environmentList?.data?.map((environmentData: EnvironmentResponse) => {
        const { name = '', identifier = '' } = environmentData?.environment || {}
        return {
          label: name,
          value: identifier
        }
      }) || []
    return [allOption, ...environmentSelectOption]
  }
  return []
}
