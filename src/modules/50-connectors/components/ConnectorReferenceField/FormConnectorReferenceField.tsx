import React from 'react'
import { connect, FormikContext } from 'formik'
import { get } from 'lodash-es'
import { errorCheck } from '@common/utils/formikHelpers'
import { Scope } from '@common/interfaces/SecretsInterface'
import { useStrings } from 'framework/exports'
import { useConnectorRef } from '@connectors/common/StepsUseConnectorRef'
import { ConnectorReferenceFieldProps, ConnectorReferenceField } from './ConnectorReferenceField'
export interface FormConnectorFieldProps extends Omit<ConnectorReferenceFieldProps, 'onChange' | 'error'> {
  formik?: FormikContext<any>
}

const FormConnectorReference = (props: FormConnectorFieldProps): React.ReactElement => {
  const { name, formik, placeholder, disabled, ...restProps } = props
  const { getString } = useStrings()
  const hasError = errorCheck(name, formik)
  const error = hasError ? get(formik?.errors, name) : undefined

  const selected = get(formik?.values, name, '')

  const { connector, loading } = useConnectorRef(selected)

  return (
    <ConnectorReferenceField
      {...restProps}
      name={name}
      placeholder={loading ? getString('loading') : placeholder}
      selected={connector as ConnectorReferenceFieldProps['selected']}
      disabled={loading || disabled}
      onChange={(record, scope) => {
        formik?.setFieldValue(
          name,
          scope === Scope.ORG || scope === Scope.ACCOUNT ? `${scope}.${record?.identifier}` : record?.identifier
        )
      }}
      error={error as string}
    />
  )
}

export const FormConnectorReferenceField = connect(FormConnectorReference)
