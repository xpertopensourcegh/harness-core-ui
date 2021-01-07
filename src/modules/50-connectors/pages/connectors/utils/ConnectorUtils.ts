import { pick } from 'lodash-es'
import type { IconName } from '@wings-software/uicore'
import { Connectors, EntityTypes } from '@connectors/constants'
import { ConnectorInfoDTO, getSecretV2Promise, GetSecretV2QueryParams } from 'services/cd-ng'
import type { FormData } from '@connectors/interfaces/ConnectorInterface'
import { Scope } from '@common/interfaces/SecretsInterface'
import { ValueType } from '@secrets/components/TextReference/TextReference'
import { AuthTypes, GitAuthTypes, GitAPIAuthTypes } from './ConnectorHelper'

export const getScopeFromString = (value: string) => {
  return value?.indexOf('.') < 0 ? Scope.PROJECT : value?.split('.')[0]
}

export const getSecretIdFromString = (value: string) => {
  return value?.indexOf('.') < 0 ? value : value?.split('.')[1]
}

export interface DelegateCardInterface {
  type: string
  info: string
}

export const GCP_AUTH_TYPE = {
  DELEGATE: 'delegate',
  ENCRYPTED_KEY: 'encryptedKey'
}

export const DelegateTypes = {
  DELEGATE_IN_CLUSTER: 'InheritFromDelegate',
  DELEGATE_OUT_CLUSTER: 'ManualConfig'
}

export const DelegateInClusterType = {
  useExistingDelegate: 'useExistingDelegate',
  addNewDelegate: 'addnewDelegate'
}

export const DockerProviderType = {
  DOCKERHUB: 'DockerHub',
  HARBOUR: 'Harbor',
  QUAY: 'Quay',
  OTHER: 'Other'
}

export const GitUrlType = {
  ACCOUNT: 'Account',
  REPO: 'Repo'
}

export const GitConnectionType = {
  HTTPS: 'Http',
  SSH: 'Ssh'
}

export interface SecretReferenceInterface {
  identifier: string
  name: string
  referenceString: string
}

const buildAuthTypePayload = (formData: FormData) => {
  const { authType = '' } = formData

  switch (authType) {
    case AuthTypes.USER_PASSWORD:
      return {
        username: formData.username.type === ValueType.TEXT ? formData.username.value : undefined,
        usernameRef: formData.username.type === ValueType.ENCRYPTED ? formData.username.value : undefined,
        passwordRef: formData.password.referenceString
      }
    case AuthTypes.SERVICE_ACCOUNT:
      return {
        serviceAccountTokenRef: formData.serviceAccountToken.referenceString
      }
    case AuthTypes.OIDC:
      return {
        oidcIssuerUrl: formData.oidcIssuerUrl,
        oidcUsername: formData.oidcUsername.type === ValueType.TEXT ? formData.oidcUsername.value : undefined,
        oidcUsernameRef: formData.oidcUsername.type === ValueType.ENCRYPTED ? formData.oidcUsername.value : undefined,
        oidcPasswordRef: formData.oidcPassword.referenceString,
        oidcClientIdRef: formData.oidcCleintId.referenceString,
        oidcSecretRef: formData.oidcCleintSecret.referenceString,
        oidcScopes: formData.oidcScopes
      }

    case AuthTypes.CLIENT_KEY_CERT:
      return {
        clientKeyRef: formData.clientKey.referenceString,
        clientCertRef: formData.clientKeyCertificate.referenceString,
        clientKeyPassphraseRef: formData.clientKeyPassphrase.referenceString,
        caCertRef: formData.clientKeyCACertificate?.referenceString, // optional
        clientKeyAlgo: formData.clientKeyAlgo
      }
    default:
      return {}
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
      credential: {
        type: formData?.delegateType,
        spec: getSpecForDelegateType(formData)
      }
    }
  }
  return { connector: savedData }
}

const getGitAuthSpec = (formData: FormData) => {
  const { authType = '' } = formData
  switch (authType) {
    case GitAuthTypes.USER_PASSWORD:
      return {
        username: formData.username,
        passwordRef: formData.password.referenceString
      }
    case GitAuthTypes.USER_TOKEN:
      return {
        username: formData.username,
        tokenRef: formData.accessToken.referenceString
      }
    case GitAuthTypes.KERBEROS:
      return {
        kerberosKeyRef: formData.kerberosKey.referenceString
      }
    default:
      return {}
  }
}

