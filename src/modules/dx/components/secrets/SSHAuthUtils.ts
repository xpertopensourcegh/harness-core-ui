import { Scope } from 'modules/common/interfaces/SecretsInterface'
import type { SSHConfigFormData } from 'modules/dx/modals/CreateSSHCredModal/views/StepAuthentication'
import type {
  KerberosConfigDTO,
  TGTPasswordSpecDTO,
  TGTKeyTabFilePathSpecDTO,
  SecretDTOV2,
  SecretTextSpecDTO,
  SSHConfigDTO,
  SSHKeyPathCredentialDTO,
  SSHKeyReferenceCredentialDTO,
  SSHPasswordCredentialDTO
} from 'services/cd-ng'
import { postSecretPromise as createSecret } from 'services/cd-ng'

import i18n from './SSHAuthUtils.i18n'

type SSHCredentialType = SSHKeyPathCredentialDTO | SSHKeyReferenceCredentialDTO | SSHPasswordCredentialDTO

interface Identifiers {
  accountId: string
  orgIdentifier?: string
  projectIdentifier?: string
}

const getReference = (scope?: Scope, identifier?: string): string | undefined => {
  switch (scope) {
    case Scope.PROJECT:
      return identifier
    case Scope.ORG:
      return `org.${identifier}`
    case Scope.ACCOUNT:
      return `acc.${identifier}`
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
        })
      }
      return {
        userName: data.userName,
        key: getReference(data.key?.scope, data.key?.identifier),
        encryptedPassphrase: getReference(
          data.encryptedPassphraseSecret?.scope,
          data.encryptedPassphraseSecret?.secretId
        )
      } as SSHKeyReferenceCredentialDTO
    case 'KeyPath':
      if (data.encryptedPassphraseText?.isReference === false && data.encryptedPassphraseText?.value) {
        await createSecret({
          queryParams: { accountIdentifier: identifiers.accountId },
          body: {
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
        })
      }
      return {
        userName: data.userName,
        keyPath: data.keyPath,
        encryptedPassphrase: getReference(
          data.encryptedPassphraseSecret?.scope,
          data.encryptedPassphraseSecret?.secretId
        )
      } as SSHKeyPathCredentialDTO
    case 'Password':
      if (data.passwordText?.isReference === false && data.passwordText?.value) {
        await createSecret({
          queryParams: { accountIdentifier: identifiers.accountId },
          body: {
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
    case 'None':
      return {
        principal: data.principal,
        realm: data.realm,
        tgtGenerationMethod: data.tgtGenerationMethod
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
