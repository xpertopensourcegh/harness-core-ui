import React, { useState } from 'react'
import { Layout, FormInput, Button, Color } from '@wings-software/uicore'
import css from './InputDescOptional.module.scss'

interface InputDescOptionalProps {
  text: string
  inputName: string
  inputPlaceholder: string | undefined
  isOpen?: boolean
}

const InputDescOptional: React.FC<InputDescOptionalProps> = props => {
  const { text, inputName, inputPlaceholder, isOpen } = props

  const [toggleDescInput, setToggleDescInput] = useState(isOpen)

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
        <Button
          minimal
          className={css.toggleDescText}
          icon="small-plus"
          iconProps={{ color: Color.GREY_400 }}
          text={text}
          onClick={onOpenDesc}
        />
      )}
    </Layout.Horizontal>
  )
}

export default InputDescOptional