export const buildGithubPayload = (formData: FormData) => {
  const savedData = {
    name: formData.name,
    description: formData?.description,
    projectIdentifier: formData?.projectIdentifier,
    orgIdentifier: formData?.orgIdentifier,
    identifier: formData.identifier,
    tags: formData?.tags,
    type: Connectors.GITHUB,
    spec: {
      type: formData.urlType,
      url: formData.url,
      authentication: {
        type: formData.connectionType,
        spec:
          formData.connectionType === GitConnectionType.SSH
            ? { spec: { sshKeyRef: formData.sshKey.referenceString } }
            : {
                type: formData.authType,
                spec: getGitAuthSpec(formData)
              }
      },
      apiAccess: { type: formData.apiAuthType, spec: {} }
    }
  }

  if (formData.enableAPIAccess) {
    savedData.spec.apiAccess.spec =
      formData.apiAuthType === GitAPIAuthTypes.TOKEN
        ? {
            tokenRef: formData.accessToken.referenceString
          }
        : {
            installationId: formData.installationId,
            applicationId: formData.applicationId,
            privateKeyRef: formData.privateKey.referenceString
          }
  } else {
    delete savedData.spec.apiAccess
  }
  return { connector: savedData }
}

export const buildGitlabPayload = (formData: FormData) => {
  const savedData = {
    name: formData.name,
    description: formData?.description,
    projectIdentifier: formData?.projectIdentifier,
    orgIdentifier: formData?.orgIdentifier,
    identifier: formData.identifier,
    tags: formData?.tags,
    type: Connectors.GITLAB,
    spec: {
      type: formData.urlType,
      url: formData.url,
      authentication: {
        type: formData.connectionType,
        spec:
          formData.connectionType === GitConnectionType.SSH
            ? { spec: { sshKeyRef: formData.sshKey.referenceString } }
            : {
                type: formData.authType,
                spec: getGitAuthSpec(formData)
              }
      },
      apiAccess: { type: formData.apiAuthType, spec: {} }
    }
  }

  if (formData.enableAPIAccess) {
    savedData.spec.apiAccess.spec =
      formData.apiAuthType === GitAPIAuthTypes.TOKEN
        ? {
            tokenRef: formData.accessToken.referenceString
          }
        : {
            installationId: formData.installationId,
            applicationId: formData.applicationId,
            privateKeyRef: formData.privateKey.referenceString
          }
  } else {
    delete savedData.spec.apiAccess
  }
  return { connector: savedData }
}

export const buildBitbucketPayload = (formData: FormData) => {
  const savedData = {
    name: formData.name,
    description: formData?.description,
    projectIdentifier: formData?.projectIdentifier,
    orgIdentifier: formData?.orgIdentifier,
    identifier: formData.identifier,
    tags: formData?.tags,
    type: Connectors.BITBUCKET,
    spec: {
      type: formData.urlType,
      url: formData.url,
      authentication: {
        type: formData.connectionType,
        spec:
          formData.connectionType === GitConnectionType.SSH
            ? { spec: { sshKeyRef: formData.sshKey.referenceString } }
            : {
                type: formData.authType,
                spec: getGitAuthSpec(formData)
              }
      },
      apiAccess: { type: formData.apiAuthType, spec: {} }
    }
  }

  if (formData.enableAPIAccess) {
    savedData.spec.apiAccess.spec = {
      username: formData.username,
      tokenRef: formData.accessToken.referenceString
    }
  } else {
    delete savedData.spec.apiAccess
  }
  return { connector: savedData }
}

export const setSecretField = async (
  secretString: string,
  scopeQueryParams: GetSecretV2QueryParams
): Promise<SecretReferenceInterface | void> => {
  if (!secretString) {
    return undefined
  } else {
    const secretScope = getScopeFromString(secretString)

    switch (secretScope) {
      case Scope.ACCOUNT:
        delete scopeQueryParams.orgIdentifier
        delete scopeQueryParams.projectIdentifier
        break
      case Scope.ORG:
        delete scopeQueryParams.projectIdentifier
    }

    const response = await getSecretV2Promise({
      identifier: secretString.indexOf('.') < 0 ? secretString : secretString.split('.')[1],
      queryParams: scopeQueryParams
    })

    return {
      identifier: secretString.split('.')[1],
      name: response.data?.secret.name || secretString.split('.')[1],
      referenceString: secretString
    }
  }
}

