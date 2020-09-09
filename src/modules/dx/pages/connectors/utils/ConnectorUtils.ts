import type { IconName } from '@blueprintjs/core'
import { Connectors, ConnectorInfoText } from 'modules/dx/constants'
import type { ConnectorSummaryDTO, ConnectorDTO } from 'services/cd-ng'
import type { FormData } from 'modules/dx/interfaces/ConnectorInterface'
import { AuthTypes, DelegateTypes } from '../Forms/KubeFormHelper'

export const getScope = (scope: string) => {
  switch (scope) {
    case 'PROJECT':
      return ''
    case 'ACCOUNT':
      return 'acc.'
    case 'ORG':
      return 'org.'
  }
}

export const userPasswrdAuthField = (formData: FormData) => {
  return {
    username: formData.username,
    passwordRef: `${getScope(formData.passwordRefSecret?.scope)}${formData.passwordRefSecret?.secretId}`
    // cacert: 'Random'
  }
}

// Todo: add scoping
export const userPasswrd = (authSpec: FormData) => {
  return {
    username: authSpec.username,
    passwordRef: {
      value: authSpec.passwordRef.split('.')[authSpec.passwordRef.split('.').length - 1],
      isReference: true
    }
  }
}

export const serviceAccAuthField = (formData: FormData) => {
  return {
    serviceAccountTokenRef: `${getScope(formData.serviceAccountTokenRefSecret?.scope)}${
      formData.serviceAccountTokenRefSecret?.secretId
    }`
  }
}

export const oidcAuthField = (formData: FormData) => {
  return {
    oidcIssuerUrl: formData.oidcIssuerUrl,
    oidcUsername: formData.oidcUsername,
    oidcPasswordRef: `${getScope(formData.oidcPasswordRefSecret?.scope)}${formData.oidcPasswordRefSecret?.secretId}`,
    oidcClientIdRef: `${getScope(formData.ooidcClientIdRefSecret?.scope)}${formData.oidcClientIdRefSecret?.secretId}`,
    oidcSecretRef: `${getScope(formData.oidcSecretRefSecret?.scope)}${formData.oidcSecretRefSecret?.secretId}`,
    oidcScopes: formData.oidcScopes
  }
}

export const clientKeyCertField = (formData: FormData) => {
  return {
    clientCertRef: `${getScope(formData.clientCertRefSecret?.scope)}${formData.clientCertRefSecret?.secretId}`,
    clientKeyRef: `${getScope(formData.clientKeyRefSecret?.scope)}${formData.clientKeyRefSecret?.secretId}`,
    clientKeyPassphraseRef: `${getScope(formData.clientKeyPassphraseRefSecret?.scope)}${
      formData.clientKeyPassphraseRefSecret?.secretId
    }`,
    clientKeyAlgo: formData.clientKeyAlgo
  }
}

const buildAuthTypePayload = (formData: FormData) => {
  const { authType = '' } = formData

  switch (authType) {
    case AuthTypes.USER_PASSWORD:
      return userPasswrdAuthField(formData)
    case AuthTypes.SERVICE_ACCOUNT:
      return serviceAccAuthField(formData)
    case AuthTypes.OIDC:
      return oidcAuthField(formData)
    case AuthTypes.CLIENT_KEY_CERT:
      return clientKeyCertField(formData)
    default:
      return []
  }
}

const buildAuthFormData = (type: string, authSpec: FormData) => {
  switch (type) {
    case AuthTypes.USER_PASSWORD:
      return userPasswrd(authSpec)
    // case AuthTypes.SERVICE_ACCOUNT:
    //   return serviceAcc(authSpec)
    // case AuthTypes.OIDC:
    //   return oidcAuth(authSpec)
    // case AuthTypes.CLIENT_KEY_CERT:
    //   return clientKey(authSpec)
    default:
      return []
  }
}

export const getSpecForDelegateType = (formData: FormData) => {
  const type = formData?.delegateType
  if (type === DelegateTypes.DELEGATE_IN_CLUSTER) {
    return {
      delegateName: formData?.delegateName
    }
  } else if (type === DelegateTypes.DELEGATE_OUT_CLUSTER) {
    return {
      masterUrl: formData?.masterUrl,
      auth: {
        type: formData?.authType,
        spec: buildAuthTypePayload(formData)
      }
    }
  }
}

export const buildKubPayload = (formData: FormData): ConnectorDTO => {
  const savedData = {
    name: formData?.name,
    description: formData?.description,
    // projectIdentifier: 'project-1',
    identifier: formData?.identifier,
    // accountIdentifier: 'Test-account',
    // orgIdentifier: 'Devops',
    tags: formData?.tags,
    type: Connectors.KUBERNETES_CLUSTER,
    spec: {
      type: formData?.delegateType,
      spec: getSpecForDelegateType(formData)
    }
  }
  return savedData
}

