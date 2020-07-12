import React, { useState } from 'react'
import cx from 'classnames'
import ContentEditable from 'react-contenteditable'
import { Icon } from '@wings-software/uikit'

import css from './EditableText.module.scss'

interface EditableTextProps {
  value?: string
  editable?: boolean
  onChange?: (value: string) => void
}

const EditableText: React.FC<EditableTextProps> = props => {
  const { value, onChange, editable = true } = props
  const [val, setVal] = useState(value || '')
  const [editing, setEditing] = useState(false)

  return (
    <>
      <ContentEditable
        html={val}
        disabled={!editable || !editing}
        className={cx(css.editableText, { [css.editing]: editing })}
        tagName="span"
        onChange={ev => {
          setVal(ev.target.value)
          onChange?.(ev.target.value)
        }}
        onBlur={_ => {
          setEditing(false)
        }}
      />
      {editable && !editing ? (
        <Icon
          name="edit"
          style={{ paddingBottom: '4px' }}
          size={10}
          onClick={() => {
            setEditing(true)
          }}
        />
      ) : null}
    </>
  )
}

export default EditableText
