import { Button, Color, Container, Heading, Layout, StepProps } from '@wings-software/uikit'
import React from 'react'
import type { Organization } from 'services/cd-ng'
import i18n from './StepCollaborators.i18n'
import css from './Steps.module.scss'

export const StepCollaborators: React.FC<StepProps<Organization>> = ({ previousStep, prevStepData }) => {
  return (
    <Layout.Vertical padding="xxxlarge">
      <Container className={css.collaborators}>
        <Heading level={2} color={Color.GREY_800} margin={{ bottom: 'xxlarge' }}>
          {i18n.title}
        </Heading>
      </Container>
      <Layout.Horizontal padding={{ top: 'xxxlarge' }}>
        <Button text={i18n.back} onClick={() => previousStep?.(prevStepData)} />
      </Layout.Horizontal>
    </Layout.Vertical>
  )
}
