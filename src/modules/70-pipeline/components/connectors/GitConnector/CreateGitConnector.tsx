import React, { useState } from 'react'
import { StepWizard } from '@wings-software/uicore'
import type { NgPipeline } from 'services/cd-ng'
import { Connectors } from '@connectors/constants'
import VerifyOutOfClusterDelegate from '@connectors/common/VerifyOutOfClusterDelegate/VerifyOutOfClusterDelegate'

import type { StageElementWrapper } from 'services/cd-ng'
import ConnectorDetailsStep from '@connectors/components/CreateConnector/commonSteps/ConnectorDetailsStep'
import GitDetailsStep from '@connectors/components/CreateConnector/commonSteps/GitDetailsStep'
import StepGitAuthentication from '@connectors/components/CreateConnector/GitConnector/StepAuth/StepGitAuthentication'
import { getConnectorIconByType, getConnectorTitleIdByType } from '@connectors/pages/connectors/utils/ConnectorHelper'
import { useStrings } from 'framework/exports'
import css from './CreateGitConnector.module.scss'

interface CreateGITConnectorProps {
  accountId: string
  projectIdentifier: string
  orgIdentifier: string
  hideLightModal: () => void
  onSuccess: () => void
  pipeline: NgPipeline
  updatePipeline: (pipeline: NgPipeline) => Promise<void>
  isForOverrideSets?: boolean
  identifierName?: string
  stage: StageElementWrapper | undefined
  isForPredefinedSets?: boolean
}

const CreateGitConnector = (props: CreateGITConnectorProps): JSX.Element => {
  const { getString } = useStrings()
  const { accountId, orgIdentifier, projectIdentifier } = props
  const [isEditMode, setIsEditMode] = useState<boolean>(false)

  return (
    <>
      <StepWizard
        className={css.wrapper}
        icon={getConnectorIconByType(Connectors.GIT)}
        iconProps={{ size: 50 }}
        title={getString(getConnectorTitleIdByType(Connectors.GIT))}
      >
        <ConnectorDetailsStep
          type={Connectors.GIT}
          name={getString('overview')}
          isEditMode={isEditMode}
          connectorInfo={undefined}
        />
        <GitDetailsStep
          type={Connectors.GIT}
          name={getString('details')}
          isEditMode={isEditMode}
          connectorInfo={undefined}
        />
        <StepGitAuthentication
          name={getString('credentials')}
          onConnectorCreated={() => {
            // Handle on success
          }}
          isEditMode={isEditMode}
          setIsEditMode={setIsEditMode}
          connectorInfo={undefined}
          accountId={accountId}
          orgIdentifier={orgIdentifier}
          projectIdentifier={projectIdentifier}
        />
        <VerifyOutOfClusterDelegate
          name={getString('connectors.stepThreeName')}
          connectorIdentifier={''}
          setIsEditMode={() => setIsEditMode(true)}
          isStep={true}
          isLastStep={false}
          type={Connectors.GIT}
        />
      </StepWizard>
    </>
  )
}

export default CreateGitConnector
