import React from 'react'
import { Container, Link, Icon, FlexExpander } from '@wings-software/uikit'
import css from './Nav.module.scss'

const ICON_SIZE = 24

export const Nav: React.FC = () => {
  return (
    <Container flex className={css.nav}>
      <Container flex className={css.modules}>
        <ul>
          <li className={css.selected}>
            <Link noStyling href="/dashboard" className={css.moduleItem}>
              <Icon name="harness" size={ICON_SIZE} />
            </Link>
          </li>
          <li>
            <Link noStyling href="/project" className={css.moduleItem}>
              <Icon name="cube" size={ICON_SIZE} />
            </Link>
          </li>
          <li>
            <Link noStyling href="/deployment" className={css.moduleItem}>
              <Icon name="code-block" size={ICON_SIZE} />
            </Link>
          </li>
          <li>
            <Link noStyling href="/continuous-verification" className={css.moduleItem}>
              <Icon name="cloud" size={ICON_SIZE} />
            </Link>
          </li>
        </ul>
        <FlexExpander />
        <ul>
          <li>
            <Link noStyling href="/" className={css.moduleItem}>
              <Icon name="layers" size={ICON_SIZE} />
            </Link>
          </li>
          <li>
            <Link noStyling href="/" className={css.moduleItem}>
              <Icon name="person" size={ICON_SIZE} />
            </Link>
          </li>
        </ul>
      </Container>
      <Container className={css.modulesContent}></Container>
    </Container>
  )
}
