import { Card, Layout } from '@wings-software/uicore'
import React from 'react'
import cx from 'classnames'
import { PipelineContext } from '@pipeline/components/PipelineStudio/PipelineContext/PipelineContext'
import { FailureStrategyWithRef } from '@pipeline/components/PipelineStudio/FailureStrategy/FailureStrategy'
import type { StepFormikRef } from '@pipeline/components/PipelineStudio/StepCommands/StepCommands'
import SkipCondition from '@pipeline/components/PipelineStudio/SkipCondition/SkipCondition'
import { useStrings } from 'framework/exports'
import css from './DeployAdvancedSpecifications.module.scss'

export interface AdvancedSpecifications {
  context?: string
}
const DeployAdvancedSpecifications: React.FC<AdvancedSpecifications> = ({
  children,
  context = 'setup'
}): JSX.Element => {
  const { getString } = useStrings()

  const {
    state: {
      pipeline,
      selectionState: { selectedStageId }
    },
    isReadonly,
    getStageFromPipeline,
    updatePipeline
  } = React.useContext(PipelineContext)
  const { stage } = getStageFromPipeline(selectedStageId || '')

  const formikRef = React.useRef<StepFormikRef | null>(null)
  const scrollRef = React.useRef<HTMLDivElement | null>(null)

  return (
    <div className={cx(css.stageSection, { [css.editStageGrid]: context, [css.createStageGrid]: !context })}>
      <div className={cx({ [css.contentSection]: context })} ref={scrollRef}>
        {context && (
          <>
            <div className={css.tabHeading}>{getString('skipConditionsTitle')}</div>
            <Card className={css.sectionCard} id="skipCondition">
              <Layout.Horizontal>
                <div className={css.stageSection}>
                  <div className={cx({ [css.stageCreate]: true, [css.stageDetails]: !!context })}>
                    <SkipCondition
                      isReadonly={isReadonly}
                      selectedStage={stage || {}}
                      onUpdate={({ skipCondition }) => {
                        const { stage: pipelineStage } = getStageFromPipeline(selectedStageId || '')
                        if (pipelineStage && pipelineStage.stage) {
                          pipelineStage.stage.skipCondition = skipCondition?.trim()
                          updatePipeline(pipeline)
                        }
                      }}
                    />
                  </div>
                </div>
              </Layout.Horizontal>
            </Card>
            <div className={css.tabHeading}>Failure Strategy</div>
            <Card className={css.sectionCard} id="failureStrategy">
              <Layout.Horizontal>
                <div className={css.stageSection}>
                  <div className={cx({ [css.stageCreate]: true, [css.stageDetails]: !!context })}>
                    <FailureStrategyWithRef
                      selectedStage={stage}
                      isReadonly={isReadonly}
                      ref={formikRef}
                      onUpdate={({ failureStrategies }) => {
                        const { stage: pipelineStage } = getStageFromPipeline(selectedStageId || '')
                        if (pipelineStage && pipelineStage.stage) {
                          pipelineStage.stage.failureStrategies = failureStrategies
                          updatePipeline(pipeline)
                        }
                      }}
                    />
                  </div>
                </div>
              </Layout.Horizontal>
            </Card>
          </>
        )}
        <div className={cx(css.navigationButtons, { [css.createModal]: !context })}>{children}</div>
      </div>
    </div>
  )
}

export default DeployAdvancedSpecifications
