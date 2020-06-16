import type { DSConfig } from '@wings-software/swagger-ts/definitions'

export const RouteVerificationTypeToVerificationType: { [routeType: string]: DSConfig['type'] } = {
  'app-dynamics': 'APP_DYNAMICS',
  splunk: 'SPLUNK'
}

export const VerificationTypeToRouteVerificationType: { [type: string]: string } = {
  APP_DYNAMICS: 'app-dynamics',
  SPLUNK: 'splunk'
}

export const connectorId = 'g8eLKgBSQ368GWA5FuS7og' //'r3vdWFQsRHOPrdol-6URBg' //
export const accountId = 'zEaak-FLS425IEO7OLzMUg' //kmpySmUISimoRrJL6NL73w
export const appId = 'qJ_sRGAjRTyD9oXHBRkxKQ' //t0-jbpLoR7S2BTsNfsk4Iw'
export const projectIdentifier = '1234'
