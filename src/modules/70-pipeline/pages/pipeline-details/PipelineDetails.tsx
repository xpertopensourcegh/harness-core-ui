import React from 'react'
import { Container, Layout, Icon, Color } from '@wings-software/uikit'
import { NavLink, useParams } from 'react-router-dom'
import { Page } from '@common/exports'
import {
  routePipelineDeploymentList,
  routeInputSetList,
  routeTriggersPage,
  routeCDPipelineStudio,
  routeCDPipelines,
  routeCDDashboard
} from 'navigation/cd/routes'
import { useGetPipelineSummary } from 'services/cd-ng'
import { Breadcrumbs } from '@common/components/Breadcrumbs/Breadcrumbs'
import { useAppStoreReader, useStrings } from 'framework/exports'
import i18n from './PipelineDetails.i18n'
import css from './PipelineDetails.module.scss'

export default function PipelineDetails({ children }: React.PropsWithChildren<{}>): React.ReactElement {
  const { orgIdentifier, projectIdentifier, pipelineIdentifier, accountId } = useParams<{
    projectIdentifier: string
    orgIdentifier: string
    accountId: string
    pipelineIdentifier: string
  }>()
  const { data: pipeline } = useGetPipelineSummary({
    pipelineIdentifier,
    queryParams: { accountIdentifier: accountId, orgIdentifier, projectIdentifier }
  })
  const { projects } = useAppStoreReader()
  const project = projects.find(({ identifier }) => identifier === projectIdentifier)
  const { getString } = useStrings()

  return (
    <>
      <Page.Header
        title={
          <Layout.Vertical spacing="xsmall">
            <Breadcrumbs
              links={[
                { url: routeCDDashboard.url({ orgIdentifier, projectIdentifier }), label: project?.name as string },
                { url: routeCDPipelines.url({ orgIdentifier, projectIdentifier }), label: getString('pipelines') },
                { url: '#', label: pipeline?.data?.name || '' }
              ]}
            />
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
                activeClassName={css.activeTag}
                to={routeTriggersPage.url({ orgIdentifier, projectIdentifier, pipelineIdentifier })}
              >
                {i18n.triggers}
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
