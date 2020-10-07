import { Scope } from 'modules/common/interfaces/SecretsInterface'
import type { ConnectorConfigDTO } from 'services/cd-ng'

export const ConnectorSecretScope: { [scope: string]: string } = {
  [Scope.ORG]: 'org.',
  [Scope.ACCOUNT]: 'account.'
}

export function getScopingStringFromSecretRef(connecterConfig: ConnectorConfigDTO): string | undefined {
  return connecterConfig &&
    connecterConfig.passwordRefSecret &&
    connecterConfig.passwordRefSecret.scope !== Scope.PROJECT
    ? ConnectorSecretScope[connecterConfig.passwordRefSecret.scope]
    : undefined
}
