import React from 'react'
import { Layout, Tag, Text, Color, Container, Icon, IconName } from '@wings-software/uicore'
import moment from 'moment'
import { Connectors } from '@connectors/constants'
import type { ConnectorInfoDTO, VaultConnectorDTO } from 'services/cd-ng'
import { StringUtils } from 'modules/10-common/exports'
import { DelegateTypes } from '@connectors/pages/connectors/utils/ConnectorUtils'
import type { TagsInterface } from '@common/interfaces/ConnectorsInterface'
import { getLabelForAuthType } from '../../utils/ConnectorHelper'
import i18n from './SavedConnectorDetails.i18n'
import css from './SavedConnectorDetails.module.scss'

interface SavedConnectorDetailsProps {
  connector: ConnectorInfoDTO
}

interface ActivityDetailsRowInterface {
  label: string
  value: string | TagsInterface | number | null | undefined
  iconData?: {
    text: string
    icon: IconName
    color?: string
  }
}

interface RenderDetailsSectionProps {
  title: string
  data: Array<ActivityDetailsRowInterface>
}

interface ActivityDetailsData {
  createdAt: number
  lastTested: number
  lastUpdated: number
  lastConnectionSuccess?: number
  status: string | null
}

const getLabelByType = (type: string): string => {
  switch (type) {
    case Connectors.KUBERNETES_CLUSTER:
      return i18n.NAME_LABEL.Kubernetes
    case Connectors.GIT:
      return i18n.NAME_LABEL.GIT
    case Connectors.GITHUB:
      return i18n.NAME_LABEL.Github
    case Connectors.GITLAB:
      return i18n.NAME_LABEL.Gitlab
    case Connectors.BITBUCKET:
      return i18n.NAME_LABEL.Bitbucket
    case Connectors.DOCKER:
      return i18n.NAME_LABEL.Docker
    case Connectors.GCP:
      return i18n.NAME_LABEL.GCP
    case Connectors.AWS:
      return i18n.NAME_LABEL.AWS
    case Connectors.NEXUS:
      return i18n.NAME_LABEL.Nexus
    case Connectors.ARTIFACTORY:
      return i18n.NAME_LABEL.Artifactory
    case Connectors.APP_DYNAMICS:
      return i18n.NAME_LABEL.AppDynamics
    case Connectors.SPLUNK:
      return i18n.NAME_LABEL.Splunk
    case Connectors.VAULT:
    case Connectors.GCP_KMS:
    case Connectors.LOCAL:
      return i18n.NAME_LABEL.SecretManager
    default:
      return ''
  }
}
const getKubernetesSchema = (connector: ConnectorInfoDTO): Array<ActivityDetailsRowInterface> => {
  return [
    {
      label: i18n.k8sCluster.connectionMode,
      value:
        connector?.spec?.credential?.type === DelegateTypes.DELEGATE_IN_CLUSTER
          ? i18n.k8sCluster.delegateInCluster
          : i18n.k8sCluster.delegateOutCluster
    },
    {
      label: i18n.k8sCluster.delegateName,
      value: connector.spec?.credential?.spec?.delegateName
    },
    {
      label: i18n.k8sCluster.masterUrl,
      value: connector?.spec?.credential?.spec?.masterUrl
    },
    {
      label: i18n.k8sCluster.credType,
      value: getLabelForAuthType(connector?.spec?.credential?.spec?.auth?.type)
    },
    {
      label: i18n.k8sCluster.identityProviderUrl,
      value: connector?.spec?.credential?.spec?.auth?.spec?.oidcIssuerUrl
    },
    {
      label: i18n.k8sCluster.username,
      value:
        connector?.spec?.credential?.spec?.auth?.spec?.username ||
        connector?.spec?.credential?.spec?.auth?.spec?.usernameRef ||
        connector?.spec?.credential?.spec?.auth?.spec?.oidcUsername
    },
    {
      label: i18n.k8sCluster.password,
      value:
        connector?.spec?.credential?.spec?.auth?.spec?.passwordRef ||
        connector?.spec?.credential?.spec?.auth?.spec?.oidcPasswordRef
    },
    {
      label: i18n.k8sCluster.serviceAccountToken,
      value: connector?.spec?.credential?.spec?.auth?.spec?.serviceAccountTokenRef
    },
    {
      label: i18n.k8sCluster.oidcClientId,
      value: connector?.spec?.credential?.spec?.auth?.spec?.oidcClientIdRef
    },
    {
      label: i18n.k8sCluster.clientSecret,
      value: connector?.spec?.credential?.spec?.auth?.spec?.oidcSecretRef
    },
    {
      label: i18n.k8sCluster.oidcScopes,
      value: connector?.spec?.credential?.spec?.auth?.spec?.oidcScopes
    },

    {
      label: i18n.k8sCluster.clientKey,
      value: connector?.spec?.credential?.spec?.auth?.spec?.clientKeyRef
    },
    {
      label: i18n.k8sCluster.clientCert,
      value: connector?.spec?.credential?.spec?.auth?.spec?.clientCertRef
    },
    {
      label: i18n.k8sCluster.clientKeyPassphrase,
      value: connector?.spec?.credential?.spec?.auth?.spec?.clientKeyPassphraseRef
    },
    {
      label: i18n.k8sCluster.clientAlgo,
      value: connector?.spec?.credential?.spec?.auth?.spec?.clientKeyAlgo
    }
  ]
}

