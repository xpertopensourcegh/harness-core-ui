import React from 'react'
import { FormGroup, IFormGroupProps } from '@blueprintjs/core'
import { Layout, Icon, Color, Button, Tag, Text } from '@wings-software/uikit'
import {
  Failure,
  ConnectorInfoDTO,
  getConnectorListPromise,
  ConnectorConfigDTO,
  ConnectorResponse
} from 'services/cd-ng'
import { EntityReferenceResponse, getScopeFromValue } from 'modules/common/components/EntityReference/EntityReference'
import { getIconByType } from 'modules/dx/exports'
import useCreateConnectorModal from 'modules/dx/modals/ConnectorModal/useCreateConnectorModal'
import { Scope } from 'modules/common/interfaces/SecretsInterface'
import i18n from './ConnectorReferenceField.i18n'
import { ReferenceSelect, ReferenceSelectProps } from '../ReferenceSelect/ReferenceSelect'
import css from './ConnectorReferenceField.module.scss'

export interface ConnectorReferenceFieldProps extends Omit<IFormGroupProps, 'label'> {
  accountIdentifier: string
  name: string
  placeholder: string
  label: string
  projectIdentifier?: string
  selected?: {
    label: string
    value: string
    scope: Scope
  }
  onChange?: (connector: ConnectorReferenceDTO, scope: Scope) => void
  orgIdentifier?: string
  defaultScope?: Scope
  width?: number
  type?: ConnectorInfoDTO['type']
}

interface ConnectorReferenceDTO extends ConnectorInfoDTO {
  status: ConnectorResponse['status']
}
export function getEditRenderer(selected: ConnectorReferenceFieldProps['selected']): JSX.Element {
  return (
    <Layout.Horizontal spacing="small" style={{ justifyContent: 'space-between', width: '100%' }}>
      <div>
        <Text font={{ size: 'small' }}>{i18n.thisConnectorIsSavedAs}</Text>
        <Text font={{ weight: 'bold' }}>{selected?.value}</Text>
      </div>
      <Button
        minimal
        icon="edit"
        onClick={e => {
          e.stopPropagation()
        }}
        style={{
          color: 'var(--blue-450)'
        }}
      />
    </Layout.Horizontal>
  )
}
export function getSelectedRenderer(selected: ConnectorReferenceFieldProps['selected']): JSX.Element {
  return (
    <Layout.Horizontal spacing="small" style={{ justifyContent: 'space-between', width: '100%' }}>
      <Text>{selected?.label}</Text>
      <Tag minimal className={css.tag}>
        {getScopeFromValue(selected?.value || '')}
      </Tag>
    </Layout.Horizontal>
  )
}
export function getReferenceFieldProps({
  defaultScope,
  accountIdentifier,
  projectIdentifier,
  orgIdentifier,
  type = 'K8sCluster',
  name,
  width,
  selected,
  placeholder
}: ConnectorReferenceFieldProps): Omit<ReferenceSelectProps<ConnectorReferenceDTO>, 'onChange'> {
  return {
    name,
    width,
    selected,
    placeholder,
    defaultScope,
    createNewLabel: i18n.newConnector,
    recordClassName: css.listItem,
    fetchRecords: (scope, search = '', done) => {
      getConnectorListPromise({
        queryParams: {
          accountIdentifier,
          type,
          searchTerm: search,
          projectIdentifier: scope === Scope.PROJECT ? projectIdentifier : undefined,
          orgIdentifier: scope === Scope.PROJECT || scope === Scope.ORG ? orgIdentifier : undefined
        }
      })
        .then(responseData => {
          if (responseData?.data?.content) {
            const connectors = responseData.data.content
            const response: EntityReferenceResponse<ConnectorReferenceDTO>[] = []
            connectors.forEach(connector => {
              response.push({
                name: connector.connector?.name || '',
                identifier: connector.connector?.identifier || '',
                record: connector.connector as ConnectorReferenceDTO
              })
            })
            done(response)
          } else {
            done([])
          }
        })
        .catch((err: Failure) => {
          throw err.message
        })
    },
    projectIdentifier,
    orgIdentifier,
    noRecordsText: i18n.noSecretsFound,
    recordRender: function renderItem(item) {
      return (
        <Layout.Horizontal spacing="small" style={{ justifyContent: 'space-between' }}>
          <Layout.Horizontal spacing="small">
            <Icon name={getIconByType(item.record.type)} size={30}></Icon>
            <div>
              <Text font={{ weight: 'bold' }}>{item.record.name}</Text>
              <Text font={{ size: 'small', weight: 'light' }} color={Color.GREY_450}>
                {item.identifier}
              </Text>
            </div>
          </Layout.Horizontal>
          <Layout.Horizontal spacing="small">
            <Button
              minimal
              icon="edit"
              className={css.editBtn}
              onClick={e => {
                e.stopPropagation()
              }}
              style={{
                color: 'var(--blue-450)'
              }}
            />
            <Icon
              className={css.status}
              name="full-circle"
              size={6}
              color={item.record.status?.status === 'SUCCESS' ? Color.GREEN_500 : Color.RED_500}
            />
          </Layout.Horizontal>
        </Layout.Horizontal>
      )
    }
  }
}

export const ConnectorReferenceField: React.FC<ConnectorReferenceFieldProps> = props => {
  const {
    defaultScope,
    accountIdentifier,
    projectIdentifier,
    orgIdentifier,
    type = 'K8sCluster',
    name,
    selected,
    label,
    width = 400,
    placeholder,
    ...rest
  } = props
  const { openConnectorModal } = useCreateConnectorModal({
    onSuccess: (data?: ConnectorConfigDTO) => {
      if (data) {
        props.onChange?.({ ...data.connector, status: data.status }, Scope.PROJECT)
      }
    }
  })

  return (
    <FormGroup {...rest} label={label}>
      <ReferenceSelect<ConnectorReferenceDTO>
        onChange={(connector, scope) => {
          props.onChange?.(connector, scope)
        }}
        {...getReferenceFieldProps({
          defaultScope,
          accountIdentifier,
          projectIdentifier,
          orgIdentifier,
          type,
          name,
          selected,
          width,
          placeholder,
          label
        })}
        createNewHandler={() => {
          openConnectorModal(type)
        }}
        editRenderer={getEditRenderer(selected)}
        selectedRenderer={getSelectedRenderer(selected)}
      />
    </FormGroup>
  )
}
