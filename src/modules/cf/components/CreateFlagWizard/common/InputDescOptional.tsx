import React, { useState } from 'react'
import { Layout, FormInput, Button, Icon } from '@wings-software/uikit'
import css from './InputDescOptional.module.scss'

interface InputDescOptionalProps {
  text: string
  inputName: string
  inputPlaceholder: string | undefined
}

const InputDescOptional: React.FC<InputDescOptionalProps> = props => {
  const { text, inputName, inputPlaceholder } = props

  const [toggleDescInput, setToggleDescInput] = useState(false)

  const onOpenDesc = (): void => {
    setToggleDescInput(true)
  }

  const onCloseDesc = (): void => {
    setToggleDescInput(false)
  }

  return (
    <Layout.Horizontal>
      {toggleDescInput ? (
        <>
          <FormInput.TextArea
            name={inputName}
            label={text}
            className={css.toggleTextarea}
            placeholder={inputPlaceholder}
          />
          <Button minimal onClick={onCloseDesc} icon="small-cross" />
        </>
      ) : (
        <span onClick={onOpenDesc} className={css.toggleDescText}>
          <Icon name="small-plus" color="grey400" />
          {text}
        </span>
      )}
    </Layout.Horizontal>
  )
}

export default InputDescOptional
