import React, { useMemo } from 'react'
import type { IconName } from '@wings-software/uikit'
import groupBy from 'lodash-es/groupBy'
import SideNavigation from '../../SideNavigation/SideNavigation'
import type { ApplicationRecord } from '../AppDOnboardingUtils'

interface AppDApplicationSelectorProps {
  applications: { [appId: number]: ApplicationRecord }
  statuses: { [appId: number]: 'WARNING' | 'SUCCESS' | 'ERROR' }
  selectedAppId?: number
  onSelect?(id: number): void
}

export default function AppDApplicationSelector({
  applications,
  statuses,
  selectedAppId,
  onSelect
}: AppDApplicationSelectorProps) {
  const data = useMemo(() => {
    const intermediate = groupBy(Object.values(applications), 'environment')
    Object.values(intermediate).forEach(apps => apps.sort((a, b) => (a.name < b.name ? -1 : 1)))
    const envs = Object.keys(intermediate).sort()

    if (!selectedAppId) {
      setTimeout(() => onSelect?.(intermediate[envs[0]][0].id))
    }

    return envs.map((env: string) => {
      const apps = intermediate[env]
      return {
        label: env,
        icon: 'harness' as IconName,
        items: apps.map(val => ({
          id: val.id,
          label: val.name,
          status: statuses[val.id],
          leftLogo: { name: 'service-appdynamics' as IconName }
        }))
      }
    })
  }, [applications, statuses])

  return (
    <SideNavigation
      data={data}
      isSelectedMapper={(val: any) => val.id === selectedAppId}
      onSelect={(val: any) => onSelect?.(val.id)}
    />
  )
}
