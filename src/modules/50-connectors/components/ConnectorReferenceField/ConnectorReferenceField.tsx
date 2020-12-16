import React from 'react'
import { FormGroup, IFormGroupProps } from '@blueprintjs/core'
import { Layout, Icon, Color, Button, Tag, Text } from '@wings-software/uikit'
import cx from 'classnames'
import {
  Failure,
  ConnectorInfoDTO,
  getConnectorListPromise,
  ConnectorConfigDTO,
  ConnectorResponse
} from 'services/cd-ng'
import { EntityReferenceResponse, getScopeFromValue } from '@common/components/EntityReference/EntityReference'
import { getIconByType } from '@connectors/exports'
import useCreateConnectorModal, {
  UseCreateConnectorModalReturn
} from '@connectors/modals/ConnectorModal/useCreateConnectorModal'
import { Scope } from '@common/interfaces/SecretsInterface'
import { String, useStrings } from 'framework/exports'
import { ReferenceSelect, ReferenceSelectProps } from '../../../10-common/components/ReferenceSelect/ReferenceSelect'
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
    live: boolean
    connector: ConnectorInfoDTO
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
export function getEditRenderer(
  selected: ConnectorReferenceFieldProps['selected'],
  openConnectorModal: UseCreateConnectorModalReturn['openConnectorModal'],
  type: ConnectorInfoDTO['type']
): JSX.Element {
  return (
    <Layout.Horizontal spacing="small" style={{ justifyContent: 'space-between', width: '100%' }}>
      <div>
        <Text font={{ size: 'small' }}>
          <String stringID="thisConnectorIsSavedAs" />
        </Text>
        <Text font={{ weight: 'bold' }}>{selected?.value}</Text>
      </div>
      <Button
        minimal
        icon="edit"
        onClick={e => {
          e.stopPropagation()
          openConnectorModal(true, type, selected?.connector)
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
      <div className={css.rightStatus}>
        <Icon
          className={cx(css.status, { [css.redStatus]: !selected?.live }, { [css.greenStatus]: selected?.live })}
          name="full-circle"
          size={6}
          style={{ paddingRight: 'var(--spacing-xsmall)' }}
        />
        <Tag minimal className={css.tag}>
          {getScopeFromValue(selected?.value || '')}
        </Tag>
      </div>
    </Layout.Horizontal>
  )
}

interface GetReferenceFieldMethodProps extends ConnectorReferenceFieldProps {
  getString(key: string, vars?: Record<string, any>): string
  openConnectorModal: UseCreateConnectorModalReturn['openConnectorModal']
  type: ConnectorInfoDTO['type']
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
  placeholder,
  getString,
  openConnectorModal
}: GetReferenceFieldMethodProps): Omit<ReferenceSelectProps<ConnectorReferenceDTO>, 'onChange'> {
  return {
    name,
    width,
    selected,
    placeholder,
    defaultScope,
    createNewLabel: getString('newConnector'),
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
    noRecordsText: getString('noSecretsFound'),
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
                openConnectorModal(true, type, item.record)
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

  const { getString } = useStrings()

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
          label,
          getString,
          openConnectorModal
        })}
        createNewHandler={() => {
          openConnectorModal(false, type, undefined)
        }}
        editRenderer={getEditRenderer(selected, openConnectorModal, type)}
        selectedRenderer={getSelectedRenderer(selected)}
      />
    </FormGroup>
  )
}
