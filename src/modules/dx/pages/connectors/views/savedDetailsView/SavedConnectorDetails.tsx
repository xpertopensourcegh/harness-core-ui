import React from 'react'
import { Layout, Tag, Text, Color } from '@wings-software/uikit'
import { Connectors } from 'modules/dx/constants'
import type { ConnectorInfoDTO, VaultConnectorDTO } from 'services/cd-ng'
import { DelegateTypes } from '../../Forms/KubeFormInterfaces'
import { getLabelForAuthType } from '../../utils/ConnectorHelper'
import i18n from './SavedConnectorDetails.i18n'

interface SavedConnectorDetailsProps {
  connector: ConnectorInfoDTO
}
const getLabelByType = (type: string) => {
  switch (type) {
    case Connectors.KUBERNETES_CLUSTER:
      return i18n.NAME_LABEL.Kubernetes
    case Connectors.GIT:
      return i18n.NAME_LABEL.GIT
    case Connectors.DOCKER:
      return i18n.NAME_LABEL.Docker
    case Connectors.APP_DYNAMICS:
      return i18n.NAME_LABEL.AppDynamics
    case Connectors.SPLUNK:
      return i18n.NAME_LABEL.Splunk
    case Connectors.VAULT:
      return i18n.NAME_LABEL.SecretManager
    default:
      return ''
  }
}
const getKubernetesSchema = (connector: ConnectorInfoDTO) => {
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
        connector?.spec?.credential?.spec?.auth?.spec?.oidcUsername
    },
    {
      label: i18n.k8sCluster.password,
      value:
        connector?.spec?.credential?.spec?.auth?.spec?.passwordRef ||
        connector?.spec?.credential?.spec?.auth?.spec?.oidcPasswordRef
          ? i18n.k8sCluster.encrypted
          : null
    },
    {
      label: i18n.k8sCluster.serviceAccountToken,
      value: connector?.spec?.credential?.spec?.auth?.spec?.serviceAccountTokenRef ? i18n.k8sCluster.encrypted : null
    },
    {
      label: i18n.k8sCluster.oidcClientId,
      value: connector?.spec?.credential?.spec?.auth?.spec?.oidcClientIdRef ? i18n.k8sCluster.encrypted : null
    },
    {
      label: i18n.k8sCluster.clientSecret,
      value: connector?.spec?.credential?.spec?.auth?.spec?.oidcSecretRef ? i18n.k8sCluster.encrypted : null
    },
    {
      label: i18n.k8sCluster.oidcScopes,
      value: connector?.spec?.credential?.spec?.auth?.spec?.oidcScopes
    },

    {
      label: i18n.k8sCluster.clientKey,
      value: connector?.spec?.credential?.spec?.auth?.spec?.clientKeyRef ? i18n.k8sCluster.encrypted : null
    },
    {
      label: i18n.k8sCluster.clientCert,
      value: connector?.spec?.credential?.spec?.auth?.spec?.clientCertRef ? i18n.k8sCluster.encrypted : null
    },
    {
      label: i18n.k8sCluster.clientKeyPassphrase,
      value: connector?.spec?.credential?.spec?.auth?.spec?.clientKeyPassphraseRef ? i18n.k8sCluster.encrypted : null
    },
    {
      label: i18n.k8sCluster.clientAlgo,
      value: connector?.spec?.credential?.spec?.auth?.spec?.clientKeyAlgo
    }
  ]
}

const getGITSchema = (connector: ConnectorInfoDTO) => {
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
      value: connector?.spec?.spec?.username
    },
    {
      label: i18n.GIT.password,
      value: connector?.spec?.spec?.passwordRef ? i18n.k8sCluster.encrypted : null
    },
    {
      label: i18n.GIT.sshKey,
      value: connector?.spec?.spec?.sshKeyRef ? i18n.k8sCluster.encrypted : null
    }
  ]
}

const getDockerSchema = (connector: ConnectorInfoDTO) => {
  return [
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
      value: connector?.spec?.auth?.spec?.username
    },
    {
      label: i18n.Docker.password,
      value: connector?.spec?.auth?.spec?.passwordRef ? i18n.k8sCluster.encrypted : null
    }
  ]
}

const getVaultSchema = (connector: ConnectorInfoDTO) => {
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
      value: data.renewIntervalHours
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

const getSchemaByType = (connector: ConnectorInfoDTO, type: string) => {
  switch (type) {
    case Connectors.KUBERNETES_CLUSTER:
      return getKubernetesSchema(connector)
    case Connectors.GIT:
      return getGITSchema(connector)
    case Connectors.DOCKER:
      return getDockerSchema(connector)
    case Connectors.VAULT:
      return getVaultSchema(connector)
    default:
      return []
  }
}

const getSchema = (props: SavedConnectorDetailsProps) => {
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

const renderTags = (value: string[]) => {
  return (
    <Layout.Horizontal spacing="small">
      {value.map((tag, index) => {
        return (
          <Tag minimal={true} key={tag + index}>
            {tag}
          </Tag>
        )
      })}
    </Layout.Horizontal>
  )
}

const SavedConnectorDetails: React.FC<SavedConnectorDetailsProps> = props => {
  const connectorDetailsSchema = getSchema(props).concat(getSchemaByType(props.connector, props.connector?.type) || [])

  return (
    <>
      {connectorDetailsSchema.map((item, index) => {
        if (item.value && (item.label === i18n.tags ? item.value?.length : true)) {
          return (
            <Layout.Vertical spacing="xsmall" margin={{ bottom: 'large' }} key={`${item.value}${index}`}>
              <Text font={{ size: 'small' }}>{item.label}</Text>
              {item.label === i18n.tags && typeof item.value === 'object' ? (
                renderTags(item.value)
              ) : (
                <Text color={item.value === 'encrypted' ? Color.GREY_350 : Color.BLACK}>{item.value}</Text>
              )}
            </Layout.Vertical>
          )
        }
      })}
    </>
  )
}
export default SavedConnectorDetails
