import React from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { Icon, Text } from '@wings-software/uikit'
import { getCDPipelineStages, stagesMap } from 'modules/cd/components/CDPipelineStages/CDPipelineStages'
import factory from 'modules/cd/components/PipelineSteps/PipelineStepFactory'
import i18n from './PipelineStudio.i18n'
import { PipelineProvider } from './PipelineContext/PipelineContext'
import { PipelineCanvas } from './PipelineCanvas/PipelineCanvas'
import { routeCDPipelines, routePipelineDeploymentList } from '../../routes'
import { RightBar } from './RightBar/RightBar'
import { DefaultNewPipelineId } from './PipelineContext/PipelineActions'
import css from './PipelineStudio.module.scss'

const PipelineStudio: React.FC = ({ children }): JSX.Element => {
  const { accountId, projectIdentifier, orgIdentifier, pipelineIdentifier } = useParams<{
    projectIdentifier: string
    orgIdentifier: string
    accountId: string
    pipelineIdentifier: string
  }>()
  const history = useHistory()
  return (
    <PipelineProvider
      stagesMap={stagesMap}
      queryParams={{ accountIdentifier: accountId, orgIdentifier, projectIdentifier }}
      pipelineIdentifier={pipelineIdentifier}
      renderPipelineStage={getCDPipelineStages}
      stepsFactory={factory}
    >
      <div className={css.container}>
        <div className={css.leftBar}>
          <div>
            <Icon name="harness" size={29} className={css.logoImage} />
            <Text className={css.title}>{i18n.pipelineStudio}</Text>
          </div>
          <div>
            <div
              className={css.closeBtn}
              title="Dashboard"
              onClick={() => {
                if (pipelineIdentifier !== DefaultNewPipelineId) {
                  history.push(
                    routePipelineDeploymentList.url({
                      projectIdentifier,
                      orgIdentifier,
                      pipelineIdentifier
                    })
                  )
                } else {
                  history.push(
                    routeCDPipelines.url({
                      projectIdentifier,
                      orgIdentifier
                    })
                  )
                }
              }}
            >
              <Icon name="cross" margin="xsmall" padding="xsmall" size={21} className={css.logoImage} />
            </div>
          </div>
        </div>
        <PipelineCanvas>{children}</PipelineCanvas>
        <RightBar />
      </div>
    </PipelineProvider>
  )
}

export default PipelineStudio
