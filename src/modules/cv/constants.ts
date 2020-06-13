import type { CVConfig } from '@wings-software/swagger-ts/definitions'

export const RouteVerificationTypeToVerificationType: { [routeType: string]: CVConfig['type'] } = {
  'app-dynamics': 'APP_DYNAMICS',
  splunk: 'SPLUNK'
}

export const connectorId ="g8eLKgBSQ368GWA5FuS7og"
export const accountId= "zEaak-FLS425IEO7OLzMUg" //"kmpySmUISimoRrJL6NL73w"
export const appId = 'qJ_sRGAjRTyD9oXHBRkxKQ'
export const projectIdentifier = '1234'
export const dataSourceType = 'APP_DYNAMICS'

export const VerificationTypeToRouteVerificationType: { [type: string]: string } = {
  APP_DYNAMICS: 'app-dynamics'
}
