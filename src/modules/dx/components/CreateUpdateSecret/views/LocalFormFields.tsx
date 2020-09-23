import React from 'react'
import { FormInput } from '@wings-software/uikit'
import type { FormikContext } from 'formik'

import i18n from '../CreateUpdateSecret.i18n'

interface LocalFormFieldsProps {
  editing: boolean
}

interface FormikContextProps<T> {
  formik?: FormikContext<T>
}

const LocalFormFields: React.FC<LocalFormFieldsProps & FormikContextProps<any>> = ({ editing }) => {
  return (
    <>
      <FormInput.Text
        name="value"
        label={i18n.labelSecretValue}
        placeholder={editing ? i18n.valueEncrypted : i18n.placeholderSecretValue}
        inputGroup={{ type: 'password' }}
      />
    </>
  )
}

export default LocalFormFields
