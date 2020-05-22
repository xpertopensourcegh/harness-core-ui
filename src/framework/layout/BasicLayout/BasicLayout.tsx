import { Container } from '@wings-software/uikit'
import React from 'react'
import css from './BasicLayout.module.scss'

//
// TODO: Implement BasicLayout as a very basic layout with a Harness
// logo and header on top, the rest is reserved for page content.
// @see https://qa.harness.io/#/account/zEaak-FLS425IEO7OLzMUg/onboarding
// as an example
//
export const BasicLayout: React.FC = ({ children } = {}) => {
  return <Container className={css.layout}>{children}</Container>
}
