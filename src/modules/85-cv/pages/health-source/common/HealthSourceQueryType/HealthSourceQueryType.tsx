import React from 'react'
import { FormInput } from '@wings-software/uicore'
import { useStrings } from 'framework/strings'
import type { StringsMap } from 'stringTypes'
import { QueryType } from './HealthSourceQueryType.types'

export const HealthSourceQueryType = (): JSX.Element => {
  const { getString } = useStrings()
  return (
    <FormInput.RadioGroup
      label={getString('cv.componentValidations.queryTypeLabel' as keyof StringsMap)}
      radioGroup={{ inline: true }}
      name="queryType"
      items={[
        {
          label: 'Service Based',
          value: QueryType.SERVICE_BASED
        },
        {
          label: 'Host Based',
          value: QueryType.HOST_BASED
        }
      ]}
    />
  )
}
