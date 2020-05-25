import React, { useMemo, useState } from 'react'
import { Container, Link, Icon, FlexExpander } from '@wings-software/uikit'
import css from './Nav.module.scss'
import { useAppStoreReader } from 'framework/hooks/useAppStore'
import type { ModuleInfo } from 'framework/types/ModuleInfo'

const ICON_SIZE = 24

export const Nav: React.FC = () => {
  const { routeInfo, moduleRegistry } = useAppStoreReader()
  const [activeModule, setActiveModule] = useState<ModuleInfo>()
  const [activeModuleMenu, setActiveModuleMenu] = useState<React.ReactNode>()
  const modulesNav = useMemo(
    () =>
      moduleRegistry?.map(moduleInfo => {
        if (moduleInfo.module === routeInfo?.module) {
          setActiveModule(moduleInfo)
          const ActiveMenu = moduleInfo.menu as React.ElementType
          setActiveModuleMenu(<ActiveMenu />)
        }

        return (
          <li key={moduleInfo.module} className={moduleInfo.module === routeInfo?.module ? css.selected : undefined}>
            <Link noStyling href={moduleInfo.url({}, {})} className={css.moduleItem}>
              <Icon name={moduleInfo.icon.normal} size={ICON_SIZE} />
            </Link>
          </li>
        )
      }),
    [routeInfo] // eslint-disable-line react-hooks/exhaustive-deps
  )
  //

  console.log('Nav Manager', { moduleRegistry, activeModule })

  return (
    <Container flex className={css.nav}>
      <Container flex className={css.modules}>
        <ul>{modulesNav}</ul>
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
      {activeModuleMenu && <Container className={css.modulesContent}>{activeModuleMenu}</Container>}
    </Container>
  )
}
