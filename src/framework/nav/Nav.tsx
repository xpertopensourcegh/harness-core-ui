import React from 'react'
import { Container, Link, Icon, FlexExpander, Text } from '@wings-software/uikit'
import css from './Nav.module.scss'
import { useApplicationStateReader } from 'framework/hooks/useApplicationState'

const ICON_SIZE = 24

export const Nav: React.FC = () => {
  const { modules } = useApplicationStateReader()

  // TODO: Nav is still getting called three times on fresh pageload
  // and two when navigate among pages
  // This needs to fix to make sure module nav is updated once, not two or three
  // as they might make service calls
  console.log('APP STATE FROM NAV', modules)

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
            <Link noStyling href="/404" className={css.moduleItem}>
              <Icon name="layers" size={ICON_SIZE} />
            </Link>
          </li>
          <li>
            <Link noStyling href="/user" className={css.moduleItem}>
              <Icon name="person" size={ICON_SIZE} />
            </Link>
          </li>
        </ul>
      </Container>
      <Container className={css.modulesContent}>
        <Text>Hello WORLD</Text>
      </Container>
    </Container>
  )
}
