import { FormInput } from '@wings-software/uikit'
import React from 'react'

import i18n from './SSHDetailsFormFields.i18n'

interface SSHDetailsFormFieldsProps {
  editing?: boolean
}

const SSHDetailsFormFields: React.FC<SSHDetailsFormFieldsProps> = ({ editing }) => {
  return (
    <>
      <FormInput.InputWithIdentifier inputLabel={i18n.labelName} isIdentifierEditable={!editing} />
      <FormInput.TextArea name="description" label={i18n.labelDescription} />
      {/* <FormInput.TagInput
                name="tags"
                label={i18n.labelTags}
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

export default SSHDetailsFormFields
