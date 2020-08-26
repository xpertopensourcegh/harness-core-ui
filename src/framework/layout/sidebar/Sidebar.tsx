import React, { useMemo, ElementType, useLayoutEffect, useState } from 'react'
import { Container, Icon, ModalProvider } from '@wings-software/uikit'
import cx from 'classnames'
import { Link } from 'react-router-dom'
import { useAppStoreReader } from 'framework/hooks/useAppStore'
import type { Route, SidebarEntry } from 'framework/exports'
import { routeParams } from 'framework/route/RouteMounter'
import { SidebarTitle } from './components/SidebarTitle'
import { SidebarLink, SidebarButton } from './components/SidebarLink'
import css from './Sidebar.module.scss'

const ICON_SIZE = 24
const BOTTOM = 'BOTTOM'

const SidebarItem = (sidebarEntry: SidebarEntry, route?: Route): JSX.Element => {
  const [hover, setHover] = useState(false)
  const isSelected = sidebarEntry.sidebarId === route?.sidebarId

  return (
    <li key={sidebarEntry.sidebarId} className={cx(css.sidebarItem, isSelected && css.selected)}>
      <Link
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        to={sidebarEntry.url(routeParams())}
        className={css.sidebarLink}
        title={sidebarEntry.title}
      >
        <Icon
          name={isSelected ? sidebarEntry.icon.selected : hover ? sidebarEntry.icon.hover : sidebarEntry.icon.normal}
          size={ICON_SIZE}
        />
      </Link>
    </li>
  )
}
const renderMenu = (Menu?: ElementType): JSX.Element | null =>
  Menu ? (
    <ModalProvider>
      <Menu />
    </ModalProvider>
  ) : null

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
          .map(sidebarEntry => SidebarItem(sidebarEntry, route))}
        <li className={css.spacer}></li>
        {sidebarRegistry
          ?.filter(sidebarEntry => sidebarEntry.position === BOTTOM)
          .map(sidebarEntry => SidebarItem(sidebarEntry, route))}
      </ul>
      {!withoutMenu && <Container className={css.menu}>{menu}</Container>}
    </Container>
  )
}

export const Sidebar = {
  Title: SidebarTitle,
  Link: SidebarLink,
  Button: SidebarButton
}
