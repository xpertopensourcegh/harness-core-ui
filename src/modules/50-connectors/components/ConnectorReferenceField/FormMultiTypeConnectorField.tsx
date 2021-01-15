import React from 'react'
import {
  ExpressionAndRuntimeTypeProps,
  getMultiTypeFromValue,
  MultiTypeInputValue,
  MultiTypeInputType
} from '@wings-software/uicore'
import { connect, FormikContext } from 'formik'
import { FormGroup, Intent } from '@blueprintjs/core'
import { get } from 'lodash-es'
import useCreateConnectorModal from '@connectors/modals/ConnectorModal/useCreateConnectorModal'
import type { ConnectorConfigDTO, ConnectorInfoDTO, ConnectorResponse } from 'services/cd-ng'
import { ConfigureOptions, ConfigureOptionsProps } from '@common/components/ConfigureOptions/ConfigureOptions'
import { Scope } from '@common/interfaces/SecretsInterface'
import { useStrings } from 'framework/exports'
import { errorCheck } from '@common/utils/formikHelpers'
import { getScopeFromDTO } from '@common/components/EntityReference/EntityReference'
import { MultiTypeReferenceInput, ReferenceSelectProps } from '@common/components/ReferenceSelect/ReferenceSelect'
import {
  ConnectorReferenceFieldProps,
  getReferenceFieldProps,
  getEditRenderer,
  getSelectedRenderer
} from './ConnectorReferenceField'

export interface MultiTypeConnectorFieldConfigureOptionsProps
  extends Omit<ConfigureOptionsProps, 'value' | 'type' | 'variableName'> {
  variableName?: ConfigureOptionsProps['variableName']
}
export interface MultiTypeConnectorFieldProps extends Omit<ConnectorReferenceFieldProps, 'onChange'> {
  onChange?: ExpressionAndRuntimeTypeProps['onChange']
  formik?: FormikContext<any>
  isNewConnectorLabelVisible?: boolean
  configureOptionsProps?: MultiTypeConnectorFieldConfigureOptionsProps
  enableConfigureOptions?: boolean
  style?: React.CSSProperties
}
export interface ConnectorReferenceDTO extends ConnectorInfoDTO {
  status: ConnectorResponse['status']
}

export const MultiTypeConnectorField = (props: MultiTypeConnectorFieldProps): React.ReactElement => {
  const {
    defaultScope,
    accountIdentifier,
    projectIdentifier,
    orgIdentifier,
    type = 'K8sCluster',
    category,
    name,
    label,
    onChange,
    width = 400,
    formik,
    placeholder,
    isNewConnectorLabelVisible = true,
    configureOptionsProps,
    enableConfigureOptions = true,
    style,
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
  const { getString } = useStrings()
  const { openConnectorModal } = useCreateConnectorModal({
    onSuccess: (data?: ConnectorConfigDTO) => {
      if (data) {
        const scope = getScopeFromDTO<ConnectorConfigDTO>(data)
        const val = {
          label: data.name,
          value: scope === Scope.ORG || scope === Scope.ACCOUNT ? `${scope}.${data.identifier}` : data.identifier
        }
        props.onChange?.(val, MultiTypeInputValue.SELECT_OPTION, MultiTypeInputType.FIXED)
        formik?.setFieldValue(name, val)
      }
    }
  })

  const optionalReferenceSelectProps: Pick<
    ReferenceSelectProps<ConnectorConfigDTO>,
    'createNewHandler' | 'editRenderer'
  > = {}

  // TODO: Add support for multi type connectors
  if (typeof type === 'string' && !category) {
    optionalReferenceSelectProps.createNewHandler = () => {
      openConnectorModal(false, type, undefined)
    }
  }

  // TODO: Add support for multi type connectors
  if (typeof type === 'string') {
    optionalReferenceSelectProps.editRenderer = getEditRenderer(selected, openConnectorModal, type)
  }

  const component = (
    <FormGroup {...rest} labelFor={name} helperText={helperText} intent={intent} style={{ marginBottom: 0 }}>
      <MultiTypeReferenceInput<ConnectorReferenceDTO>
        name={name}
        referenceSelectProps={{
          ...getReferenceFieldProps({
            defaultScope,
            accountIdentifier,
            projectIdentifier,
            orgIdentifier,
            type,
            category,
            name,
            selected,
            width,
            placeholder,
            label,
            getString,
            openConnectorModal
          }),
          isNewConnectorLabelVisible: isNewConnectorLabelVisible,
          selectedRenderer: getSelectedRenderer(selected),
          ...optionalReferenceSelectProps,
          disabled
        }}
        onChange={(val, valueType, type1) => {
          formik?.setFieldValue(name, val)
          onChange?.(val, valueType, type1)
        }}
        value={selected}
      />
    </FormGroup>
  )

  return (
    <div style={style}>
      {label}
      {enableConfigureOptions ? (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {component}
          {getMultiTypeFromValue(selected) === MultiTypeInputType.RUNTIME && (
            <ConfigureOptions
              value={selected}
              type={getString('string')}
              variableName={name}
              showRequiredField={false}
              showDefaultField={false}
              showAdvanced={true}
              onChange={val => {
                formik?.setFieldValue(name, val)
                onChange?.(val, MultiTypeInputValue.STRING, MultiTypeInputType.RUNTIME)
              }}
              style={{ marginLeft: 'var(--spacing-medium)' }}
              {...configureOptionsProps}
            />
          )}
        </div>
      ) : (
        component
      )}
    </div>
  )
}

export const FormMultiTypeConnectorField = connect(MultiTypeConnectorField)
