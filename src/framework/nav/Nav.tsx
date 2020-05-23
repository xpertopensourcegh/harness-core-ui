import React from 'react'
import { Container, Link, Icon, FlexExpander, Text } from '@wings-software/uikit'
import css from './Nav.module.scss'
import { useApplicationStateReader } from 'framework/hooks/useApplicationState'
import { ModuleName } from 'framework/types/ModuleName'

const ICON_SIZE = 24

export const Nav: React.FC = () => {
  const { routeEntry, modules } = useApplicationStateReader()

  // TODO: Nav is still getting called three times on fresh pageload
  // and two when navigate among pages
  // This needs to fix to make sure module nav is updated once, not two or three
  // as they might make service calls
  console.log('APP STATE FROM NAV', modules)
  const moduleComponents = modules?.map(moduleEntry => {
    return (
      <li key={moduleEntry.module} className={moduleEntry.module === routeEntry?.module ? css.selected : undefined}>
        <Link noStyling href={moduleEntry.href({}, {})} className={css.moduleItem}>
          <Icon name={moduleEntry.icon.normal} size={ICON_SIZE} />
        </Link>
      </li>
    )
  })

  return (
    <Container flex className={css.nav}>
      <Container flex className={css.modules}>
        <ul>{moduleComponents}</ul>
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
