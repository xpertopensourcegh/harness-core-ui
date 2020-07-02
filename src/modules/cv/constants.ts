import type { DSConfig } from '@wings-software/swagger-ts/definitions'

export const RouteVerificationTypeToVerificationType: { [routeType: string]: DSConfig['type'] } = {
  'app-dynamics': 'APP_DYNAMICS',
  splunk: 'SPLUNK'
}

export const VerificationTypeToRouteVerificationType: { [type: string]: string } = {
  APP_DYNAMICS: 'app-dynamics',
  SPLUNK: 'splunk'
}

export const connectorId = '7BgBODXQQtuHI4M7hh9PLA' //'WWF95JcuQ-azSNbH4zt-XQ'
export const accountId = 'kmpySmUISimoRrJL6NL73w'
export const appId = 'lrecRhqqQAyVaGphTW8paw' //t0-jbpLoR7S2BTsNfsk4Iw'
export const projectIdentifier = '1234'
