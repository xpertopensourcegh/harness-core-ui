import { pick } from 'lodash-es'
import type { IconName } from '@wings-software/uikit'
import { Connectors, ConnectorInfoText } from 'modules/dx/constants'
import type { ConnectorSummaryDTO, ConnectorDTO } from 'services/cd-ng'
import type { FormData } from 'modules/dx/interfaces/ConnectorInterface'
import { Scope } from 'modules/common/interfaces/SecretsInterface'
import { AuthTypes, DelegateTypes } from '../Forms/KubeFormInterfaces'

export const getScopeFromString = (value: string) => {
  return value?.indexOf('.') < 0 ? Scope.PROJECT : value?.split('.')[0]
}

export const getSecretIdFromString = (value: string) => {
  return value?.indexOf('.') < 0 ? value : value?.split('.')[1]
}

export const getScopedSecretString = (scope: string, identifier: string) => {
  switch (scope) {
    case Scope.PROJECT:
      return identifier
    case Scope.ACCOUNT:
      return `acc.${identifier}`
    case Scope.ORG:
      return `org.${identifier}`
  }
}

export const userPasswrdAuthField = (formData: FormData) => {
  return {
    username: formData.username,
    passwordRef: getScopedSecretString(formData.passwordRefSecret?.scope, formData.passwordRefSecret?.secretId)
  }
}

export const serviceAccAuthField = (formData: FormData) => {
  return {
    serviceAccountTokenRef: getScopedSecretString(
      formData.serviceAccountTokenRefSecret?.scope,
      formData.serviceAccountTokenRefSecret?.secretId
    )
  }
}

export const oidcAuthField = (formData: FormData) => {
  return {
    oidcIssuerUrl: formData.oidcIssuerUrl,
    oidcUsername: formData.oidcUsername,
    oidcPasswordRef: getScopedSecretString(
      formData.oidcPasswordRefSecret?.scope,
      formData.oidcPasswordRefSecret?.secretId
    ),
    oidcClientIdRef: getScopedSecretString(
      formData.oidcClientIdRefSecret?.scope,
      formData.oidcClientIdRefSecret?.secretId
    ),
    oidcSecretRef: getScopedSecretString(formData.oidcSecretRefSecret?.scope, formData.oidcSecretRefSecret?.secretId),
    oidcScopes: formData.oidcScopes
  }
}

export const clientKeyCertField = (formData: FormData) => {
  return {
    clientCertRef: getScopedSecretString(formData.clientCertRefSecret?.scope, formData.clientCertRefSecret?.secretId),
    clientKeyRef: getScopedSecretString(formData.clientKeyRefSecret?.scope, formData.clientKeyRefSecret?.secretId),
    clientKeyPassphraseRef: getScopedSecretString(
      formData.clientKeyPassphraseRefSecret?.scope,
      formData.clientKeyPassphraseRefSecret?.secretId
    ),
    caCertRef: getScopedSecretString(formData.caCertRefSecret?.scope, formData.caCertRefSecret?.secretId),
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

export const buildKubPayload = (formData: FormData) => {
  const savedData = {
    name: formData?.name,
    description: formData?.description,
    projectIdentifier: formData?.projectIdentifier,
    orgIdentifier: formData?.orgIdentifier,
    identifier: formData?.identifier,
    tags: formData?.tags,
    type: Connectors.KUBERNETES_CLUSTER,
    spec: {
      type: formData?.delegateType,
      spec: getSpecForDelegateType(formData)
    }
  }
  return { connector: savedData }
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
      auth:
        !formData.username && !formData.passwordRef
          ? null
          : {
              type: 'UsernamePassword',
              spec: userPasswrdAuthField(formData)
            }
    }
  }
  return { connector: savedData }
}

export const buildDockerFormData = (connector: ConnectorDTO) => {
  return {
    ...pick(connector, ['name', 'identifier', 'description', 'tags']),
    dockerRegistryUrl: connector?.spec?.dockerRegistryUrl,
    ...pick(connector?.spec?.auth?.spec, ['username', 'passwordRef'])
  }
}

export const getSpecByConnectType = (type: string, formData: FormData) => {
  let referenceField
  if (type === 'Ssh') {
    referenceField = { sshKeyRef: formData?.sshKeyRef }
  } else {
    referenceField = {
      passwordRef: getScopedSecretString(formData.passwordRefSecret?.scope, formData.passwordRefSecret?.secretId)
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
  return { connector: savedData }
}

export const buildGITFormData = (connector: ConnectorDTO) => {
  return {
    name: connector?.name,
    description: connector?.description,
    identifier: connector?.identifier,
    tags: connector?.tags,
    connectionType: connector?.spec?.connectionType,
    branchName: connector?.spec?.branchName,
    url: connector?.spec?.url,
    connectType: connector?.spec?.type,
    ...connector?.spec?.spec
  }
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
      ...delegateInfoSpec?.spec?.auth?.spec
    }
  }

  return delegateTypeMetaData
}

export const buildKubFormData = (connector: ConnectorDTO) => {
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
      return 'service-kubernetes'
    case Connectors.GIT:
      return 'service-github'
    case 'Vault': // TODO: use enum when backend fixes it
    case 'Local': // TODO: use enum when backend fixes it
      return 'secret-manager'
    case Connectors.APP_DYNAMICS:
      return 'service-appdynamics'
    case Connectors.SPLUNK:
      return 'service-splunk'
    case Connectors.DOCKER:
      return 'service-dockerhub'
    default:
      return 'cog'
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
