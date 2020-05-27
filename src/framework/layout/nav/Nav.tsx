import React, { useMemo, ElementType } from 'react'
import { Container, Link, Icon, FlexExpander } from '@wings-software/uikit'
import css from './Nav.module.scss'
import { useAppStoreReader } from 'framework/hooks/useAppStore'
import type { Route, NavEntry } from 'framework'
import cx from 'classnames'
import { routeParams } from 'framework/route/RouteMounter'

const ICON_SIZE = 24
const BOTTOM = 'BOTTOM'

const renderNavEntry = (navEntry: NavEntry, route?: Route): JSX.Element => (
  <li key={navEntry.navId} className={navEntry.navId === route?.navId ? css.selected : undefined}>
    <Link noStyling href={navEntry.url(routeParams())} className={css.moduleItem}>
      <Icon name={navEntry.icon.normal} size={ICON_SIZE} />
    </Link>
  </li>
)
const renderNavMenu = (Menu?: ElementType): JSX.Element | null => (Menu ? <Menu /> : null)

export const Nav: React.FC<{ withoutMenu?: boolean }> = ({ withoutMenu = false }) => {
  const { route: route, navRegistry } = useAppStoreReader()
  const menu = useMemo(
    () => renderNavMenu(navRegistry?.find(({ navId }) => navId === route?.navId)?.menu as ElementType),
    [navRegistry, route] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <Container flex className={cx(css.nav, withoutMenu && css.withoutMenu)}>
      <Container flex className={css.modules}>
        <ul>
          {navRegistry
            ?.filter(moduleInfo => moduleInfo.position !== BOTTOM)
            .map(moduleInfo => renderNavEntry(moduleInfo, route))}
        </ul>
        <FlexExpander />
        <ul>
          {navRegistry
            ?.filter(moduleInfo => moduleInfo.position === BOTTOM)
            .map(moduleInfo => renderNavEntry(moduleInfo, route))}
        </ul>
      </Container>
      {!withoutMenu && <Container className={css.moduleMenu}>{menu}</Container>}
    </Container>
  )
}

export const NavWithoutMenu: React.FC = () => <Nav withoutMenu />