export const setupGitFormData = async (connectorInfo: ConnectorInfoDTO, accountId: string): Promise<FormData> => {
  const scopeQueryParams: GetSecretV2QueryParams = {
    accountIdentifier: accountId,
    projectIdentifier: connectorInfo.projectIdentifier,
    orgIdentifier: connectorInfo.orgIdentifier
  }

  const authData = connectorInfo?.spec?.authentication
  const formData = {
    sshKey: await setSecretField(authData?.spec?.spec?.sshKeyRef, scopeQueryParams),
    authType: authData?.spec?.type,
    username: authData?.spec?.spec?.username,
    password: await setSecretField(authData?.spec?.spec?.passwordRef, scopeQueryParams),
    accessToken: await setSecretField(
      authData?.spec?.spec?.tokenRef || connectorInfo?.spec?.apiAccess?.spec?.tokenRef,
      scopeQueryParams
    ),
    kerberosKey: await setSecretField(authData?.spec?.spec?.kerberosKeyRef, scopeQueryParams),
    enableAPIAccess: !!connectorInfo?.spec?.apiAccess,
    apiAuthType: connectorInfo?.spec?.apiAccess?.type,
    installationId: connectorInfo?.spec?.apiAccess?.spec?.installationId,
    applicationId: connectorInfo?.spec?.apiAccess?.spec?.applicationId,
    privateKey: await setSecretField(connectorInfo?.spec?.apiAccess?.spec?.privateKeyRef, scopeQueryParams)
  }

  return formData
}

export const setupBitbucketFormData = async (connectorInfo: ConnectorInfoDTO, accountId: string): Promise<FormData> => {
  const scopeQueryParams: GetSecretV2QueryParams = {
    accountIdentifier: accountId,
    projectIdentifier: connectorInfo.projectIdentifier,
    orgIdentifier: connectorInfo.orgIdentifier
  }

  const authData = connectorInfo?.spec?.authentication
  const formData = {
    sshKey: await setSecretField(authData?.spec?.spec?.sshKeyRef, scopeQueryParams),
    authType: authData?.spec?.type,
    username: authData?.spec?.spec?.username,
    password: await setSecretField(authData?.spec?.spec?.passwordRef, scopeQueryParams),
    enableAPIAccess: !!connectorInfo?.spec?.apiAccess,
    apiAuthType: connectorInfo?.spec?.apiAccess?.type,
    accessToken: await setSecretField(connectorInfo?.spec?.apiAccess?.spec?.tokenRef, scopeQueryParams)
  }

  return formData
}

export const getK8AuthFormFields = async (connectorInfo: ConnectorInfoDTO, accountId: string): Promise<FormData> => {
  const scopeQueryParams: GetSecretV2QueryParams = {
    accountIdentifier: accountId,
    projectIdentifier: connectorInfo.projectIdentifier,
    orgIdentifier: connectorInfo.orgIdentifier
  }
  const authdata = connectorInfo.spec.credential?.spec?.auth?.spec
  return {
    username:
      authdata.username || authdata.usernameRef
        ? {
            value: authdata.username || authdata.usernameRef,
            type: authdata.usernameRef ? ValueType.ENCRYPTED : ValueType.TEXT
          }
        : undefined,
    password: await setSecretField(authdata.passwordRef, scopeQueryParams),
    serviceAccountToken: await setSecretField(authdata.serviceAccountTokenRef, scopeQueryParams),
    oidcIssuerUrl: authdata.oidcIssuerUrl,
    oidcUsername:
      authdata.oidcUsername || authdata.oidcUsernameRef
        ? {
            value: authdata.oidcUsername || authdata.oidcUsernameRef,
            type: authdata.oidcUsernameRef ? ValueType.ENCRYPTED : ValueType.TEXT
          }
        : undefined,
    oidcPassword: await setSecretField(authdata.oidcPasswordRef, scopeQueryParams),
    oidcCleintId: await setSecretField(authdata.oidcClientIdRef, scopeQueryParams),
    oidcCleintSecret: await setSecretField(authdata.oidcSecretRef, scopeQueryParams),
    oidcScopes: authdata.oidcScopes,
    clientKey: await setSecretField(authdata.clientKeyRef, scopeQueryParams),
    clientKeyCertificate: await setSecretField(authdata.clientCertRef, scopeQueryParams),
    clientKeyPassphrase: await setSecretField(authdata.clientKeyPassphraseRef, scopeQueryParams),
    clientKeyCACertificate: await setSecretField(authdata.caCertRef, scopeQueryParams),
    clientKeyAlgo: authdata.clientKeyAlgo
  }
}

