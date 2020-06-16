import type { CVConfig } from '@wings-software/swagger-ts/definitions'

export const RouteVerificationTypeToVerificationType: { [routeType: string]: CVConfig['type'] } = {
  'app-dynamics': 'APP_DYNAMICS',
  splunk: 'SPLUNK'
}

export const VerificationTypeToRouteVerificationType: { [type: string]: string } = {
  APP_DYNAMICS: 'app-dynamics',
  SPLUNK: 'splunk'
}

export const connectorId = 'r3vdWFQsRHOPrdol-6URBg' //g8eLKgBSQ368GWA5FuS7og
export const accountId = "zEaak-FLS425IEO7OLzMUg" //kmpySmUISimoRrJL6NL73w
export const appId = 't0-jbpLoR7S2BTsNfsk4Iw'
export const projectIdentifier = '1234'
