import React from 'react'
import { Container } from '@wings-software/uicore'
import css from './Spacer.module.scss'

interface SpacerInterface {
  paddingTop?: string
  paddingBottom?: string
  paddingLeft?: string
  paddingRight?: string
  padding?: string
}

export default function Spacer(props: SpacerInterface): JSX.Element {
  const { paddingTop, paddingBottom } = props
  return (
    <Container
      style={{
        paddingTop: `${paddingTop ? paddingTop : '0'}`,
        paddingBottom: `${paddingBottom ? paddingBottom : '0'}`
      }}
      className={css.spacer}
    >
      <Container />
    </Container>
  )
}

// paddingTop:paddingTop
