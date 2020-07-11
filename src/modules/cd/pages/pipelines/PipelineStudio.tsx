import React from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { Icon, Text } from '@wings-software/uikit'
import css from './PipelineStudio.module.scss'
import i18n from './PipelineStudio.i18n'
import { PipelineProvider } from './PipelineContext/PipelineContext'
import { PipelineCanvas } from './PipelineCanvas/PipelineCanvas'
import { routePipelines } from '../../routes'
import { linkTo } from 'framework/exports'

const PipelineStudio = (): JSX.Element => {
  const { accountId, projectIdentifier, orgIdentifier, pipelineIdentifier } = useParams()
  const history = useHistory()
  return (
    <PipelineProvider
      queryParams={{ accountIdentifier: accountId, orgIdentifier, projectIdentifier }}
      pipelineIdentifier={pipelineIdentifier}
    >
      <div className={css.container}>
        <div className={css.leftBar}>
          <div>
            <Icon name="harness" size={29} className={css.logoImage} />
            <Text className={css.title}>{i18n.pipelineStudio}</Text>
          </div>
          <div>
            <div
              style={{ cursor: 'pointer' }}
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
          <Icon name="run-pipeline" title={i18n.runPipeline} />
          <div />
        </div>
      </div>
    </PipelineProvider>
  )
}

export default PipelineStudio
