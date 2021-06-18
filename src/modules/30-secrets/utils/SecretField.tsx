import { Scope } from '@common/interfaces/SecretsInterface'
import { getSecretV2Promise, GetSecretV2QueryParams } from 'services/cd-ng'

export interface SecretReferenceInterface {
  identifier: string
  name: string
  referenceString: string
  accountIdentifier: string
  orgIdentifier?: string
  projectIdentifier?: string
}

export const setSecretField = async (
  secretString: string,
  scopeQueryParams: GetSecretV2QueryParams
): Promise<SecretReferenceInterface | void> => {
  if (!secretString) {
    return undefined
  } else {
    const secretScope = secretString?.indexOf('.') < 0 ? Scope.PROJECT : secretString?.split('.')[0]

    switch (secretScope) {
      case Scope.ACCOUNT:
        delete scopeQueryParams.orgIdentifier
        delete scopeQueryParams.projectIdentifier
        break
      case Scope.ORG:
        delete scopeQueryParams.projectIdentifier
    }

    const identifier = secretString.indexOf('.') < 0 ? secretString : secretString.split('.')[1]
    const response = await getSecretV2Promise({
      identifier,
      queryParams: scopeQueryParams
    })

    return {
      identifier,
      name: response.data?.secret.name || secretString.split('.')[1],
      referenceString: secretString,
      ...scopeQueryParams
    }
  }
}
