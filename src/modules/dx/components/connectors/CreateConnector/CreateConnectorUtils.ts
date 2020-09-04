import type { ConnectorConfigDTO } from 'services/cd-ng'
import { Scope } from '../../SecretReference/SecretReference'

export const ConnectorSecretScope: { [scope: string]: string } = {
  [Scope.ORG]: 'org.',
  [Scope.ACCOUNT]: 'acc.'
}

export function getScopingStringFromSecretRef(connecterConfig: ConnectorConfigDTO): string | undefined {
  return connecterConfig &&
    connecterConfig.passwordRefSecret &&
    connecterConfig.passwordRefSecret.scope !== Scope.PROJECT
    ? ConnectorSecretScope[connecterConfig.passwordRefSecret.scope]
    : undefined
}
