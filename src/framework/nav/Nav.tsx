import React from 'react'
import { Container, Link, Icon, FlexExpander } from '@wings-software/uikit'
import css from './Nav.module.scss'

export const Nav: React.FC = () => {
  return (
    <Container flex className={css.main}>
      <Container flex className={css.modules}>
        <ul>
          <li className={css.selected}>
            <Link noStyling href="/" className={css.moduleItem}>
              <Icon name="harness" size={32} />
            </Link>
          </li>
          <li>
            <Link noStyling href="/" className={css.moduleItem}>
              <Icon name="service-datadog" size={32} />
            </Link>
          </li>
          <li>
            <Link noStyling href="/" className={css.moduleItem}>
              <Icon name="service-github" size={32} />
            </Link>
          </li>
        </ul>
        <FlexExpander />
        <ul>
          <li>
            <Link noStyling href="/" className={css.moduleItem}>
              <Icon name="service-jenkins" size={32} />
            </Link>
          </li>
          <li>
            <Link noStyling href="/" className={css.moduleItem}>
              <Icon name="service-slack" size={32} />
            </Link>
          </li>
        </ul>
      </Container>
      <Container className={css.modulesContent}></Container>
    </Container>
  )
}
