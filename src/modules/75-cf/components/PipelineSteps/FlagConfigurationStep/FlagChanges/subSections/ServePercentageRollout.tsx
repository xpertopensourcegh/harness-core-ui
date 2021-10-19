import React, { FC, useEffect } from 'react'
import type { Segment, TargetAttributesResponse, Variation } from 'services/cf'
import PercentageRollout from '@cf/components/PercentageRollout/PercentageRollout'
import type { FlagConfigurationStepFormDataValues } from '@cf/components/PipelineSteps/FlagConfigurationStep/types'
import SubSection, { SubSectionProps } from '../SubSection'

export interface ServePercentageRolloutProps extends SubSectionProps {
  targetGroups?: Segment[]
  variations?: Variation[]
  fieldValues?: FlagConfigurationStepFormDataValues
  targetAttributes?: TargetAttributesResponse
  clearField: (fieldName: string) => void
}

const ServePercentageRollout: FC<ServePercentageRolloutProps> = ({
  variations = [],
  targetGroups = [],
  fieldValues,
  targetAttributes = [],
  clearField,
  ...props
}) => {
  const pruneVariationFields = (): void =>
    Object.keys(fieldValues?.spec?.percentageRollout?.variation || {}).forEach(fieldKey => {
      if (!variations?.find(({ identifier }) => identifier === fieldKey)) {
        clearField(`spec.percentageRollout.variation.${fieldKey}`)
      }
    })

  const clearAllFields = (): void => {
    clearField('spec.percentageRollout.targetGroup')
    clearField('spec.percentageRollout.bucketBy')
    pruneVariationFields()
  }

  useEffect(() => clearAllFields, [])

  useEffect(() => {
    if (variations?.length) {
      pruneVariationFields()
    }
  }, [variations])

  return (
    <SubSection data-testid="flagChanges-servePercentageRollout" {...props}>
      <PercentageRollout
        targetGroups={targetGroups}
        variations={variations}
        fieldValues={fieldValues?.spec?.percentageRollout}
        namePrefix="spec.percentageRollout"
        bucketByAttributes={targetAttributes}
      />
    </SubSection>
  )
}

export default ServePercentageRollout
