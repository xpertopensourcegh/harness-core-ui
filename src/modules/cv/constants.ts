import type { CVConfig } from '@wings-software/swagger-ts/definitions'

export const RouteVerificationTypeToVerificationType: { [routeType: string]: CVConfig['type'] } = {
  'app-dynamics': 'APP_DYNAMICS'
}
