import React from 'react'
import { Color, StepWizard } from '@wings-software/uicore'
import { Connectors } from '@connectors/constants'
import { getConnectorIconByType, getConnectorTitleTextByType } from '@connectors/pages/connectors/utils/ConnectorHelper'
import { useStrings } from 'framework/exports'
import { ImagePath } from './ImagePath'
import { ExampleStep } from './ExampleStep'
import css from './DockerArtifact.module.scss'

export default function ExistingDockerArtifact({
  handleSubmit,
  context,
  handleViewChange,
  initialValues
}: {
  handleSubmit: (data: {
    connectorId: undefined | { value: string }
    imagePath: string
    identifier?: string
    tag?: string
    tagRegex?: string
    tagType?: string
  }) => void
  context: number
  handleViewChange: () => void
  initialValues: any
}): JSX.Element {
  const { getString } = useStrings()
  return (
    <div>
      <StepWizard
        className={css.existingDocker}
        icon={getConnectorIconByType(Connectors.DOCKER)}
        iconProps={{ size: 37, color: Color.WHITE }}
        title={getConnectorTitleTextByType(Connectors.DOCKER)}
      >
        <ExampleStep
          name={getString('overview')}
          context={context}
          handleViewChange={handleViewChange}
          initialValues={initialValues}
        />
        <ImagePath
          name={getString('connectors.stepFourName')}
          handleSubmit={handleSubmit}
          initialValues={initialValues}
        />
      </StepWizard>
    </div>
  )
}
