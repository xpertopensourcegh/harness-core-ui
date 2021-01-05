import React from 'react'
import { FormInput } from '@wings-software/uicore'
import type { FormikContext } from 'formik'
import { useStrings } from 'framework/exports'

import type { SecretDTOV2 } from 'services/cd-ng'
import i18n from '../CreateUpdateSecret.i18n'

interface LocalFormFieldsProps {
  type: SecretDTOV2['type']
  editing: boolean
}

interface FormikContextProps<T> {
  formik?: FormikContext<T>
}

const LocalFormFields: React.FC<LocalFormFieldsProps & FormikContextProps<any>> = ({ editing, type }) => {
  const { getString } = useStrings()
  return (
    <>
      {type === 'SecretText' ? (
        <FormInput.Text
          name="value"
          label={i18n.labelSecretValue}
          placeholder={editing ? i18n.valueEncrypted : i18n.placeholderSecretValue}
          inputGroup={{ type: 'password' }}
        />
      ) : null}
      {type === 'SecretFile' ? <FormInput.FileInput name="file" label={i18n.labelSecretFile} multiple /> : null}
      <FormInput.TextArea name="description" label={getString('description')} />
      <FormInput.KVTagInput name="tags" label={getString('tagsLabel')} />
    </>
  )
}

export default LocalFormFields
