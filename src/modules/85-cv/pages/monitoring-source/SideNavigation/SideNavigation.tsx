import React from 'react'
import { Container, Text, IconName } from '@wings-software/uicore'
import { NavItem, NavItemProps } from '@cv/pages/onboarding/SetupPageLeftNav/NavItem/NavItem'
import styles from './SideNavigation.module.scss'

export interface SideNavigationProps {
  data: Array<{
    label: string
    icon: IconName
    items: Array<NavItemProps>
  }>

  isSelectedMapper(item: NavItemProps): boolean
  onSelect(item: NavItemProps): void
}

export default function SideNavigation({ data, isSelectedMapper, onSelect }: SideNavigationProps) {
  return (
    <Container className={styles.main}>
      {data.map(group => (
        <Container key={group.label} className={styles.group}>
          <Text icon={group.icon} height={40}>
            {group.label}
          </Text>
          {group.items?.map(item => (
            <NavItem
              key={item.label}
              className={styles.item}
              isSelected={isSelectedMapper(item)}
              onClick={() => onSelect?.(item)}
              leftLogo={item.leftLogo}
              label={item.label}
              status={item.status}
            />
          ))}
        </Container>
      ))}
    </Container>
  )
}
