import React from 'react'
import { Container, Layout, Icon, Color, Text } from '@wings-software/uikit'
import { NavLink, useParams } from 'react-router-dom'
import { Page } from 'modules/common/exports'
import {
  routePipelineDeploymentList,
  routeInputSetList,
  routeCDPipelineStudio,
  routeCDPipelines
} from 'modules/cd/routes'
import { useGetPipeline } from 'services/cd-ng'
import i18n from './PipelineDetails.i18n'
import css from './PipelineDetails.module.scss'

const PipelineDetails: React.FC = ({ children }): JSX.Element => {
  const { orgIdentifier, projectIdentifier, pipelineIdentifier, accountId } = useParams()
  const { data: pipeline, loading } = useGetPipeline({
    pipelineIdentifier,
    queryParams: { accountIdentifier: accountId, orgIdentifier, projectIdentifier }
  })
  return (
    <>
      <Page.Header
        title={
          <Layout.Vertical spacing="xsmall">
            <span>
              <NavLink className={css.link} to={routeCDPipelines.url({ orgIdentifier, projectIdentifier })}>
                {i18n.title}
              </NavLink>
              &nbsp;/
            </span>
            {!loading && <Text>{(pipeline?.data?.cdPipeline as any)?.pipeline.name}</Text>}
          </Layout.Vertical>
        }
        toolbar={
          <Container>
            <Layout.Horizontal spacing="medium">
              <NavLink
                className={css.tags}
                activeClassName={css.activeTag}
                to={routePipelineDeploymentList.url({ orgIdentifier, projectIdentifier, pipelineIdentifier })}
              >
                {i18n.executions}
              </NavLink>

              <NavLink
                className={css.tags}
                activeClassName={css.activeTag}
                to={routeInputSetList.url({ orgIdentifier, projectIdentifier, pipelineIdentifier })}
              >
                {i18n.inputSets}
              </NavLink>

              <NavLink
                className={css.tags}
                to={routeCDPipelineStudio.url({ orgIdentifier, projectIdentifier, pipelineIdentifier })}
              >
                <Icon name="pipeline-ng" size={20} style={{ marginRight: '8px' }} color={Color.BLUE_600} />
                {i18n.Studio}
              </NavLink>
            </Layout.Horizontal>
          </Container>
        }
      />
      <Page.Body>{children}</Page.Body>
    </>
  )
}

export default PipelineDetails
