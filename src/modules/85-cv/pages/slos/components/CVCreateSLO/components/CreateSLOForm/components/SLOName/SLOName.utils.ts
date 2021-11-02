import type { SelectOption } from '@wings-software/uicore'
import type { ResponsePageUserJourneyResponse } from 'services/cv'

export function getUserJourneysData(userJourneysData: ResponsePageUserJourneyResponse | null): SelectOption[] {
  return (userJourneysData?.data?.content?.map(el => ({
    label: el?.userJourney?.name,
    value: el?.userJourney?.identifier
  })) || []) as SelectOption[]
}
