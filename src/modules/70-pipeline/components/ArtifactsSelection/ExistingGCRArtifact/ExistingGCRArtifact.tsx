import React from 'react'
import { StepWizard } from '@wings-software/uicore'
import { getConnectorIconByType, getConnectorTitleIdByType } from '@connectors/pages/connectors/utils/ConnectorHelper'
import { useStrings } from 'framework/exports'
import { GCRDetailStep } from './GCRDetailStep'
import { GCRImagePath } from '../ArtifactRepository/GCRImagePath'
import css from './GCRArtifact.module.scss'

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
        icon={getConnectorIconByType('Gcr')}
        iconProps={{ size: 37 }}
        title={getString(getConnectorTitleIdByType('Gcr'))}
      >
        <GCRDetailStep name={getString('overview')} handleViewChange={handleViewChange} initialValues={initialValues} />
        <GCRImagePath
          name={getString('connectors.stepFourName')}
          context={context}
          handleSubmit={handleSubmit}
          initialValues={initialValues}
        />
      </StepWizard>
    </div>
  )
}
