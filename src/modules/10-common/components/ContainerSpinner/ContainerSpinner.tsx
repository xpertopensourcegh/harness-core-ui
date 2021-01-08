import React from 'react'
import { Container } from '@wings-software/uicore'
import { PageSpinner } from '@common/components'
import css from './ContainerSpinner.module.scss'

export const ContainerSpinner: React.FC = () => {
  return (
    <Container className={css.spinner}>
      <PageSpinner />
    </Container>
  )
}
