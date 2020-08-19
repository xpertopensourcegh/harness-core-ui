import React from 'react'
import { Container, Button, Layout } from '@wings-software/uikit'
import { useHistory, useParams } from 'react-router-dom'
import { Page } from 'modules/common/exports'
import { routeCDPipelineStudio } from 'modules/cd/routes'
import { useGetPipelineList, CDPipelineSummaryResponseDTO } from 'services/cd-ng'
import i18n from './CDPipelinesPage.i18n'
import { PipelineCard } from './views/PipelineCard/PipelineCard'

const CDPipelinesPage: React.FC = () => {
  const history = useHistory()
  const { projectIdentifier, orgIdentifier, accountId } = useParams()

  const goToPipeline = React.useCallback(
    (pipelineIdentifier = '-1') => {
      history.push(
        routeCDPipelineStudio.url({
          projectIdentifier,
          orgIdentifier,
          pipelineIdentifier
        })
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
          center
          gutter={30}
          width={900}
          items={data?.data?.content || []}
          renderItem={(item: CDPipelineSummaryResponseDTO) => (
            <PipelineCard pipeline={item} onClick={() => goToPipeline(item.identifier)} />
          )}
          keyOf={(item: CDPipelineSummaryResponseDTO) => item.identifier}
        />
      </Page.Body>
    </>
  )
}

export default CDPipelinesPage
