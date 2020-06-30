import type { DSConfig } from '@wings-software/swagger-ts/definitions'

export const RouteVerificationTypeToVerificationType: { [routeType: string]: DSConfig['type'] } = {
  'app-dynamics': 'APP_DYNAMICS',
  splunk: 'SPLUNK'
}

export const VerificationTypeToRouteVerificationType: { [type: string]: string } = {
  APP_DYNAMICS: 'app-dynamics',
  SPLUNK: 'splunk'
}

export const connectorId = 'CzCZn20iSn2Z3rvRKe_AbA' //'r3vdWFQsRHOPrdol-6URBg' //
export const accountId = 'Ww2sKd_KQpKXk5YGyrJ4gw'
export const appId = 'qJ_sRGAjRTyD9oXHBRkxKQ' //t0-jbpLoR7S2BTsNfsk4Iw'
export const projectIdentifier = '1234'
