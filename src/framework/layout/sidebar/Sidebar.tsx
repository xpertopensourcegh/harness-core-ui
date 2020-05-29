import React, { useMemo, ElementType, useLayoutEffect } from 'react'
import { Container, Link, Icon } from '@wings-software/uikit'
import css from './Sidebar.module.scss'
import { useAppStoreReader } from 'framework/hooks/useAppStore'
import type { Route, SidebarEntry } from 'framework/exports'
import cx from 'classnames'
import { routeParams } from 'framework/route/RouteMounter'
import { SidebarTitle } from './components/SidebarTitle'
import { SidebarLink } from './components/SidebarLink'

const ICON_SIZE = 24
const BOTTOM = 'BOTTOM'

const renderSidebarItem = (sidebarEntry: SidebarEntry, route?: Route): JSX.Element => (
  <li
    key={sidebarEntry.sidebarId}
    className={cx(css.sidebarItem, sidebarEntry.sidebarId === route?.sidebarId && css.selected)}
  >
    <Link noStyling href={sidebarEntry.url(routeParams())} className={css.sidebarLink} title={sidebarEntry.title}>
      <Icon name={sidebarEntry.icon.normal} size={ICON_SIZE} />
    </Link>
  </li>
)
const renderMenu = (Menu?: ElementType): JSX.Element | null => (Menu ? <Menu /> : null)

export const SidebarMounter: React.FC<{ withoutMenu?: boolean }> = ({ withoutMenu = false }) => {
  const { route, sidebarRegistry } = useAppStoreReader()
  const menu = useMemo(
    () =>
      renderMenu(sidebarRegistry?.find(({ sidebarId }) => sidebarId === route?.sidebarId)?.sidebarMenu as ElementType),
    [sidebarRegistry, route] // eslint-disable-line react-hooks/exhaustive-deps
  )

  useLayoutEffect(() => {
    document.querySelector(`.${css.beforeSelected}`)?.classList.remove(css.beforeSelected)
    document.querySelector(`.${css.selected}`)?.previousElementSibling?.classList.add(css.beforeSelected)
  }, [route])

  return (
    <Container flex className={cx(css.container)}>
      <ul className={css.sidebar}>
        {sidebarRegistry
          ?.filter(sidebarEntry => sidebarEntry.position !== BOTTOM)
          .map(sidebarEntry => renderSidebarItem(sidebarEntry, route))}
        <li className={css.spacer}></li>
        {sidebarRegistry
          ?.filter(sidebarEntry => sidebarEntry.position === BOTTOM)
          .map(sidebarEntry => renderSidebarItem(sidebarEntry, route))}
      </ul>
      {!withoutMenu && <Container className={css.menu}>{menu}</Container>}
    </Container>
  )
}

export const Sidebar = {
  Title: SidebarTitle,
  Link: SidebarLink
}
