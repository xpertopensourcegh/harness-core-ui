import type { IconName } from '@wings-software/uikit'
import { Connectors } from '@connectors/constants'
import { StringUtils } from '@common/exports'
import i18n from './ConnectorHelper.i18n'

export const AuthTypes = {
  CLIENT_KEY_CERT: 'ClientKeyCert',
  USER_PASSWORD: 'UsernamePassword',
  SERVICE_ACCOUNT: 'ServiceAccount',
  OIDC: 'OpenIdConnect'
}

export const getKubInitialValues = () => {
  return {
    type: 'KUBERNETES_CLUSTER',
    name: 'NAME',
    description: '',
    identifier: '',
    tags: {},
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
    case Connectors.VAULT:
    case Connectors.GCP_KMS:
    case Connectors.LOCAL:
      return i18n.secretManagerDetails
    case Connectors.APP_DYNAMICS:
      return i18n.appDynamicsDetails
    case Connectors.SPLUNK:
      return i18n.splunkConnectorDetails
    case Connectors.DOCKER:
      return i18n.dockerConnectorDetails
    case Connectors.AWS:
      return i18n.awsConnectorDetails
    case Connectors.NEXUS:
      return i18n.nexusConnectorDetails
    case Connectors.ARTIFACTORY:
      return i18n.artifactoryConnectorDetails
    case Connectors.GCP:
      return i18n.gcpConnectorDetails
    default:
      return null
  }
}

export const getConnectorTitleTextByType = (type: string): string => {
  switch (type) {
    case Connectors.KUBERNETES_CLUSTER:
      return i18n.LABEL.k8sCluster
    case Connectors.GIT:
      return i18n.LABEL.gitConnector
    case Connectors.VAULT:
    case Connectors.GCP_KMS:
    case Connectors.LOCAL:
      return i18n.LABEL.secretManager
    case Connectors.APP_DYNAMICS:
      return i18n.LABEL.appdynamics
    case Connectors.SPLUNK:
      return i18n.LABEL.splunk
    case Connectors.DOCKER:
      return i18n.LABEL.docker
    case Connectors.AWS:
      return i18n.LABEL.aws
    case Connectors.NEXUS:
      return i18n.LABEL.nexus
    case Connectors.ARTIFACTORY:
      return i18n.LABEL.artifactory
    case Connectors.GCP:
      return i18n.LABEL.gcpConnector
    default:
      return ''
  }
}

export const getConnectorIconByType = (type: string): IconName => {
  switch (type) {
    case Connectors.KUBERNETES_CLUSTER:
      return 'app-kubernetes'
    case Connectors.GIT:
      return 'service-github'
    case Connectors.VAULT:
    case Connectors.GCP_KMS:
    case Connectors.LOCAL:
      return 'lock'
    case Connectors.APP_DYNAMICS:
      return 'service-appdynamics'
    case Connectors.SPLUNK:
      return 'service-splunk'
    case Connectors.DOCKER:
      return 'service-dockerhub'
    case Connectors.AWS:
      return 'service-aws'
    case Connectors.NEXUS:
      return 'service-nexus'
    case Connectors.ARTIFACTORY:
      return 'service-artifactory'
    case Connectors.GCP:
      return 'service-gcp'
    default:
      return 'placeholder'
  }
}

export const generateDefaultSecretConfig = (name: string, type: string) => {
  return StringUtils.getIdentifierFromName(name || '').concat(type)
}

export const getLabelForAuthType = (type: string) => {
  switch (type) {
    case AuthTypes.USER_PASSWORD:
      return 'Username and Password'
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
