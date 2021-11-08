import React, { FC, useMemo } from 'react'
import { useStrings } from 'framework/strings'
import type { Target, Variation } from 'services/cf'
import type { FlagConfigurationStepFormDataValues } from '@cf/components/PipelineSteps/FlagConfigurationStep/types'
import SubSection, { SubSectionProps } from '../SubSection'
import ServeVariationToItem from './ServeVariationToItem'

export interface ServeVariationToIndividualTargetProps extends SubSectionProps {
  clearField: (fieldName: string) => void
  setField: (fieldName: string, value: unknown) => void
  variations?: Variation[]
  targets?: Target[]
  fieldValues?: FlagConfigurationStepFormDataValues
}

const ServeVariationToIndividualTarget: FC<ServeVariationToIndividualTargetProps> = ({
  fieldValues = {},
  variations = [],
  targets = [],
  setField,
  clearField,
  ...props
}) => {
  const { getString } = useStrings()

  const [selectedVariation, selectedVariationIndex] = useMemo<[Variation | undefined, number]>(() => {
    const position = variations?.findIndex(
      ({ identifier }) => identifier === fieldValues?.spec?.serveVariationToIndividualTarget?.include?.variation
    )

    return [position >= 0 ? variations[position] : undefined, position]
  }, [fieldValues?.spec?.serveVariationToIndividualTarget?.include?.variation, variations])

  const selectedTargets = useMemo<Target[]>(
    () =>
      targets?.filter(({ identifier }) =>
        (fieldValues?.spec?.serveVariationToIndividualTarget?.include?.targets || []).includes(identifier)
      ),
    [targets, fieldValues?.spec?.serveVariationToIndividualTarget?.include?.targets]
  )

  return (
    <SubSection data-testid="flagChanges-serveVariationToIndividualTarget" {...props}>
      <ServeVariationToItem
        dialogTitle={getString('cf.pipeline.flagConfiguration.addEditVariationToSpecificTargets')}
        itemLabel={getString('cf.shared.targets')}
        itemPlaceholder={getString('cf.pipeline.flagConfiguration.enterTarget')}
        itemFieldName="targets"
        specPrefix="spec.serveVariationToIndividualTarget.include"
        serveItemString={getString('cf.featureFlags.toTarget')}
        serveItemsString={getString('cf.pipeline.flagConfiguration.toTargets')}
        clearField={clearField}
        setField={setField}
        items={targets}
        selectedItems={selectedTargets}
        variations={variations}
        selectedVariation={selectedVariation}
        selectedVariationIndex={selectedVariationIndex}
      />
    </SubSection>
  )
}

export default ServeVariationToIndividualTarget
