import i18n from './ConnectorUtils.i18n'
import { AuthTypes, DelegateTypes } from '../Forms/KubeFormHelper'
import { Connectors, ConnectorInfoText } from 'modules/dx/constants'

export const userPasswrdAuthField = (formData: any) => {
  return {
    username: formData.username,
    password: formData.password,
    cacert: 'Random'
  }
}

export const serviceAccAuthField = (formData: any) => {
  return {
    serviceAccountToken: formData.serviceAccountToken
  }
}

export const oidcAuthField = (formData: any) => {
  return {
    oidcIdentityProviderUrl: formData.oidcIdentityProviderUrl,
    oidcUsername: formData.oidcUsername,
    oidcPassword: formData.oidcPassword,
    oidcClientId: formData.oidcClientId,
    oidcSecret: formData.oidcSecret,
    oidcScopes: formData.oidcScopes
  }
}

export const customAuthField = (formData: any) => {
  return {
    username: formData.username,
    password: formData.password,
    cacert: 'Random',
    clientCert: formData.clientCert,
    clientKey: formData.clientKey,
    clientKeyPassPhrase: formData.clientKeyPassPhrase,
    clientKeyAlgorithm: formData.clientKeyAlgorithm,
    serviceAccountToken: formData.serviceAccountToken
  }
}

const buildAuthTypePayload = (formData: any) => {
  const { authType } = formData

  switch (authType) {
    case AuthTypes.USER_PASSWORD:
      return userPasswrdAuthField(formData)
    case AuthTypes.SERVICE_ACCOUNT:
      return serviceAccAuthField(formData)
    case AuthTypes.OIDC:
      return oidcAuthField(formData)
    case AuthTypes.CUSTOM:
      return customAuthField(formData)
    default:
      return []
  }
}

export const getSpecForDelegateType = (formData: any) => {
  const type = formData.delegateType
  if (type === DelegateTypes.DELEGATE_IN_CLUSTER) {
    return {
      delegateName: formData.inheritConfigFromDelegate
    }
  } else if (type === DelegateTypes.DELEGATE_OUT_CLUSTER) {
    return {
      masterUrl: formData.masterUrl,
      auth: {
        type: formData.authType,
        type1: formData.authType,
        spec: buildAuthTypePayload(formData)
      }
    }
  }
}

export const buildKubPayload = (formData: any) => {
  const savedData = {
    name: formData.name,
    description: formData.description,
    // projectIdentifier: 'project-1',
    identifier: formData.identifier,
    // accountIdentifier: 'Test-account',
    // orgIdentifier: 'Devops',
    tags: formData.tags,
    type: i18n.K8sCluster,
    type1: i18n.K8sCluster,
    spec: {
      type: formData.delegateType,
      type1: formData.delegateType,
      spec: getSpecForDelegateType(formData)
    }
  }
  return savedData
}

export const getDelegateTypeInfo = (delegateInfoSpec: any) => {
  const delegateType = delegateInfoSpec?.type
  let delegateTypeMetaData
  if (delegateType === DelegateTypes.DELEGATE_IN_CLUSTER) {
    delegateTypeMetaData = {
      inheritConfigFromDelegate: delegateInfoSpec?.spec?.inheritConfigFromDelegate
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

export const getIconByType = (type: string) => {
  switch (type) {
    case Connectors.KUBERNETES_CLUSTER:
      return 'service-kubernetes'
    default:
      return ''
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

export const fomatConnectListData = (connectorList: any) => {
  const formattedList = connectorList.map((item: any) => {
    return {
      identifier: item.identifier,
      icon: getIconByType(item.type),
      infoText: getInfoTextByType(item.type),
      tags: item.tags.toString(),
      belongsTo: item.accountName,
      name: item.name,
      lastActivityText: 'activity log',
      details: {
        url: item.masterUrl,
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
