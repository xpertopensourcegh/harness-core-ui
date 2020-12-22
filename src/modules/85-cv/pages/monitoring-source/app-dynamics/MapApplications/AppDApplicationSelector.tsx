import React, { useMemo } from 'react'
import type { IconName } from '@wings-software/uikit'
import groupBy from 'lodash-es/groupBy'
import SideNavigation from '../../SideNavigation/SideNavigation'
import type { ApplicationRecord } from '../AppDOnboardingUtils'

interface AppDApplicationSelectorProps {
  applications: { [appName: number]: ApplicationRecord }
  statuses: { [appName: string]: 'WARNING' | 'SUCCESS' | 'ERROR' }
  selectedAppName?: string
  onSelect?(appName: string): void
}

export default function AppDApplicationSelector({
  applications,
  statuses,
  selectedAppName,
  onSelect
}: AppDApplicationSelectorProps) {
  const data = useMemo(() => {
    const intermediate = groupBy(Object.values(applications), 'environment')
    Object.values(intermediate).forEach(apps => apps.sort((a, b) => (a.name < b.name ? -1 : 1)))
    const envs = Object.keys(intermediate).sort()

    if (!selectedAppName) {
      setTimeout(() => onSelect?.(intermediate[envs[0]][0].name))
    }

    return envs.map((env: string) => {
      const apps = intermediate[env]
      return {
        label: env,
        icon: 'harness' as IconName,
        items: apps.map(val => ({
          label: val.name,
          status: statuses[val.name],
          leftLogo: { name: 'service-appdynamics' as IconName }
        }))
      }
    })
  }, [applications, statuses])

  return (
    <SideNavigation
      data={data}
      isSelectedMapper={val => val.label === selectedAppName}
      onSelect={val => onSelect?.(val.label)}
    />
  )
}
