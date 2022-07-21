/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React from 'react'
import { Card, HarnessDocTooltip } from '@wings-software/uicore'
import cx from 'classnames'
import WorkflowVariables from '@pipeline/components/WorkflowVariablesSelection/WorkflowVariables'
import ArtifactsSelection from '@pipeline/components/ArtifactsSelection/ArtifactsSelection'
import ConfigFilesSelection from '@pipeline/components/ConfigFilesSelection/ConfigFilesSelection'
import { getSelectedDeploymentType, isServerlessDeploymentType } from '@pipeline/utils/stageHelpers'
import { useStrings } from 'framework/strings'
import type { ServiceDefinition } from 'services/cd-ng'
import { DeployTabs } from '@pipeline/components/PipelineStudio/CommonUtils/DeployStageSetupShellUtils'
import { usePipelineContext } from '@pipeline/components/PipelineStudio/PipelineContext/PipelineContext'
import type { DeploymentStageElementConfig } from '@pipeline/utils/pipelineTypes'
import VariableListReadOnlyView from '@pipeline/components/WorkflowVariablesSelection/VariableListReadOnlyView'
import { setupMode } from '@cd/components/PipelineSteps/K8sServiceSpec/K8sServiceSpecHelper'
import type { SshWinRmServiceInputFormProps } from '../SshServiceSpecInterface'
import css from '../SshServiceSpec.module.scss'

const getArtifactsHeaderTooltipId = (selectedDeploymentType: ServiceDefinition['type']): string => {
  if (isServerlessDeploymentType(selectedDeploymentType)) {
    return 'serverlessDeploymentTypeArtifacts'
  }
  return 'deploymentTypeArtifacts'
}

const SshServiceSpecEditable: React.FC<SshWinRmServiceInputFormProps> = ({
  initialValues: { stageIndex = 0, setupModeType, deploymentType, isReadonlyServiceMode },
  factory,
  readonly
}) => {
  const { getString } = useStrings()
  const isPropagating = stageIndex > 0 && setupModeType === setupMode.PROPAGATE

  const {
    state: {
      selectionState: { selectedStageId }
    },
    getStageFromPipeline
  } = usePipelineContext()

  const { stage } = getStageFromPipeline<DeploymentStageElementConfig>(selectedStageId || '')
  const selectedDeploymentType = deploymentType ?? getSelectedDeploymentType(stage, getStageFromPipeline, isPropagating)

  return (
    <div className={css.serviceDefinition}>
      {!!selectedDeploymentType && (
        <>
          <Card
            className={css.sectionCard}
            id={getString('pipelineSteps.deploy.serviceSpecifications.deploymentTypes.artifacts')}
          >
            <div
              className={cx(css.tabSubHeading, 'ng-tooltip-native')}
              data-tooltip-id={getArtifactsHeaderTooltipId(selectedDeploymentType)}
            >
              {getString('pipelineSteps.deploy.serviceSpecifications.deploymentTypes.artifacts')}
              <HarnessDocTooltip tooltipId={getArtifactsHeaderTooltipId(selectedDeploymentType)} useStandAlone={true} />
            </div>
            <ArtifactsSelection
              isPropagating={isPropagating}
              deploymentType={selectedDeploymentType}
              isReadonlyServiceMode={isReadonlyServiceMode as boolean}
              readonly={!!readonly}
            />
          </Card>
          <Card className={css.sectionCard} id={getString('pipelineSteps.configFiles')}>
            <div
              className={cx(css.tabSubHeading, 'ng-tooltip-native')}
              data-tooltip-id={getArtifactsHeaderTooltipId(selectedDeploymentType)}
            >
              {getString('pipelineSteps.configFiles')}
            </div>
            <ConfigFilesSelection isPropagating={isPropagating} deploymentType={selectedDeploymentType} />
          </Card>
        </>
      )}

      <div className={css.accordionTitle}>
        <div className={css.tabHeading} id="advanced">
          {getString('advancedTitle')}
        </div>
        <Card className={css.sectionCard} id={getString('common.variables')}>
          <div className={css.tabSubHeading}>{getString('common.variables')}</div>
          {isReadonlyServiceMode ? (
            <VariableListReadOnlyView />
          ) : (
            <WorkflowVariables
              tabName={DeployTabs.SERVICE}
              formName={'addEditServiceCustomVariableForm'}
              factory={factory as any}
              isPropagating={isPropagating}
              readonly={!!readonly}
            />
          )}
        </Card>
      </div>
    </div>
  )
}

export default SshServiceSpecEditable