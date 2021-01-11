import React from 'react'
import { connect, FormikContext } from 'formik'
import {
  Button,
  FixedTypeComponentProps,
  ExpressionAndRuntimeType,
  ButtonProps,
  ExpressionAndRuntimeTypeProps
} from '@wings-software/uicore'
import { get } from 'lodash-es'
import { FormGroup, IFormGroupProps, Intent } from '@blueprintjs/core'

import useCreateOrSelectSecretModal from '@secrets/modals/CreateOrSelectSecretModal/useCreateOrSelectSecretModal'
import type { SecretReference } from '@secrets/components/CreateOrSelectSecret/CreateOrSelectSecret'
import type {
  SecretResponseWrapper,
  ResponsePageConnectorResponse,
  ResponsePageSecretResponseWrapper
} from 'services/cd-ng'
import type { UseGetMockData } from '@common/utils/testUtils'
import { useStrings } from 'framework/exports'
import { errorCheck } from '@common/utils/formikHelpers'

import css from './MultiTypeSecretInput.module.scss'

export interface MultiTypeSecretInputFixedTypeComponentProps
  extends FixedTypeComponentProps,
    Omit<ButtonProps, 'onChange'> {}

export function MultiTypeSecretInputFixedTypeComponent(
  props: MultiTypeSecretInputFixedTypeComponentProps
): React.ReactElement {
  const { value, onChange, ...rest } = props
  return (
    <Button {...rest} className={css.value} icon="key-main" iconProps={{ size: 24, height: 12 }}>
      {value}
    </Button>
  )
}

export interface MultiTypeSecretInputProps extends IFormGroupProps {
  name: string
  label?: string
  type?: SecretResponseWrapper['secret']['type']
  onSuccess?: (secret: SecretReference) => void
  connectorsListMockData?: UseGetMockData<ResponsePageConnectorResponse>
  secretsListMockData?: ResponsePageSecretResponseWrapper
}

export interface ConnectedMultiTypeSecretInputProps extends MultiTypeSecretInputProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formik: FormikContext<any>
}

export function MultiTypeSecretInput(props: ConnectedMultiTypeSecretInputProps): React.ReactElement {
  const {
    formik,
    label,
    name,
    onSuccess,
    type = 'SecretText',
    connectorsListMockData,
    secretsListMockData,
    ...restProps
  } = props
  const { openCreateOrSelectSecretModal } = useCreateOrSelectSecretModal(
    {
      type,
      onSuccess: secret => {
        formik.setFieldValue(name, secret.referenceString)
        /* istanbul ignore next */
        onSuccess?.(secret)
      },
      connectorsListMockData,
      secretsListMockData
    },
    [name, onSuccess]
  )
  const { getString } = useStrings()
  const value = get(formik.values, name)
  const hasError = errorCheck(name, formik)

  const {
    intent = hasError ? Intent.DANGER : Intent.NONE,
    helperText = hasError ? get(formik.errors, name) : null,
    disabled,
    ...rest
  } = restProps

  const handleChange: ExpressionAndRuntimeTypeProps['onChange'] = val => {
    formik.setFieldValue(name, val)
  }

  return (
    <FormGroup {...rest} labelFor={name} label={label} intent={intent} helperText={helperText}>
      <ExpressionAndRuntimeType
        name={name}
        value={value || getString('createOrSelectSecret')}
        onChange={handleChange}
        style={{ flexGrow: 1 }}
        fixedTypeComponentProps={{ onClick: openCreateOrSelectSecretModal }}
        fixedTypeComponent={MultiTypeSecretInputFixedTypeComponent}
        defaultValueToReset=""
      />
    </FormGroup>
  )
}

export default connect<MultiTypeSecretInputProps>(MultiTypeSecretInput)
