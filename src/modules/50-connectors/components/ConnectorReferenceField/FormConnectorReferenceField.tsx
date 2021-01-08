import React from 'react'
import { connect, FormikContext } from 'formik'
import { get } from 'lodash-es'
import { errorCheck } from '@common/utils/formikHelpers'
import { Scope } from '@common/interfaces/SecretsInterface'
import { ConnectorReferenceFieldProps, ConnectorReferenceField } from './ConnectorReferenceField'

export interface FormConnectorFieldProps extends Omit<ConnectorReferenceFieldProps, 'onChange' | 'error'> {
  formik?: FormikContext<any>
  initialSelected: ConnectorReferenceFieldProps['selected']
}

const FormConnectorReference = (props: FormConnectorFieldProps): React.ReactElement => {
  const { name, formik } = props
  const { initialSelected, ...restProps } = props
  const hasError = errorCheck(name, formik)
  const error = hasError ? get(formik?.errors, name) : undefined

  // @TODO: test this initial selected once we are able to mock
  // connector requests in Storybook
  const selected = get(formik?.values, name, initialSelected)

  return (
    <ConnectorReferenceField
      {...restProps}
      selected={selected}
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
