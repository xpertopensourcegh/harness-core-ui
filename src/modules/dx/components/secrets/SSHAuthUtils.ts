import { pick } from 'lodash-es'
import { Scope } from 'modules/common/interfaces/SecretsInterface'
import type { SSHConfigFormData } from 'modules/dx/modals/CreateSSHCredModal/views/StepAuthentication'
import type { DetailsForm } from 'modules/dx/modals/CreateSSHCredModal/views/StepDetails'
import type {
  KerberosConfigDTO,
  TGTPasswordSpecDTO,
  TGTKeyTabFilePathSpecDTO,
  SecretDTOV2,
  SecretTextSpecDTO,
  SSHConfigDTO,
  SSHKeyPathCredentialDTO,
  SSHKeyReferenceCredentialDTO,
  SSHPasswordCredentialDTO,
  SSHKeySpecDTO,
  SSHAuthDTO
} from 'services/cd-ng'
import { postSecretPromise as createSecret } from 'services/cd-ng'

import i18n from './SSHAuthUtils.i18n'

type SSHCredentialType = SSHKeyPathCredentialDTO | SSHKeyReferenceCredentialDTO | SSHPasswordCredentialDTO

interface Identifiers {
  accountId: string
  orgIdentifier?: string
  projectIdentifier?: string
}

export const getSSHDTOFromFormData = (formData: DetailsForm & SSHConfigFormData): SecretDTOV2 => {
  return {
    type: 'SSHKey',
    ...pick(formData, ['name', 'description', 'identifier']),
    tags: {},
    spec: {
      port: formData.port,
      auth: {
        type: formData.authScheme,
        spec:
          formData.authScheme === 'Kerberos'
            ? ({
                ...pick(formData, ['principal', 'realm', 'tgtGenerationMethod']),
                spec:
                  formData.tgtGenerationMethod === 'Password'
                    ? ({} as TGTPasswordSpecDTO)
                    : formData.tgtGenerationMethod === 'KeyTabFilePath'
                    ? ({
                        keyPath: formData.keyPath
                      } as TGTKeyTabFilePathSpecDTO)
                    : null
              } as KerberosConfigDTO)
            : ({
                credentialType: formData.credentialType,
                spec:
                  formData.credentialType === 'KeyPath'
                    ? ({
                        userName: formData.userName,
                        keyPath: formData.keyPath
                      } as SSHKeyPathCredentialDTO)
                    : formData.credentialType === 'KeyReference'
                    ? ({
                        userName: formData.userName,
                        key: getReference(formData.key?.scope, formData.key?.identifier),
                        encryptedPassphrase: getReference(
                          formData.encryptedPassphraseSecret?.scope,
                          formData.encryptedPassphraseSecret?.secretId
                        )
                      } as SSHKeyReferenceCredentialDTO)
                    : ({
                        userName: formData.userName,
                        password: getReference(formData.passwordSecret?.scope, formData.passwordSecret?.secretId)
                      } as SSHPasswordCredentialDTO)
              } as SSHConfigDTO)
      } as SSHAuthDTO
    } as SSHKeySpecDTO
  }
}

const getReference = (scope?: Scope, identifier?: string): string | undefined => {
  switch (scope) {
    case Scope.PROJECT:
      return identifier
    case Scope.ORG:
      return `org.${identifier}`
    case Scope.ACCOUNT:
      return `account.${identifier}`
  }
}

export const getStringForType = (type?: SecretDTOV2['type']): string => {
  if (!type) return ''
  switch (type) {
    case 'SecretText':
      return i18n.typeText
    case 'SecretFile':
      return i18n.typeFile
    case 'SSHKey':
      return i18n.typeSSH
    default:
      return ''
  }
}

export const getStringForCredentialType = (type?: SSHConfigDTO['credentialType']): string => {
  switch (type) {
    case 'Password':
      return i18n.optionPassword
    case 'KeyPath':
      return i18n.optionKeypath
    case 'KeyReference':
      return i18n.optionKey
    default:
      return ''
  }
}

