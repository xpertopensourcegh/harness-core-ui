import React from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { Link, Icon, Text } from '@wings-software/uikit'
import css from './PipelineStudio.module.scss'
import i18n from './PipelineStudio.i18n'
import { PipelineProvider } from './PipelineContext/PipelineContext'
import { PipelineCanvas } from './PipelineCanvas/PipelineCanvas'

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
            <Link noStyling title="Dashboard" href="/">
              <Icon name="harness" size={29} className={css.logoImage} />
            </Link>
            <Text className={css.title}>{i18n.pipelineStudio}</Text>
          </div>
          <div>
            <div style={{ cursor: 'pointer' }} title="Dashboard" onClick={() => history.goBack()}>
              <Icon name="cross" margin="xsmall" padding="xsmall" size={21} className={css.logoImage} />
            </div>
          </div>
        </div>
        <PipelineCanvas />
        <div className={css.rightBar}></div>
      </div>
    </PipelineProvider>
  )
}

export default PipelineStudio
