import React, { FC, useMemo } from 'react'
import { useStrings } from 'framework/strings'
import type { Segment, Variation } from 'services/cf'
import type { FlagConfigurationStepFormDataValues } from '@cf/components/PipelineSteps/FlagConfigurationStep/types'
import SubSection, { SubSectionProps } from '../SubSection'
import ServeVariationToItem from './ServeVariationToItem'

export interface ServeVariationToTargetGroupProps extends SubSectionProps {
  clearField: (fieldName: string) => void
  setField: (fieldName: string, value: unknown) => void
  variations?: Variation[]
  targetGroups?: Segment[]
  fieldValues?: FlagConfigurationStepFormDataValues
}

const ServeVariationToTargetGroup: FC<ServeVariationToTargetGroupProps> = ({
  fieldValues = {},
  variations = [],
  targetGroups = [],
  setField,
  clearField,
  ...props
}) => {
  const { getString } = useStrings()

  const [selectedVariation, selectedVariationIndex] = useMemo<[Variation | undefined, number]>(() => {
    const position = variations?.findIndex(
      ({ identifier }) => identifier === fieldValues?.spec?.serveVariationToTargetGroup?.include?.variation
    )

    return [position >= 0 ? variations[position] : undefined, position]
  }, [fieldValues?.spec?.serveVariationToTargetGroup?.include?.variation, variations])

  const selectedTargetGroups = useMemo<Segment[]>(
    () =>
      fieldValues?.spec?.serveVariationToTargetGroup?.include?.targetGroups.length
        ? targetGroups?.filter(({ identifier }) =>
            fieldValues?.spec?.serveVariationToTargetGroup?.include?.targetGroups.includes(identifier)
          )
        : [],
    [targetGroups, fieldValues?.spec?.serveVariationToTargetGroup?.include?.targetGroups]
  )

  return (
    <SubSection data-testid="flagChanges-serveVariationToTargetGroup" {...props}>
      <ServeVariationToItem
        dialogTitle={getString('cf.pipeline.flagConfiguration.addEditVariationToTargetGroups')}
        itemLabel={getString('cf.shared.segments')}
        itemPlaceholder={getString('cf.pipeline.flagConfiguration.enterTargetGroup')}
        itemFieldName="targetGroups"
        specPrefix="spec.serveVariationToTargetGroup.include"
        serveItemString={getString('cf.pipeline.flagConfiguration.toTargetGroup')}
        serveItemsString={getString('cf.pipeline.flagConfiguration.toTargetGroups')}
        clearField={clearField}
        setField={setField}
        items={targetGroups}
        selectedItems={selectedTargetGroups}
        variations={variations}
        selectedVariation={selectedVariation}
        selectedVariationIndex={selectedVariationIndex}
      />
    </SubSection>
  )
}

export default ServeVariationToTargetGroup