export const setupKubFormData = async (connectorInfo: ConnectorInfoDTO, accountId: string): Promise<FormData> => {
  const authData = await getK8AuthFormFields(connectorInfo, accountId)

  const formData = {
    delegateType: connectorInfo.spec.credential.type,
    delegateName: connectorInfo.spec.credential?.spec?.delegateName || '',
    masterUrl: connectorInfo.spec.credential?.spec?.masterUrl || '',
    authType: connectorInfo.spec.credential?.spec?.auth?.type || '',
    skipDefaultValidation: true,
    ...authData
  }

  return formData
}

export const setupGCPFormData = async (connectorInfo: ConnectorInfoDTO, accountId: string): Promise<FormData> => {
  const scopeQueryParams: GetSecretV2QueryParams = {
    accountIdentifier: accountId,
    projectIdentifier: connectorInfo.projectIdentifier,
    orgIdentifier: connectorInfo.orgIdentifier
  }

  const formData = {
    delegateType: connectorInfo.spec.credential.type,
    delegateName: connectorInfo.spec.credential?.spec?.delegateName || '',
    password: await setSecretField(connectorInfo.spec.credential?.spec?.secretKeyRef, scopeQueryParams)
  }

  return formData
}

export const setupDockerFormData = async (connectorInfo: ConnectorInfoDTO, accountId: string): Promise<FormData> => {
  const scopeQueryParams: GetSecretV2QueryParams = {
    accountIdentifier: accountId,
    projectIdentifier: connectorInfo.projectIdentifier,
    orgIdentifier: connectorInfo.orgIdentifier
  }

  const formData = {
    dockerRegistryUrl: connectorInfo.spec.dockerRegistryUrl,
    authType: connectorInfo.spec.auth.type,
    dockerProviderType: connectorInfo.spec.providerType,
    username:
      connectorInfo.spec.auth.type === AuthTypes.USER_PASSWORD ? connectorInfo.spec.auth.spec.username : undefined,
    password:
      connectorInfo.spec.auth.type === AuthTypes.USER_PASSWORD
        ? await setSecretField(connectorInfo.spec.auth.spec.passwordRef, scopeQueryParams)
        : undefined
  }
  return formData
}

export const buildAWSPayload = (formData: FormData) => {
  const savedData = {
    name: formData.name,
    description: formData.description,
    projectIdentifier: formData.projectIdentifier,
    identifier: formData.identifier,
    orgIdentifier: formData.orgIdentifier,
    tags: formData.tags,
    type: Connectors.AWS,
    spec: {
      credential: {
        type: formData.credential,
        spec:
          formData.credential === DelegateTypes.DELEGATE_IN_CLUSTER
            ? {
                delegateSelector: formData.delegateSelector
              }
            : {
                accessKey: formData.accessKey,
                secretKeyRef: formData.secretKeyRef.referenceString
              },
        crossAccountAccess: formData.crossAccountAccess
          ? {
              crossAccountRoleArn: formData.crossAccountRoleArn,
              externalId: formData.externalId
            }
          : null
      }
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
      providerType: formData.dockerProviderType,
      auth:
        formData.authType === AuthTypes.USER_PASSWORD
          ? {
              type: formData.authType,
              spec: {
                username: formData.username,
                passwordRef: formData.password.referenceString
              }
            }
          : {
              type: formData.authType
            }
    }
  }
  return { connector: savedData }
}

export const buildGcpPayload = (formData: FormData) => {
  const savedData = {
    name: formData.name,
    description: formData.description,
    projectIdentifier: formData.projectIdentifier,
    identifier: formData.identifier,
    orgIdentifier: formData.orgIdentifier,
    tags: formData.tags,
    type: Connectors.GCP,
    spec: {
      credential: {
        type: formData?.delegateType,
        spec:
          formData?.delegateType === DelegateTypes.DELEGATE_IN_CLUSTER
            ? {
                delegateSelector: formData.delegateName
              }
            : {
                secretKeyRef: formData.password.referenceString
              }
      }
    }
  }

  return { connector: savedData }
}