export const buildDockerPayload = (formData: FormData) => {
  const savedData = {
    name: formData.name,
    description: formData.description,
    projectIdentifier: formData.projectIdentifier,
    identifier: formData.identifier,
    orgIdentifier: formData.orgIdentifier,
    tags: formData.tags,
    type: Connectors.DOCKER,
    spec: {
      dockerRegistryUrl: formData.dockerRegistryUrl,
      authScheme: {
        type: 'UsernamePassword',
        spec: userPasswrdAuthField(formData)
      }
    }
  }
  return savedData
}

export const getSpecByConnectType = (type: string, formData: FormData) => {
  let referenceField
  if (type === 'Ssh') {
    referenceField = { sshKeyRef: formData?.sshKeyReference }
  } else {
    referenceField = {
      passwordRef: `${getScope(formData.passwordRefSecret?.scope)}${formData.passwordRefSecret?.secretId}`
    }
  }
  return {
    username: formData?.username,
    ...referenceField
  }
}

export const buildGITPayload = (formData: FormData) => {
  const savedData = {
    name: formData?.name,
    description: formData?.description,
    projectIdentifier: formData.projectIdentifier,
    identifier: formData?.identifier,
    orgIdentifier: formData.orgIdentifier,
    tags: formData?.tags,
    type: Connectors.GIT,
    spec: {
      connectionType: formData?.connectionType,
      branchName: formData.branchName,
      url: formData.url,
      type: formData?.connectType,
      spec: getSpecByConnectType(formData?.connectType, formData)
      // mocked data untill UX is not provided
      // gitSync: {
      //   enabled: true,
      //   customCommitAttributes: {
      //     authorName: 'deepak',
      //     authorEmail: 'deepak.patankar@harness.io',
      //     commitMessage: '[GITSYNC-0]: Pushing Changes'
      //   }
      // }
    }
  }
  return savedData
}

export const getDelegateTypeInfo = (delegateInfoSpec: any) => {
  const delegateType = delegateInfoSpec?.type
  let delegateTypeMetaData
  if (delegateType === DelegateTypes.DELEGATE_IN_CLUSTER) {
    delegateTypeMetaData = {
      delegateName: delegateInfoSpec?.spec?.delegateName
    }
  } else if (delegateType === DelegateTypes.DELEGATE_OUT_CLUSTER) {
    delegateTypeMetaData = {
      masterUrl: delegateInfoSpec?.spec?.masterUrl,
      authType: delegateInfoSpec?.spec?.auth.type,
      ...buildAuthFormData(delegateInfoSpec?.spec?.auth?.type, delegateInfoSpec?.spec?.auth?.spec)
    }
  }

  return delegateTypeMetaData
}

export const buildKubFormData = (connector: any) => {
  return {
    name: connector?.name,
    description: connector?.description,
    identifier: connector?.identifier,
    tags: connector?.tags,
    delegateType: connector?.spec?.type,
    ...getDelegateTypeInfo(connector?.spec)
  }
}

export const getIconByType = (type: ConnectorDTO['type'] | undefined): IconName => {
  switch (type) {
    case Connectors.KUBERNETES_CLUSTER:
      return 'service-kubernetes' as IconName
    case Connectors.GIT:
      return 'service-github' as IconName
    case 'Vault': // TODO: use enum when backend fixes it
      return 'key'
    case Connectors.APP_DYNAMICS:
      return 'service-appdynamics' as IconName
    case Connectors.SPLUNK:
      return 'service-splunk' as IconName
    case Connectors.DOCKER:
      return 'service-dockerhub' as IconName
    default:
      return '' as IconName
  }
}

export const getInfoTextByType = (type: string) => {
  switch (type) {
    case Connectors.KUBERNETES_CLUSTER:
      return ConnectorInfoText.KUBERNETES_CLUSTER
    default:
      return ''
  }
}

export const formatConnectorListData = (connectorList: ConnectorSummaryDTO[] | undefined) => {
  // Removed any once BE fixes types
  const formattedList = connectorList?.map((item: any) => {
    return {
      identifier: item.identifier,
      icon: getIconByType(item.type),
      infoText: getInfoTextByType(item.type),
      tags: item.tags?.toString(),
      belongsTo: item.accountName,
      name: item.name,
      lastActivityText: 'activity log',
      details: {
        url: item.connectorDetials?.masterURL,
        description: item.description
      },
      lastActivityTime: item.lastModifiedAt,
      status: 'ACTIVE',
      statusTime: item.createdAt,
      testConnectivity: true,
      threeDots: true
    }
  })
  return formattedList
}

export const getConnectorDisplayName = (type: string) => {
  switch (type) {
    case Connectors.KUBERNETES_CLUSTER:
      return 'Kubernetes cluster'
    case Connectors.GIT:
      return 'Git'
    case Connectors.DOCKER:
      return 'Docker'
    case Connectors.APP_DYNAMICS:
      return 'AppDynamics server'
    case Connectors.SPLUNK:
      return 'Splunk server'
    default:
      return ''
  }
}