const getGitSchema = (connector: ConnectorInfoDTO): Array<ActivityDetailsRowInterface> => {
  return [
    {
      label: i18n.GIT.configure,
      value: connector?.spec?.connectionType
    },
    {
      label: i18n.GIT.connection,
      value: connector.spec?.type === 'Http' ? i18n.GIT.HTTP : i18n.GIT.SSH
    },
    {
      label: i18n.GIT.url,
      value: connector?.spec?.url
    },

    {
      label: i18n.GIT.username,
      value: connector?.spec?.spec?.username || connector?.spec?.spec?.usernameRef
    },
    {
      label: i18n.GIT.password,
      value: connector?.spec?.spec?.passwordRef
    },
    {
      label: i18n.GIT.sshKey,
      value: connector?.spec?.spec?.sshKeyRef
    }
  ]
}

const getGithubSchema = (connector: ConnectorInfoDTO): Array<ActivityDetailsRowInterface> => {
  return [
    {
      label: i18n.Github.configure,
      value: connector?.spec?.type
    },
    {
      label: i18n.Github.connection,
      value: connector?.spec?.authentication?.type?.toUpperCase?.()
    },
    {
      label: i18n.Github.url,
      value: connector?.spec?.url
    },
    {
      label: i18n.Github.authType,
      value: connector?.spec?.authentication?.spec?.type
    },
    {
      label: i18n.Github.username,
      value:
        connector?.spec?.authentication?.spec?.spec?.username ||
        connector?.spec?.authentication?.spec?.spec?.usernameRef
    },
    {
      label: i18n.Github.password,
      value: connector?.spec?.authentication?.spec?.spec?.passwordRef
    },
    {
      label: i18n.Github.accessToken,
      value: connector?.spec?.authentication?.spec?.spec?.tokenRef || connector?.spec?.apiAccess?.spec?.tokenRef
    },
    {
      label: i18n.Github.sshKey,
      value: connector?.spec?.authentication?.spec?.spec?.sshKeyRef
    },

    {
      label: i18n.Github.apiAccessAuthType,
      value: connector?.spec?.apiAccess?.type
    },
    {
      label: i18n.Github.installationId,
      value: connector?.spec?.apiAccess?.spec?.installationId
    },
    {
      label: i18n.Github.applicationId,
      value: connector?.spec?.apiAccess?.spec?.applicationId
    }
  ]
}

const getDockerSchema = (connector: ConnectorInfoDTO): Array<ActivityDetailsRowInterface> => {
  return [
    {
      label: i18n.Docker.providerType,
      value: connector?.spec?.providerType
    },
    {
      label: i18n.Docker.dockerRegistryURL,
      value: connector?.spec?.dockerRegistryUrl
    },
    {
      label: i18n.k8sCluster.credType,
      value: getLabelForAuthType(connector?.spec?.auth?.type)
    },
    {
      label: i18n.Docker.username,
      value: connector?.spec?.auth?.spec?.username || connector?.spec?.auth?.spec?.usernameRef
    },
    {
      label: i18n.Docker.password,
      value: connector?.spec?.auth?.spec?.passwordRef
    }
  ]
}