export const getSpecByConnectType = (type: string, formData: FormData) => {
  let referenceField
  if (type === 'Ssh') {
    referenceField = { sshKeyRef: formData?.sshKeyRef }
  } else {
    referenceField = {
      passwordRef: formData.password.referenceString
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

export const buildGITFormData = (connector: ConnectorInfoDTO) => {
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

export const buildKubFormData = (connector: ConnectorInfoDTO) => {
  return {
    name: connector?.name,
    description: connector?.description,
    identifier: connector?.identifier,
    tags: connector?.tags,
    delegateType: connector?.spec?.credential?.type,
    delegateName: connector?.spec?.credential?.spec?.delegateName,
    masterUrl: connector?.spec?.credential?.spec?.masterUrl,
    authType: connector?.spec?.credential?.spec?.auth?.type,
    ...connector?.spec?.credential?.spec?.auth?.spec
  }
}

export const buildNexusPayload = (formData: FormData) => {
  const savedData = {
    type: Connectors.NEXUS,
    ...pick(formData, ['name', 'identifier', 'description', 'tags']),
    spec: {
      nexusServerUrl: formData?.nexusServerUrl,
      version: formData?.nexusVersion,
      auth:
        formData.userName && formData.password
          ? {
              type: 'UsernamePassword',
              spec: {
                username: formData.userName,
                passwordRef: formData.password.referenceString
              }
            }
          : null
    }
  }

  return { connector: savedData }
}

export const buildArtifactoryPayload = (formData: FormData) => {
  const savedData = {
    type: Connectors.ARTIFACTORY,
    ...pick(formData, ['name', 'identifier', 'description', 'tags']),
    spec: {
      artifactoryServerUrl: formData?.artifactoryServerUrl,
      auth:
        formData.userName && formData.password
          ? {
              type: 'UsernamePassword',
              spec: {
                username: formData.userName,
                passwordRef: formData.password.referenceString
              }
            }
          : null
    }
  }

  return { connector: savedData }
}

export const getIconByType = (type: ConnectorInfoDTO['type'] | undefined): IconName => {
  switch (type) {
    case Connectors.KUBERNETES_CLUSTER:
      return 'service-kubernetes'
    case Connectors.GIT:
      return 'service-github'
    case Connectors.GITHUB:
      return 'github'
    case Connectors.GITLAB:
      return 'service-gotlab'
    case Connectors.BITBUCKET:
      return 'bitbucket'
    case 'Vault': // TODO: use enum when backend fixes it
    case 'Local': // TODO: use enum when backend fixes it
      return 'secret-manager'
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
      return 'cog'
  }
}

export const getConnectorDisplayName = (type: string) => {
  switch (type) {
    case Connectors.KUBERNETES_CLUSTER:
      return 'Kubernetes cluster'
    case Connectors.GIT:
      return 'Git'
    case Connectors.GITHUB:
      return 'GitHub'
    case Connectors.GITLAB:
      return 'GitLab'
    case Connectors.BITBUCKET:
      return 'Bitbucket'
    case Connectors.DOCKER:
      return 'Docker'
    case Connectors.GCP:
      return 'GCP'
    case Connectors.APP_DYNAMICS:
      return 'AppDynamics server'
    case Connectors.SPLUNK:
      return 'Splunk server'
    case Connectors.AWS:
      return 'AWS'
    case Connectors.NEXUS:
      return 'Nexus'
    case Connectors.LOCAL:
      return 'Local Secret Manager'
    case Connectors.VAULT:
      return 'HashiCorp Vault'
    case Connectors.GCP_KMS:
      return 'GCP KMS'
    case Connectors.SECRET_MANAGER:
      return 'Custom Secret Manager'
    case Connectors.AZUREVAULT:
      return 'Azure Vault'
    case Connectors.AWSSM:
      return 'AWS Secret Manager'
    default:
      return ''
  }
}

export const getIconByEntityType = (type: string) => {
  switch (type) {
    case EntityTypes.PROJECT:
      return 'nav-project'
    case EntityTypes.PIPELINE:
      return 'pipeline'
    case EntityTypes.SECRET:
      return 'key-main'

    default:
      return ''
  }
}

export const getReferredEntityLabelByType = (type: string) => {
  switch (type) {
    case EntityTypes.PROJECT:
      return 'Project'
    case EntityTypes.PIPELINE:
      return 'Pipeline'
    case EntityTypes.SECRET:
      return 'Secret'

    default:
      return ''
  }
}
