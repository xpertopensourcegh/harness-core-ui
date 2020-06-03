import type { NewRelicApplication } from '@wings-software/swagger-ts/definitions'
import type { SelectOption } from '@wings-software/uikit'

export function transformAppDynamicsApplications(appdApplications: NewRelicApplication[]): SelectOption[] {
  return (
    appdApplications
      ?.filter((app: NewRelicApplication) => app?.name && app?.id)
      .sort((a, b) => (a.name! > b.name! ? 1 : b.name! > a.name! ? -1 : 0))
      .map(({ name, id }) => ({ label: name || '', value: id || '' })) || []
  )
}
