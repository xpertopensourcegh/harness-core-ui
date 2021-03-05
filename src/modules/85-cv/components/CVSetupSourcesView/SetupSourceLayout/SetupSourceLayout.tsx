import React from 'react'
import { Button, Container } from '@wings-software/uicore'
import { useStrings } from 'framework/exports'
import css from './SetupSourceLayout.module.scss'

export interface SetupSourceLayoutProps {
  content: React.ReactNode
  leftPanelContent?: React.ReactNode
  rightPanelContent?: React.ReactNode
}

export function FooterCTA(): JSX.Element {
  const { getString } = useStrings()
  return (
    <Container className={css.footerCta}>
      <Button icon="chevron-left">{getString('previous')}</Button>
      <Button icon="chevron-right" className={css.nextButton}>
        {getString('next')}
      </Button>
    </Container>
  )
}

export function SetupSourceLayout(props: SetupSourceLayoutProps): JSX.Element {
  const { content, leftPanelContent, rightPanelContent } = props
  return (
    <Container className={css.main}>
      <Container className={css.contentContainer}>
        <Container className={css.leftPanel}>{leftPanelContent}</Container>
        <Container className={css.content}>{content}</Container>
        <Container className={css.rightPanel}>{rightPanelContent}</Container>
      </Container>
      <FooterCTA />
    </Container>
  )
}
