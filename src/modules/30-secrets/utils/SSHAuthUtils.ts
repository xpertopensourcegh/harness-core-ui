import { pick } from 'lodash-es'
import { Scope } from '@common/interfaces/SecretsInterface'
import type { SSHConfigFormData } from '@secrets/modals/CreateSSHCredModal/views/StepAuthentication'
import type { DetailsForm } from '@secrets/modals/CreateSSHCredModal/views/StepDetails'
import type {
  KerberosConfigDTO,
  TGTPasswordSpecDTO,
  TGTKeyTabFilePathSpecDTO,
  SecretDTOV2,
  SSHConfigDTO,
  SSHKeyPathCredentialDTO,
  SSHKeyReferenceCredentialDTO,
  SSHPasswordCredentialDTO,
  SSHKeySpecDTO,
  SSHAuthDTO
} from 'services/cd-ng'

import i18n from './SSHAuthUtils.i18n'

type SSHCredentialType = SSHKeyPathCredentialDTO | SSHKeyReferenceCredentialDTO | SSHPasswordCredentialDTO

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
                    ? ({
                        password: formData.password?.referenceString
                      } as TGTPasswordSpecDTO)
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
                        keyPath: formData.keyPath,
                        encryptedPassphrase: formData.encryptedPassphrase?.referenceString
                      } as SSHKeyPathCredentialDTO)
                    : formData.credentialType === 'KeyReference'
                    ? ({
                        userName: formData.userName,
                        key: getReference(formData.key?.scope, formData.key?.identifier),
                        encryptedPassphrase: formData.encryptedPassphrase?.referenceString
                      } as SSHKeyReferenceCredentialDTO)
                    : ({
                        userName: formData.userName,
                        password: formData.password?.referenceString
                      } as SSHPasswordCredentialDTO)
              } as SSHConfigDTO)
      } as SSHAuthDTO
    } as SSHKeySpecDTO
  }
}

export const getReference = (scope?: Scope, identifier?: string): string | undefined => {
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

function buildSSHCredentials(data: SSHConfigFormData): SSHCredentialType {
  switch (data.credentialType) {
    case 'KeyReference':
      if (data.encryptedPassphrase) {
        return {
          userName: data.userName,
          key: getReference(data.key?.scope, data.key?.identifier),
          encryptedPassphrase: data.encryptedPassphrase.referenceString
        } as SSHKeyReferenceCredentialDTO
      }
      return {
        userName: data.userName,
        key: getReference(data.key?.scope, data.key?.identifier)
      } as SSHKeyReferenceCredentialDTO
    case 'KeyPath':
      if (data.encryptedPassphrase) {
        return {
          userName: data.userName,
          keyPath: data.keyPath,
          encryptedPassphrase: data.encryptedPassphrase.referenceString
        } as SSHKeyPathCredentialDTO
      } else {
        return {
          userName: data.userName,
          keyPath: data.keyPath
        } as SSHKeyPathCredentialDTO
      }
    case 'Password':
      return {
        userName: data.userName,
        password: data.password?.referenceString
      } as SSHPasswordCredentialDTO
  }
}

function buildKerberosConfig(data: SSHConfigFormData): KerberosConfigDTO {
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
      return {
        principal: data.principal,
        realm: data.realm,
        tgtGenerationMethod: data.tgtGenerationMethod,
        spec: {
          password: data.password?.referenceString
        } as TGTPasswordSpecDTO
      } as KerberosConfigDTO
    default:
      return {
        principal: data.principal,
        realm: data.realm
      }
  }
}

export function buildAuthConfig(data: SSHConfigFormData): SSHConfigDTO | KerberosConfigDTO {
  let credentials
  switch (data.authScheme) {
    case 'SSH':
      credentials = buildSSHCredentials(data)
      return {
        credentialType: data.credentialType,
        spec: credentials
      } as SSHConfigDTO
    case 'Kerberos':
      return buildKerberosConfig(data)
  }
}
