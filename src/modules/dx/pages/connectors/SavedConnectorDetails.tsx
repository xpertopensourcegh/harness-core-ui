import React from 'react'
import { Layout, Tag } from '@wings-software/uikit'
import { Connectors } from 'modules/dx/constants'
import type { ConnectorConfigDTO } from 'services/cd-ng'
import { DelegateTypes } from './Forms/KubeFormInterfaces'
import i18n from './SavedConnectorDetails.i18n'
import css from './SavedConnectorDetails.module.scss'

interface SavedConnectorDetailsProps {
  connector: ConnectorConfigDTO
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
    case Connectors.SECRET_MANAGER:
      return i18n.NAME_LABEL.SecretManager
    default:
      return ''
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
    },
    {
      label: i18n.connectionMode,
      value:
        connector?.delegateType === DelegateTypes.DELEGATE_IN_CLUSTER ? i18n.delegateInCluster : i18n.delegateOutCluster
    },
    {
      label: i18n.delegateName,
      value: connector?.delegateName
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

const SavedConnectorDetails = (props: SavedConnectorDetailsProps) => {
  const connectorDetailsSchema = getSchema(props)

  return (
    <>
      {connectorDetailsSchema.map((item, index) => {
        if (item.value && (item.label === i18n.tags ? item.value?.length : true)) {
          return (
            <Layout.Vertical spacing="small" className={css.details} key={`${item.value}${index}`}>
              <span className={css.label}>{item.label}</span>
              {item.label === i18n.tags && typeof item.value === 'object' ? (
                renderTags(item.value)
              ) : (
                <span className={css.value}>{item.value}</span>
              )}
            </Layout.Vertical>
          )
        }
      })}
    </>
  )
}
export default SavedConnectorDetails
