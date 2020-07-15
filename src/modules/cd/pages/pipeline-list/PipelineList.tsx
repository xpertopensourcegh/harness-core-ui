import React from 'react'
import { Page } from 'modules/common/exports'
import i18n from './PipelineList.i18n'
import { Container, Button, Layout } from '@wings-software/uikit'
import { useHistory, useParams } from 'react-router-dom'
import { routePipelineCanvas } from 'modules/cd/routes'
import { linkTo } from 'framework/exports'
import css from './PipelineList.module.scss'
import { useGetPipelineList, CDPipelineDTO } from 'services/cd-ng'
import { PipelineCard } from './views/PipelineCard/PipelineCard'

const PipelineList: React.FC = () => {
  const history = useHistory()
  const { projectIdentifier, orgIdentifier, accountId } = useParams()

  const goToPipeline = React.useCallback(
    (pipelineIdentifier = '-1') => {
      history.push(
        linkTo(
          routePipelineCanvas,
          {
            projectIdentifier,
            orgIdentifier,
            pipelineIdentifier
          },
          true
        )
      )
    },
    [projectIdentifier, orgIdentifier, history]
  )

  const { loading, data, refetch: reloadPipelines, error } = useGetPipelineList({
    queryParams: {
      accountIdentifier: accountId,
      projectIdentifier,
      orgIdentifier
    }
  })

  return (
    <>
      <Page.Header
        title={i18n.pipelines.toUpperCase()}
        toolbar={
          <Container>
            <Button minimal intent="primary" text={i18n.addPipeline} icon="add" onClick={() => goToPipeline()} />
          </Container>
        }
      />
      <Page.Body
        loading={loading}
        error={error?.message}
        retryOnError={() => reloadPipelines()}
        noData={{
          when: () => !data?.data?.content?.length,
          icon: 'nav-project',
          message: i18n.aboutPipeline,
          buttonText: i18n.addPipeline,
          onClick: () => goToPipeline()
        }}
      >
        <Layout.Masonry
          gutter={30}
          width={900}
          className={css.centerContainer}
          items={data?.data?.content || []}
          renderItem={(pipeline: CDPipelineDTO) => (
            <PipelineCard pipeline={pipeline} onClick={() => goToPipeline(pipeline.identifier)} />
          )}
          keyOf={(pipeline: CDPipelineDTO) => pipeline.identifier}
        />
      </Page.Body>
    </>
  )
}

export default PipelineList