async function buildSSHCredentials(
  data: SSHConfigFormData,
  identifiers: Identifiers
): Promise<SSHCredentialType | undefined> {
  switch (data.credentialType) {
    case 'KeyReference':
      if (data.encryptedPassphraseText?.isReference === false && data.encryptedPassphraseText?.value) {
        await createSecret({
          queryParams: { accountIdentifier: identifiers.accountId },
          body: {
            secret: {
              type: 'SecretText',
              name: data.encryptedPassphraseSecret?.secretName as string,
              identifier: data.encryptedPassphraseSecret?.secretId as string,
              orgIdentifier: identifiers.orgIdentifier,
              projectIdentifier: identifiers.projectIdentifier,
              tags: {},
              spec: {
                secretManagerIdentifier: data.encryptedPassphraseSecret?.secretManager?.value as string,
                value: data.encryptedPassphraseText.value,
                valueType: 'Inline'
              } as SecretTextSpecDTO
            }
          }
        })
      }
      if (
        (data.encryptedPassphraseText?.isReference === false && data.encryptedPassphraseText?.value) ||
        data.encryptedPassphraseText?.isReference
      ) {
        return {
          userName: data.userName,
          key: getReference(data.key?.scope, data.key?.identifier),
          encryptedPassphrase: getReference(
            data.encryptedPassphraseSecret?.scope,
            data.encryptedPassphraseSecret?.secretId
          )
        } as SSHKeyReferenceCredentialDTO
      }
      return {
        userName: data.userName,
        key: getReference(data.key?.scope, data.key?.identifier)
      } as SSHKeyReferenceCredentialDTO
    case 'KeyPath':
      if (data.encryptedPassphraseText?.isReference === false && data.encryptedPassphraseText?.value) {
        await createSecret({
          queryParams: { accountIdentifier: identifiers.accountId },
          body: {
            secret: {
              type: 'SecretText',
              name: data.encryptedPassphraseSecret?.secretName as string,
              identifier: data.encryptedPassphraseSecret?.secretId as string,
              orgIdentifier: identifiers.orgIdentifier,
              projectIdentifier: identifiers.projectIdentifier,
              tags: {},
              spec: {
                secretManagerIdentifier: data.encryptedPassphraseSecret?.secretManager?.value as string,
                value: data.encryptedPassphraseText.value,
                valueType: 'Inline'
              } as SecretTextSpecDTO
            }
          }
        })
      }
      if (
        (data.encryptedPassphraseText?.isReference === false && data.encryptedPassphraseText?.value) ||
        data.encryptedPassphraseText?.isReference
      ) {
        return {
          userName: data.userName,
          keyPath: data.keyPath,
          encryptedPassphrase: getReference(
            data.encryptedPassphraseSecret?.scope,
            data.encryptedPassphraseSecret?.secretId
          )
        } as SSHKeyPathCredentialDTO
      } else {
        return {
          userName: data.userName,
          keyPath: data.keyPath
        } as SSHKeyPathCredentialDTO
      }
    case 'Password':
      if (data.passwordText?.isReference === false && data.passwordText?.value) {
        await createSecret({
          queryParams: { accountIdentifier: identifiers.accountId },
          body: {
            secret: {
              type: 'SecretText',
              name: data.passwordSecret?.secretName as string,
              identifier: data.passwordSecret?.secretId as string,
              orgIdentifier: identifiers.orgIdentifier,
              projectIdentifier: identifiers.projectIdentifier,
              tags: {},
              spec: {
                secretManagerIdentifier: data.passwordSecret?.secretManager?.value as string,
                value: data.passwordText.value,
                valueType: 'Inline'
              } as SecretTextSpecDTO
            }
          }
        })
      }
      return {
        userName: data.userName,
        password: getReference(data.passwordSecret?.scope, data.passwordSecret?.secretId)
      } as SSHPasswordCredentialDTO
  }
}

async function buildKerberosConfig(
  data: SSHConfigFormData,
  identifiers: Identifiers
): Promise<KerberosConfigDTO | undefined> {
  switch (data.tgtGenerationMethod) {
    case 'KeyTabFilePath':
      return {
        principal: data.principal,
        realm: data.realm,
        tgtGenerationMethod: data.tgtGenerationMethod,
        spec: {
          keyPath: data.keyPath
        } as TGTKeyTabFilePathSpecDTO
      } as KerberosConfigDTO
    case 'Password':
      if (data.passwordText?.isReference === false && data.passwordText?.value) {
        await createSecret({
          queryParams: { accountIdentifier: identifiers.accountId },
          body: {
            secret: {
              type: 'SecretText',
              name: data.passwordSecret?.secretName as string,
              identifier: data.passwordSecret?.secretId as string,
              orgIdentifier: identifiers.orgIdentifier,
              projectIdentifier: identifiers.projectIdentifier,
              tags: {},
              spec: {
                secretManagerIdentifier: data.passwordSecret?.secretManager?.value as string,
                value: data.passwordText.value,
                valueType: 'Inline'
              } as SecretTextSpecDTO
            }
          }
        })
      }
      return {
        principal: data.principal,
        realm: data.realm,
        tgtGenerationMethod: data.tgtGenerationMethod,
        spec: {
          password: getReference(data.passwordSecret?.scope, data.passwordSecret?.secretId)
        } as TGTPasswordSpecDTO
      } as KerberosConfigDTO
    default:
      return {
        principal: data.principal,
        realm: data.realm
      }
  }
}

export async function buildAuthConfig(
  data: SSHConfigFormData,
  identifiers: Identifiers
): Promise<SSHConfigDTO | KerberosConfigDTO | undefined> {
  let credentials
  switch (data.authScheme) {
    case 'SSH':
      credentials = await buildSSHCredentials(data, identifiers)
      return {
        credentialType: data.credentialType,
        spec: credentials
      } as SSHConfigDTO
    case 'Kerberos':
      return buildKerberosConfig(data, identifiers)
  }
}
