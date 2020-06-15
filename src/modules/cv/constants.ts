import type { CVConfig } from '@wings-software/swagger-ts/definitions'

export const RouteVerificationTypeToVerificationType: { [routeType: string]: CVConfig['type'] } = {
  'app-dynamics': 'APP_DYNAMICS',
  splunk: 'SPLUNK'
}

export const VerificationTypeToRouteVerificationType: { [type: string]: string } = {
  APP_DYNAMICS: 'app-dynamics'
}

export const connectorId = 'r3vdWFQsRHOPrdol-6URBg'
export const accountId = 'kmpySmUISimoRrJL6NL73w'
export const appId = 't0-jbpLoR7S2BTsNfsk4Iw'
export const projectIdentifier = '1234'
