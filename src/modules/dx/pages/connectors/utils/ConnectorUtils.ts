import { Connectors, ConnectorInfoText } from 'modules/dx/constants'
import type { ConnectorSummaryDTO } from 'services/cd-ng'
import type { FormData } from 'modules/dx/interfaces/ConnectorInterface'
import i18n from './ConnectorUtils.i18n'
import { AuthTypes, DelegateTypes } from '../Forms/KubeFormHelper'

export const userPasswrdAuthField = (formData: FormData) => {
  return {
    username: formData.username,
    passwordRef: formData.passwordRefSecret.secretId
    // cacert: 'Random'
  }
}

export const serviceAccAuthField = (formData: FormData) => {
  return {
    serviceAccountTokenRef: formData.serviceAccountTokenRef
  }
}

export const oidcAuthField = (formData: FormData) => {
  return {
    oidcIssuerUrl: formData.oidcIssuerUrl,
    oidcUsername: formData.oidcUsername,
    oidcPasswordRef: formData.oidcPasswordRef,
    oidcClientIdRef: formData.oidcClientIdRef,
    oidcSecretRef: formData.oidcSecretRef,
    oidcScopes: formData.oidcScopes
  }
}

export const clientKeyCertField = (formData: FormData) => {
  return {
    clientCertRef: formData.clientCertRef,
    clientKeyRef: formData.clientKeyRef,
    clientKeyPassphraseRef: formData.clientKeyPassphraseRef,
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
      delegateName: formData?.inheritConfigFromDelegate
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
    // projectIdentifier: 'project-1',
    identifier: formData?.identifier,
    // accountIdentifier: 'Test-account',
    // orgIdentifier: 'Devops',
    tags: formData?.tags,
    type: i18n.K8sCluster,
    spec: {
      type: formData?.delegateType,
      spec: getSpecForDelegateType(formData)
    }
  }
  return savedData
}

export const getSpecByConnectType = (type: string, formData: FormData) => {
  let referenceField
  if (type === 'Ssh') {
    referenceField = { sshKeyReference: formData?.sshKeyReference }
  } else {
    referenceField = { passwordReference: formData?.password }
  }
  return {
    type: formData?.connectionType,
    url: formData?.url,
    username: formData?.username,
    ...referenceField
  }
}

export const buildGITPayload = (formData: FormData) => {
  const savedData = {
    name: formData?.name,
    description: formData?.description,
    // projectIdentifier: 'project-1',
    identifier: formData?.identifier,
    // accountIdentifier: 'Test-account',
    // orgIdentifier: 'Devops',
    tags: formData?.tags,
    type: i18n.GitConnector,
    spec: {
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
