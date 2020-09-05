import { Button, Color, Container, Heading, StepProps } from '@wings-software/uikit'
import React from 'react'
import type { Organization } from 'services/cd-ng'
import type { OrganizationModalInteraction } from '../OrganizationModalUtils'
import i18n from './StepCollaborators.i18n'

export const StepCollaborators: React.FC<StepProps<Organization> & OrganizationModalInteraction> = ({
  previousStep
}) => {
  return (
    <Container padding={{ top: 'large', right: 'large', left: 'large' }}>
      <Heading level={2} color={Color.GREY_800} margin={{ bottom: 'xxlarge' }}>
        {i18n.title}
      </Heading>
      <Button minimal text={i18n.back} icon="chevron-left" onClick={() => previousStep?.()} />
    </Container>
  )
}