const getVaultSchema = (connector: ConnectorInfoDTO): Array<ActivityDetailsRowInterface> => {
  const data = connector.spec as VaultConnectorDTO
  return [
    {
      label: i18n.Vault.vaultUrl,
      value: data.vaultUrl
    },
    {
      label: i18n.Vault.engineName,
      value: data.secretEngineName
    },
    {
      label: i18n.Vault.engineVersion,
      value: data.secretEngineVersion
    },
    {
      label: i18n.Vault.renewal,
      value: data.renewalIntervalMinutes
    },
    {
      label: i18n.Vault.readOnly,
      value: data.readOnly ? i18n.Vault.yes : i18n.Vault.no
    },
    {
      label: i18n.Vault.default,
      value: data.default ? i18n.Vault.yes : i18n.Vault.no
    }
  ]
}

const getGCPSchema = (connector: ConnectorInfoDTO): Array<ActivityDetailsRowInterface> => {
  return [
    {
      label: i18n.credType,
      value: connector?.spec?.credential?.type
    },
    {
      label: i18n.delegateName,
      value: connector.spec?.credential?.spec?.delegateName || connector.spec?.credential?.spec?.delegateSelector
    },
    {
      label: i18n.password,
      value: connector?.spec?.credential?.spec?.secretKeyRef
    }
  ]
}

const getAWSSchema = (connector: ConnectorInfoDTO): Array<ActivityDetailsRowInterface> => {
  return [
    {
      label: i18n.credType,
      value: connector?.spec?.credential?.type
    },
    {
      label: i18n.delegateName,
      value: connector.spec?.credential?.spec?.delegateName || connector.spec?.credential?.spec?.delegateSelector
    },
    {
      label: i18n.password,
      value: connector?.spec?.credential?.spec?.secretKeyRef
    },
    {
      label: i18n.AWS.accessKey,
      value: connector?.spec?.credential?.spec?.accessKey || connector?.spec?.credential?.spec?.accessKeyRef
    },
    {
      label: i18n.AWS.STSEnabled,
      value: connector?.spec?.credential?.crossAccountAccess?.crossAccountRoleArn ? 'true' : 'false'
    },
    {
      label: i18n.AWS.roleARN,
      value: connector?.spec?.credential?.crossAccountAccess?.crossAccountRoleArn
    },
    {
      label: i18n.AWS.externalId,
      value: connector?.spec?.credential?.crossAccountAccess?.externalId
    }
  ]
}

const getNexusSchema = (connector: ConnectorInfoDTO): Array<ActivityDetailsRowInterface> => {
  return [
    {
      label: i18n.Nexus.serverUrl,
      value: connector.spec?.nexusServerUrl
    },
    {
      label: i18n.Nexus.version,
      value: connector.spec?.version
    },
    {
      label: i18n.credType,
      value: getLabelForAuthType(connector.spec?.auth?.type)
    },
    {
      label: i18n.username,
      value: connector?.spec?.auth?.spec?.username || connector?.spec?.auth?.spec?.usernameRef
    },
    {
      label: i18n.password,
      value: connector?.spec?.auth?.spec?.passwordRef
    }
  ]
}

const getArtifactorySchema = (connector: ConnectorInfoDTO): Array<ActivityDetailsRowInterface> => {
  return [
    {
      label: i18n.Artifactory.serverUrl,
      value: connector.spec?.artifactoryServerUrl
    },
    {
      label: i18n.Artifactory.version,
      value: connector.spec?.version
    },
    {
      label: i18n.credType,
      value: getLabelForAuthType(connector.spec?.auth?.type)
    },
    {
      label: i18n.username,
      value: connector?.spec?.auth?.spec?.username || connector?.spec?.auth?.spec?.usernameRef
    },
    {
      label: i18n.password,
      value: connector?.spec?.auth?.spec?.passwordRef
    }
  ]
}

const getSchemaByType = (connector: ConnectorInfoDTO, type: string): Array<ActivityDetailsRowInterface> => {
  switch (type) {
    case Connectors.KUBERNETES_CLUSTER:
      return getKubernetesSchema(connector)
    case Connectors.GIT:
      return getGitSchema(connector)
    case Connectors.GITHUB:
    case Connectors.GITLAB:
    case Connectors.BITBUCKET:
      return getGithubSchema(connector) // GitHub schema will work for GitLab, Bitbucket too
    case Connectors.DOCKER:
      return getDockerSchema(connector)
    case Connectors.GCP:
      return getGCPSchema(connector)
    case Connectors.AWS:
      return getAWSSchema(connector)
    case Connectors.NEXUS:
      return getNexusSchema(connector)
    case Connectors.ARTIFACTORY:
      return getArtifactorySchema(connector)
    case Connectors.VAULT:
    case Connectors.GCP_KMS:
    case Connectors.LOCAL:
      return getVaultSchema(connector)
    default:
      return []
  }
}

