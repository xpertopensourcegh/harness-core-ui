import React from 'react'
import { FormGroup, IFormGroupProps, Intent } from '@blueprintjs/core'
import { FormikContext, connect } from 'formik'
import type { ExpressionAndRuntimeTypeProps } from '@wings-software/uikit'
import { get, isObject } from 'lodash'
import { FailureDTO, ConnectorSummaryDTO, getConnectorListPromise } from 'services/cd-ng'
import { ReferenceResponse, Scope } from 'modules/common/components/ReferenceSelector/ReferenceSelector'
import i18n from './ConnectorReferenceField.i18n'
import { ReferenceSelect, MultiTypeReferenceInput, ReferenceSelectProps } from '../ReferenceSelect/ReferenceSelect'
import css from './ConnectorReferenceField.module.scss'

interface ConnectorReferenceFieldProps extends Omit<IFormGroupProps, 'label'> {
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
  onChange?: (connector: ConnectorSummaryDTO, scope: Scope) => void
  orgIdentifier?: string
  defaultScope?: Scope
  width?: number
  type?: ConnectorSummaryDTO['type']
}

function getReferenceFieldProps({
  defaultScope,
  accountIdentifier,
  projectIdentifier,
  orgIdentifier,
  type,
  name,
  width,
  selected,
  placeholder
}: ConnectorReferenceFieldProps): Omit<ReferenceSelectProps<ConnectorSummaryDTO>, 'onChange'> {
  return {
    name,
    width,
    selected,
    placeholder,
    defaultScope,
    recordClassName: css.listItem,
    fetchRecords: (scope, search = '', done) => {
      getConnectorListPromise({
        accountIdentifier,
        queryParams: {
          type,
          searchTerm: search,
          projectIdentifier: scope === Scope.PROJECT ? projectIdentifier : undefined,
          orgIdentifier: scope === Scope.PROJECT || scope === Scope.ORG ? orgIdentifier : undefined
        }
      })
        .then(responseData => {
          if (responseData?.data?.content) {
            const connectors = responseData.data.content
            const response: ReferenceResponse<ConnectorSummaryDTO>[] = []
            connectors.forEach(connector => {
              response.push({
                label: connector.name || '',
                identifier: connector.identifier || '',
                record: connector
              })
            })
            done(response)
          } else {
            done([])
          }
        })
        .catch((err: FailureDTO) => {
          throw err.message
        })
    },
    projectIdentifier,
    orgIdentifier,
    noRecordsText: i18n.noSecretsFound,
    recordRender: function renderItem(item) {
      return (
        <>
          <div>{item.record.name}</div>
          <div className={css.meta}>
            {item.identifier} . {item.record.type}
          </div>
        </>
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

  return (
    <FormGroup {...rest} label={label}>
      <ReferenceSelect<ConnectorSummaryDTO>
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
      />
    </FormGroup>
  )
}

export interface MultiTypeConnectorFieldProps extends Omit<ConnectorReferenceFieldProps, 'onChange'> {
  onChange?: ExpressionAndRuntimeTypeProps['onChange']
  formik?: any // TODO: Remove this but not sure why FormikContext<any> was not working
}

const errorCheck = (name: string, formik?: FormikContext<any>): boolean | '' | 0 | undefined =>
  (get(formik?.touched, name) || (formik?.submitCount && formik?.submitCount > 0)) &&
  get(formik?.errors, name) &&
  !isObject(get(formik?.errors, name))

export const MultiTypeConnectorField: React.FC<MultiTypeConnectorFieldProps> = props => {
  const {
    defaultScope,
    accountIdentifier,
    projectIdentifier,
    orgIdentifier,
    type = 'K8sCluster',
    name,
    label,
    onChange,
    width = 400,
    formik,
    placeholder,
    ...restProps
  } = props
  const hasError = errorCheck(name, formik)
  const {
    intent = hasError ? Intent.DANGER : Intent.NONE,
    helperText = hasError ? get(formik?.errors, name) : null,
    disabled,
    ...rest
  } = restProps

  const selected = get(formik?.values, name, '')

  return (
    <FormGroup {...rest} labelFor={name} helperText={helperText} intent={intent} disabled={disabled} label={label}>
      <MultiTypeReferenceInput<ConnectorSummaryDTO>
        referenceSelectProps={getReferenceFieldProps({
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
        onChange={(val, valueType) => {
          formik?.setFieldValue(name, val)
          onChange?.(val, valueType)
        }}
        convertRecordAndScopeToString={(record, scope): string => `${scope}.${record.identifier}`}
      />
    </FormGroup>
  )
}

export const FormMultiTypeConnectorField = connect(MultiTypeConnectorField)
