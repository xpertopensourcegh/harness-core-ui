import React, { useMemo, ElementType } from 'react'
import { Container, Link, Icon, FlexExpander } from '@wings-software/uikit'
import css from './Nav.module.scss'
import { useAppStoreReader } from 'framework/hooks/useAppStore'
import type { RouteInfo, NavEntry } from 'framework'
import cx from 'classnames'

const ICON_SIZE = 24
const BOTTOM = 'BOTTOM'

const renderModule = (moduleInfo: NavEntry, routeInfo?: RouteInfo): JSX.Element => (
  <li key={moduleInfo.module + moduleInfo.title} className={moduleInfo.route === routeInfo ? css.selected : undefined}>
    <Link noStyling href={moduleInfo.url({}, {})} className={css.moduleItem}>
      <Icon name={moduleInfo.icon.normal} size={ICON_SIZE} />
    </Link>
  </li>
)
const renderModuleMenu = (Menu?: ElementType): JSX.Element | null => (Menu ? <Menu /> : null)

export const Nav: React.FC<{ withoutMenu?: boolean }> = ({ withoutMenu = false }) => {
  const { routeInfo, moduleRegistry } = useAppStoreReader()
  const menu = useMemo(
    () => renderModuleMenu(moduleRegistry?.find(({ route }) => route === routeInfo)?.menu as ElementType),
    [moduleRegistry, routeInfo] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <Container flex className={cx(css.nav, withoutMenu && css.withoutMenu)}>
      <Container flex className={css.modules}>
        <ul>
          {moduleRegistry
            ?.filter(moduleInfo => moduleInfo.position !== BOTTOM)
            .map(moduleInfo => renderModule(moduleInfo, routeInfo))}
        </ul>
        <FlexExpander />
        <ul>
          {moduleRegistry
            ?.filter(moduleInfo => moduleInfo.position === BOTTOM)
            .map(moduleInfo => renderModule(moduleInfo, routeInfo))}
        </ul>
      </Container>
      {!withoutMenu && <Container className={css.moduleMenu}>{menu}</Container>}
    </Container>
  )
}

export const NavWithoutMenu: React.FC = () => <Nav withoutMenu />
