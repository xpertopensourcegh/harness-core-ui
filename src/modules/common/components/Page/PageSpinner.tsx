import { Color, Text, Icon, Layout, Container } from '@wings-software/uikit'
import React from 'react'
import cx from 'classnames'
import i18n from './PageSpinner.i18n'
import css from './PageSpinner.module.scss'

export interface PageSpinnerProps {
  message?: string
  width?: number
  className?: string
}

export const PageSpinner: React.FC<PageSpinnerProps> = props => (
  <Container className={css.spinner} flex={{ align: 'center-center' }}>
    <Layout.Vertical
      spacing="medium"
      width={props?.width || 500}
      style={{ alignItems: 'center', marginTop: '-32px' }}
      className={cx(props.className, css.content)}
    >
      <Icon name="steps-spinner" size={32} color={Color.GREY_600} />
      <Text font={{ size: 'medium', align: 'center' }} color={Color.GREY_600}>
        {props.message || i18n.loading}
      </Text>
    </Layout.Vertical>
  </Container>
)
