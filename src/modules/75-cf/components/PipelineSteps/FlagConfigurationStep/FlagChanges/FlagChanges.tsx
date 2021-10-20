import React, { FC, useState, MouseEvent, useMemo } from 'react'
import { Layout, Button, Heading, FontVariation, ButtonVariation } from '@wings-software/uicore'
import { StringKeys, useStrings } from 'framework/strings'
import type { Segment, TargetAttributesResponse, Variation } from 'services/cf'
import type {
  FlagConfigurationStepFormData,
  FlagConfigurationStepFormDataValues
} from '@cf/components/PipelineSteps/FlagConfigurationStep/types'
import type { SubSectionProps } from './SubSection'
import RemoveSubSectionButton from './RemoveSubSectionButton'
import SubSectionSelector from './SubSectionSelector'

// sub sections
import SetFlagSwitch, { SetFlagSwitchProps } from './subSections/SetFlagSwitch'
import DefaultRules, { DefaultRulesProps } from './subSections/DefaultRules'
import ServeVariationToIndividualTarget from './subSections/ServeVariationToIndividualTarget'
import ServeVariationToTargetGroup from './subSections/ServeVariationToTargetGroup'
import ServePercentageRollout, { ServePercentageRolloutProps } from './subSections/ServePercentageRollout'

export type SubSectionComponentProps = SubSectionProps &
  DefaultRulesProps &
  SetFlagSwitchProps &
  ServePercentageRolloutProps
export type SubSectionComponent = FC<SubSectionComponentProps>

export const allSubSections: SubSectionComponent[] = [
  SetFlagSwitch,
  DefaultRules,
  ServeVariationToIndividualTarget,
  ServeVariationToTargetGroup,
  ServePercentageRollout
]

export interface FlagChangesProps {
  targetGroups?: Segment[]
  variations?: Variation[]
  spec: FlagConfigurationStepFormData['spec']
  clearField: (fieldName: string) => void
  fieldValues: FlagConfigurationStepFormDataValues
  targetAttributes?: TargetAttributesResponse
}

const FlagChanges: FC<FlagChangesProps> = ({
  targetGroups = [],
  variations = [],
  fieldValues,
  spec,
  targetAttributes = [],
  clearField
}) => {
  const [subSections, setSubSections] = useState<SubSectionComponent[]>(() => {
    const initialSubSections: SubSectionComponent[] = []

    Object.entries(spec)
      .filter(([, val]) => val !== undefined)
      .forEach(([key]) => {
        switch (key) {
          case 'state':
            initialSubSections.push(SetFlagSwitch)
            break
          case 'defaultRules':
            initialSubSections.push(DefaultRules)
            break
          case 'percentageRollout':
            initialSubSections.push(ServePercentageRollout)
            break
        }
      })

    return initialSubSections.length ? initialSubSections : [SetFlagSwitch]
  })
  const availableSubSections = useMemo<SubSectionComponent[]>(
    () => allSubSections.filter(section => !subSections.includes(section)),
    [subSections]
  )
  const { getString } = useStrings()

  const subSectionNameMap = useMemo<Map<SubSectionComponent, StringKeys>>(() => {
    const nameMap = new Map<SubSectionComponent, StringKeys>()
    nameMap.set(SetFlagSwitch, 'cf.pipeline.flagConfiguration.setFlagSwitch')
    nameMap.set(DefaultRules, 'cf.featureFlags.rules.defaultRules')
    nameMap.set(ServeVariationToIndividualTarget, 'cf.pipeline.flagConfiguration.serveVariationToIndividualTarget')
    nameMap.set(ServeVariationToTargetGroup, 'cf.pipeline.flagConfiguration.serveVariationToTargetGroup')
    nameMap.set(ServePercentageRollout, 'cf.pipeline.flagConfiguration.servePercentageRollout')

    return nameMap
  }, [])

  const handleConfigureMore = (e: MouseEvent): void => {
    e.preventDefault()
    const [newSubsection] = availableSubSections
    setSubSections([...subSections, newSubsection])
  }

  const removeSubSection = (subSection: SubSectionComponent): void => {
    const newSubSections = [...subSections]
    newSubSections.splice(newSubSections.indexOf(subSection), 1)

    setSubSections(newSubSections)
  }

  const swapSubSection = (currentSubSection: SubSectionComponent, newSubSection: SubSectionComponent): void => {
    const newSubSections = [...subSections]
    newSubSections.splice(newSubSections.indexOf(currentSubSection), 1, newSubSection)

    setSubSections(newSubSections)
  }

  return (
    <Layout.Vertical spacing="medium">
      <Heading level={5} font={{ variation: FontVariation.H5 }}>
        {getString('cf.pipeline.flagConfiguration.flagChanges')}
      </Heading>

      {subSections.map(SubSection => {
        const subSectionProps: SubSectionComponentProps = {
          subSectionSelector: (
            <SubSectionSelector
              subSectionNameMap={subSectionNameMap}
              availableSubSections={availableSubSections}
              currentSubSection={SubSection}
              onSubSectionChange={newSubSection => swapSubSection(SubSection, newSubSection)}
            />
          ),
          clearField,
          variations: variations ?? [],
          targetGroups: targetGroups ?? [],
          fieldValues: fieldValues ?? {},
          targetAttributes: targetAttributes ?? []
        }

        if (subSections.length > 1) {
          subSectionProps.removeSubSectionButton = (
            <RemoveSubSectionButton onClick={() => removeSubSection(SubSection)} />
          )
        }

        return <SubSection key={SubSection.name} {...subSectionProps} />
      })}

      {!!availableSubSections.length && (
        <Button
          variation={ButtonVariation.LINK}
          text={getString('cf.pipeline.flagConfiguration.configureMore')}
          onClick={handleConfigureMore}
          style={{ alignSelf: 'flex-start', padding: 0 }}
        />
      )}
    </Layout.Vertical>
  )
}

export default FlagChanges
