import React from 'react'
import { FormInput } from '@wings-software/uikit'
import type { FormikContext } from 'formik'
import type { SecretDTOV2 } from 'services/cd-ng'

import i18n from '../CreateUpdateSecret.i18n'

interface VaultFormFieldsProps {
  type: SecretDTOV2['type']
  editing: boolean
}

interface FormikContextProps<T> {
  formik?: FormikContext<T>
}

const VaultFormFields: React.FC<VaultFormFieldsProps & FormikContextProps<any>> = ({ formik, type, editing }) => {
  return (
    <>
      {type === 'SecretText' ? (
        <>
          <FormInput.RadioGroup
            name="valueType"
            radioGroup={{ inline: true }}
            items={[
              { label: 'Inline Secret Value', value: 'Inline' },
              { label: 'Reference Secret', value: 'Reference' }
            ]}
          />
          {formik?.values['valueType'] === 'Inline' ? (
            <FormInput.Text
              name="value"
              label={i18n.labelSecretValue}
              placeholder={editing ? i18n.valueEncrypted : i18n.placeholderSecretValue}
              inputGroup={{ type: 'password' }}
            />
          ) : null}
          {formik?.values['valueType'] === 'Reference' ? (
            <FormInput.Text
              name="value"
              label={i18n.labelSecretReference}
              placeholder={i18n.placeholderSecretReference}
            />
          ) : null}
        </>
      ) : null}
      {type === 'SecretFile' ? <FormInput.FileInput name="file" multiple /> : null}
      <FormInput.TextArea name="description" label={i18n.labelSecretDescription} />
      {/* <FormInput.TagInput
              name="tags"
              label={i18n.labelSecretTags}
              items={[]}
              labelFor={name => name as string}
              itemFromNewTag={newTag => newTag}
              tagInputProps={{
                showClearAllButton: true,
                allowNewTag: true
              }}
            /> */}
    </>
  )
}

export default VaultFormFields
