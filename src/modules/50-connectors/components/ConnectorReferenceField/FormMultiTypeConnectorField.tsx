import React from 'react'
import { ExpressionAndRuntimeTypeProps, MultiTypeInputValue } from '@wings-software/uikit'
import { FormikContext, isObject, connect } from 'formik'
import { FormGroup, Intent } from '@blueprintjs/core'
import { get } from 'lodash-es'
import useCreateConnectorModal from '@connectors/modals/ConnectorModal/useCreateConnectorModal'
import type { ConnectorConfigDTO, ConnectorInfoDTO, ConnectorResponse } from 'services/cd-ng'
import { Scope } from '@common/interfaces/SecretsInterface'
import { useStrings } from 'framework/exports'
import { getScopeFromDTO } from '../../../10-common/components/EntityReference/EntityReference'
import {
  ConnectorReferenceFieldProps,
  getReferenceFieldProps,
  getEditRenderer,
  getSelectedRenderer
} from './ConnectorReferenceField'
import { MultiTypeReferenceInput } from '../../../10-common/components/ReferenceSelect/ReferenceSelect'

export interface MultiTypeConnectorFieldProps extends Omit<ConnectorReferenceFieldProps, 'onChange'> {
  onChange?: ExpressionAndRuntimeTypeProps['onChange']
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formik?: any // TODO: Remove this but not sure why FormikContext<any> was not working
  isNewConnectorLabelVisible?: boolean
}
export interface ConnectorReferenceDTO extends ConnectorInfoDTO {
  status: ConnectorResponse['status']
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
    isNewConnectorLabelVisible = true,
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
        props.onChange?.(val, MultiTypeInputValue.SELECT_OPTION)
        formik?.setFieldValue(name, val)
      }
    }
  })

  return (
    <FormGroup {...rest} labelFor={name} helperText={helperText} intent={intent} disabled={disabled} label={label}>
      <MultiTypeReferenceInput<ConnectorReferenceDTO>
        name={name}
        referenceSelectProps={{
          ...getReferenceFieldProps({
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
          }),
          isNewConnectorLabelVisible: isNewConnectorLabelVisible,
          createNewHandler: () => {
            openConnectorModal(true, type, undefined)
          },
          editRenderer: getEditRenderer(selected, openConnectorModal, type),
          selectedRenderer: getSelectedRenderer(selected)
        }}
        onChange={(val, valueType) => {
          formik?.setFieldValue(name, val)
          onChange?.(val, valueType)
        }}
        value={selected}
      />
    </FormGroup>
  )
}

export const FormMultiTypeConnectorField = connect(MultiTypeConnectorField)
