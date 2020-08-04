import React from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { Icon, Text } from '@wings-software/uikit'
import { linkTo } from 'framework/exports'
import i18n from './PipelineStudio.i18n'
import { PipelineProvider } from './PipelineContext/PipelineContext'
import { PipelineCanvas } from './PipelineCanvas/PipelineCanvas'
import { routePipelines } from '../../routes'
import { RightBar } from './RightBar/RightBar'
import css from './PipelineStudio.module.scss'

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
              className={css.closeBtn}
              title="Dashboard"
              onClick={() => {
                history.push(
                  linkTo(
                    routePipelines,
                    {
                      projectIdentifier: projectIdentifier,
                      orgIdentifier: orgIdentifier
                    },
                    true
                  )
                )
              }}
            >
              <Icon name="cross" margin="xsmall" padding="xsmall" size={21} className={css.logoImage} />
            </div>
          </div>
        </div>
        <PipelineCanvas />
        <RightBar />
      </div>
    </PipelineProvider>
  )
}

export default PipelineStudio
