import React from 'react'
import { FormInput } from '@wings-software/uikit'
import i18n from './ConnectorDetailField.i18n'
import css from './ConnectorDetailFields.module.scss'

const ConnectorDetailFields = () => {
  return (
    <div className={css.detailWrapper}>
      <FormInput.InputWithIdentifier />
      <FormInput.TextArea label={i18n.description} name="description" />
      <FormInput.TagInput
        label={i18n.tags}
        name="tags"
        labelFor={name => (typeof name === 'string' ? name : '')}
        itemFromNewTag={newTag => newTag}
        items={['tag1']}
        className={css.tags}
        tagInputProps={{
          noInputBorder: true,
          openOnKeyDown: false,
          showAddTagButton: true,
          showClearAllButton: true,
          allowNewTag: true
        }}
      />
    </div>
  )
}

export default ConnectorDetailFields
