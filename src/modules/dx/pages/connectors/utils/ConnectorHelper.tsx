import { Connectors } from 'modules/dx/constants'
import { StringUtils } from 'modules/common/exports'
import { getKubValidationSchema, AuthTypeFields } from '../Forms/KubeFormHelper'
import i18n from './ConnectorHelper.i18n'

export const AuthTypes = {
  CLIENT_KEY_CERT: 'ClientKeyCert',
  USER_PASSWORD: 'UsernamePassword',
  SERVICE_ACCOUNT: 'ServiceAccount',
  OIDC: 'OpenIdConnect'
}

export const getValidationSchemaByType = (type: string) => {
  if (!type) return null
  switch (type) {
    case Connectors.KUBERNETES_CLUSTER:
      return getKubValidationSchema()

    default:
      return null
  }
}

export const getKubInitialValues = () => {
  return {
    type: 'KUBERNETES_CLUSTER',
    name: 'NAME',
    description: '',
    identifier: '',
    tags: [],
    delegateMode: '',
    credentialType: '',
    credential: {
      masterUrl: '',
      manualCredentialType: '',
      manualCredentials: {
        userName: '',
        encryptedPassword: ''
      }
    }
  }
}

export const getHeadingByType = (type: string) => {
  switch (type) {
    case Connectors.KUBERNETES_CLUSTER:
      return i18n.k8sClusterDetails
    case Connectors.GIT:
      return i18n.gitConnectorDetails
    case Connectors.SECRET_MANAGER:
      return i18n.secretManagerDetails
    default:
      return null
  }
}

export const getConnectorTextByType = (type: string) => {
  switch (type) {
    case Connectors.KUBERNETES_CLUSTER:
      return i18n.LABEL.k8sCluster
    case Connectors.GIT:
      return i18n.LABEL.gitConnector
    case Connectors.SECRET_MANAGER:
      return i18n.LABEL.secretManager
    default:
      return null
  }
}

export const getLabelForEncryptedSecret = (field: string) => {
  switch (field) {
    case AuthTypeFields.passwordRef:
      return 'Password'
    case AuthTypeFields.serviceAccountTokenRef:
      return 'Service Account Token'
    case AuthTypeFields.oidcPasswordRef:
      return 'Password'
    case AuthTypeFields.oidcClientIdRef:
      return 'Client ID'
    case AuthTypeFields.oidcSecretRef:
      return 'Client Secret'
    case AuthTypeFields.clientKeyRef:
      return 'Client Key'
    case AuthTypeFields.clientKeyPassphraseRef:
      return 'Client Key Passphrase'
    case AuthTypeFields.clientCertRef:
      return 'Client Certificate'
    default:
      return ''
  }
}

export const getSecretFieldValue = (field: string) => {
  switch (field) {
    case AuthTypeFields.passwordRef:
      return 'passwordRefSecret'
    case AuthTypeFields.serviceAccountTokenRef:
      return 'serviceAccountTokenRefSecret'
    case AuthTypeFields.oidcClientIdRef:
      return 'oidcClientIdRefSecret'
    case AuthTypeFields.oidcPasswordRef:
      return 'oidcPasswordRefSceret'
    case AuthTypeFields.oidcSecretRef:
      return 'oidcSecretRefSecret'
    case AuthTypeFields.clientKeyRef:
      return 'clientKeyRefSecret'
    case AuthTypeFields.clientKeyPassphraseRef:
      return 'clientKeyPassphraseRefSecret'
    case AuthTypeFields.clientCertRef:
      return 'clientCertRefSecret'
    default:
      return ''
  }
}

export const generateDefaultSecretConfig = (name: string, type: string) => {
  return StringUtils.getIdentifierFromName(name || '').concat(type)
}

export const getLabelForAuthType = (type: string) => {
  switch (type) {
    case AuthTypes.USER_PASSWORD:
      return 'Username and password'
    case AuthTypes.SERVICE_ACCOUNT:
      return 'Service Account Token'
    case AuthTypes.OIDC:
      return 'OIDC Token'
    case AuthTypes.CLIENT_KEY_CERT:
      return 'Client Key Certificate'
    default:
      return ''
  }
}
