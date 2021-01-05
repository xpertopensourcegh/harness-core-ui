import React from 'react'
import { Color, Container, Text } from '@wings-software/uicore'
import css from './FlagTypeElement.module.scss'

interface TypeFlagProps {
  type: string
  text: string
  textDesc: string
  typeOfFlagFnc: (typeOfFlag: boolean, type: string) => void
  children: React.ReactNode
}

const TypeFlag: React.FC<TypeFlagProps> = ({ type, text, textDesc, typeOfFlagFnc, children }) => {
  const onTypeOfFlagFnc = (): void => {
    typeOfFlagFnc(true, type)
  }

  return (
    <Container>
      <div onClick={onTypeOfFlagFnc} className={css.typeFlag}>
        {children}
        <Text margin={{ top: 'small', bottom: 'small' }} color={Color.BLACK} font={{ weight: 'bold', size: 'medium' }}>
          {text}
        </Text>
        <Text font="xsmall" color={Color.GREY_400}>
          {textDesc}
        </Text>
      </div>
    </Container>
  )
}

export default TypeFlag
