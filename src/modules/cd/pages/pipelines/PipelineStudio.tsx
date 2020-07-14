import React from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { Icon, Text } from '@wings-software/uikit'
import css from './PipelineStudio.module.scss'
import i18n from './PipelineStudio.i18n'
import { PipelineProvider, PipelineContext } from './PipelineContext/PipelineContext'
import { PipelineCanvas } from './PipelineCanvas/PipelineCanvas'
import { routePipelines } from '../../routes'
import { linkTo } from 'framework/exports'
import { usePostPipelineExecute } from 'services/cd-ng'

const PipelineStudioInner = (): JSX.Element => {
  const { accountId, projectIdentifier, orgIdentifier } = useParams()

  const {
    state: { isUpdated, pipeline }
  } = React.useContext(PipelineContext)
  const { mutate: runPipeline } = usePostPipelineExecute({
    queryParams: { accountIdentifier: accountId, projectIdentifier, orgIdentifier },
    identifier: pipeline.identifier || ''
  })
  const history = useHistory()

  const handleRunPipeline = React.useCallback(async () => {
    if (!isUpdated) {
      const response = await runPipeline()
      if (response.status === 'SUCCESS') {
        alert('Pipeline Started SuccessFully')
      }
    } else {
      alert('Please save the pipeline first')
    }
  }, [runPipeline, isUpdated])

  return (
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
              history.push(
                linkTo(routePipelines, {
                  projectIdentifier: projectIdentifier,
                  orgIdentifier: orgIdentifier
                })
              )
            }}
          >
            <Icon name="cross" margin="xsmall" padding="xsmall" size={21} className={css.logoImage} />
          </div>
        </div>
      </div>
      <PipelineCanvas />
      <div className={css.rightBar}>
        <div />
        <Icon name="template-library" title={i18n.templateLibrary} />
        <Icon name="pipeline-variables" title={i18n.inputVariables} />
        <Icon name="run-pipeline" title={i18n.runPipeline} onClick={handleRunPipeline} />
        <div />
      </div>
    </div>
  )
}

const PipelineStudio = (): JSX.Element => {
  const { accountId, projectIdentifier, orgIdentifier, pipelineIdentifier } = useParams()

  return (
    <PipelineProvider
      queryParams={{ accountIdentifier: accountId, orgIdentifier, projectIdentifier }}
      pipelineIdentifier={pipelineIdentifier}
    >
      <PipelineStudioInner />
    </PipelineProvider>
  )
}

export default PipelineStudio
