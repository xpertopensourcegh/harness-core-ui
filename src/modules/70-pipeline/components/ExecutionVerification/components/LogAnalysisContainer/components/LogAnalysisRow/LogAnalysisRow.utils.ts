import type { SelectOption } from '@wings-software/uicore'
import type { UseStringsReturn } from 'framework/strings'
import type { LogData } from 'services/cv'

export const getEventTypeFromClusterType = (tag: LogData['tag']): string => {
  switch (tag) {
    case 'KNOWN':
      return 'Known'
    case 'UNKNOWN':
      return 'Unknown'
    case 'UNEXPECTED':
      return 'Unexpected'
    default:
      return ''
  }
}

export const getClusterTypes = (getString: UseStringsReturn['getString']): SelectOption[] => {
  return [
    { label: getString('pipeline.verification.logs.knownEvent'), value: 'KNOWN_EVENT' },
    { label: getString('pipeline.verification.logs.unknownEvent'), value: 'UNKNOWN_EVENT' },
    { label: getString('pipeline.verification.logs.unexpectedFrequency'), value: 'UNEXPECTED_FREQUENY_EVENT' }
  ]
}
