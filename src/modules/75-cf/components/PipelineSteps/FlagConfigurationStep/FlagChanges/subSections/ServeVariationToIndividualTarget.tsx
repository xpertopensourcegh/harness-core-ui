import React, { FC, useEffect, useMemo, useState } from 'react'
import { AvatarGroup, AvatarGroupProps, Button, ButtonVariation, Layout, Text } from '@wings-software/uicore'
import { useStrings } from 'framework/strings'
import type { Target, Variation } from 'services/cf'
import type { FlagConfigurationStepFormDataValues } from '@cf/components/PipelineSteps/FlagConfigurationStep/types'
import { VariationWithIcon } from '@cf/components/VariationWithIcon/VariationWithIcon'
import SubSection, { SubSectionProps } from '../SubSection'
import IncludeTargetVariationDialog, { IncludeTargetVariationDialogProps } from './IncludeTargetVariationDialog'
import css from './ServeVariationToIndividualTarget.module.scss'

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
  const [targetVariationDialogOpen, setTargetVariationDialogOpen] = useState<boolean>(false)

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

  const avatars = useMemo<AvatarGroupProps['avatars']>(
    () => selectedTargets.map(({ name, identifier }) => ({ name, id: identifier })),
    [selectedTargets]
  )

  const handleIncludeChange: IncludeTargetVariationDialogProps['onChange'] = (newTargets, newVariation) => {
    setField('spec.serveVariationToIndividualTarget.include.variation', newVariation.identifier)
    setField(
      'spec.serveVariationToIndividualTarget.include.targets',
      newTargets.map(({ identifier }) => identifier)
    )
  }

  const handleCloseDialog: IncludeTargetVariationDialogProps['closeDialog'] = () => {
    setTargetVariationDialogOpen(false)
  }

  useEffect(
    () => () => {
      clearField('spec.serveVariationToIndividualTarget.include.variation')
      clearField('spec.serveVariationToIndividualTarget.include.targets')
    },
    []
  )

  return (
    <SubSection data-testid="flagChanges-serveVariationToIndividualTarget" {...props}>
      {selectedVariation && selectedTargets.length && (
        <Layout.Vertical spacing="medium" border={{ bottom: true }} padding={{ bottom: 'medium' }}>
          <p className={css.variationParagraph}>
            {getString('cf.pipeline.flagConfiguration.serve')}
            <VariationWithIcon
              textStyle={{ fontWeight: 'bold' }}
              variation={selectedVariation}
              index={selectedVariationIndex}
            />
            {getString(
              selectedTargets.length > 1 ? 'cf.pipeline.flagConfiguration.toTargets' : 'cf.featureFlags.toTarget'
            )}
            :
          </p>
          <div className={css.avatars}>
            <AvatarGroup avatars={avatars} restrictLengthTo={15} />
            <Text>({selectedTargets.length})</Text>
          </div>
        </Layout.Vertical>
      )}

      <span>
        <Button
          className={css.addButton}
          variation={ButtonVariation.LINK}
          text={getString('cf.pipeline.flagConfiguration.addEditVariationToSpecificTargets')}
          onClick={e => {
            e.preventDefault()
            setTargetVariationDialogOpen(true)
          }}
        />
      </span>

      <IncludeTargetVariationDialog
        isOpen={targetVariationDialogOpen}
        targets={targets}
        variations={variations}
        closeDialog={handleCloseDialog}
        selectedVariation={selectedVariation}
        selectedTargets={selectedTargets}
        onChange={handleIncludeChange}
      />
    </SubSection>
  )
}

export default ServeVariationToIndividualTarget