const getSchema = (props: SavedConnectorDetailsProps): Array<ActivityDetailsRowInterface> => {
  const { connector } = props
  return [
    {
      label: getLabelByType(connector?.type),
      value: connector?.name
    },
    {
      label: i18n.description,
      value: connector?.description
    },
    {
      label: i18n.identifier,
      value: connector?.identifier
    },
    {
      label: i18n.tags,
      value: connector?.tags
    }
  ]
}

const renderTags = (value: TagsInterface) => {
  const tagKeys = Object.keys(value)
  return (
    <Layout.Horizontal spacing="small">
      {tagKeys.map((tag, index) => {
        return (
          <Tag minimal={true} key={tag + index}>
            {tag}
          </Tag>
        )
      })}
    </Layout.Horizontal>
  )
}

const getDate = (value?: number): string | null => {
  return value ? moment.unix(value / 1000).format(StringUtils.DEFAULT_DATE_FORMAT) : null
}

export const getActivityDetails = (data: ActivityDetailsData): Array<ActivityDetailsRowInterface> => {
  const activityDetails: Array<ActivityDetailsRowInterface> = [
    {
      label: i18n.created,
      value: getDate(data?.createdAt)
    },
    {
      label: i18n.lastUpdated,
      value: getDate(data?.lastUpdated)
    }
  ]

  if (data.status === 'FAILURE') {
    activityDetails.push({
      label: i18n.lastTested,
      value: getDate(data?.lastTested),
      iconData: {
        icon: 'warning-sign',
        text: i18n.failed,
        color: Color.RED_500
      }
    })
  } else {
    activityDetails.push({
      label: i18n.lastTested,
      value: getDate(data?.lastConnectionSuccess),
      iconData: {
        icon: 'deployment-success-new',
        text: i18n.success,
        color: Color.GREEN_500
      }
    })
    activityDetails.push({
      label: i18n.lastConnectionSuccess,
      value: getDate(data?.lastConnectionSuccess)
    })
  }

  return activityDetails
}

export const RenderDetailsSection: React.FC<RenderDetailsSectionProps> = props => {
  return (
    <Container className={css.detailsSection}>
      <Text font={{ weight: 'bold', size: 'medium' }} color={Color.GREY_700} padding={{ bottom: '10px' }}>
        {props.title}
      </Text>
      {props.data.map((item, index) => {
        if (item.value && (item.label === i18n.tags ? Object.keys(item.value as TagsInterface).length : true)) {
          return (
            <Layout.Vertical
              className={css.detailsSectionRowWrapper}
              spacing="xsmall"
              padding={{ top: 'medium', bottom: 'medium' }}
              key={`${item.value}${index}`}
            >
              <Text font={{ size: 'small' }}>{item.label}</Text>
              {item.label === i18n.tags && typeof item.value === 'object' ? (
                renderTags(item.value)
              ) : (
                <Layout.Horizontal spacing="small" className={css.detailsSectionRow}>
                  <Text
                    inline
                    className={css.detailsValue}
                    color={item.value === 'encrypted' ? Color.GREY_350 : Color.BLACK}
                  >
                    {item.value}
                  </Text>
                  {item.iconData?.icon ? (
                    <Layout.Horizontal spacing="small">
                      <Icon
                        inline={true}
                        name={item.iconData.icon}
                        size={14}
                        color={item.iconData.color}
                        title={item.iconData.text}
                      />
                      <Text inline>{item.iconData.text}</Text>
                    </Layout.Horizontal>
                  ) : null}
                </Layout.Horizontal>
              )}
            </Layout.Vertical>
          )
        }
      })}
    </Container>
  )
}

const SavedConnectorDetails: React.FC<SavedConnectorDetailsProps> = props => {
  const connectorDetailsSchema = getSchema(props)
  const credenatislsDetailsSchema = getSchemaByType(props.connector, props.connector?.type)

  return (
    <Layout.Horizontal className={css.detailsSectionContainer}>
      <RenderDetailsSection title={i18n.overview} data={connectorDetailsSchema} />
      <RenderDetailsSection title={i18n.credentials} data={credenatislsDetailsSchema} />
    </Layout.Horizontal>
  )
}
export default SavedConnectorDetails
