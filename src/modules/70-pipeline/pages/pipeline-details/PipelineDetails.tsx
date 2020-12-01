import React from 'react'
import { Container, Layout, Icon, Color } from '@wings-software/uikit'
import { NavLink, useParams } from 'react-router-dom'
import { Page } from '@common/exports'
import routes from '@common/RouteDefinitions'
import { useGetPipelineSummary } from 'services/cd-ng'
import { Breadcrumbs } from '@common/components/Breadcrumbs/Breadcrumbs'
import { useAppStore, useStrings } from 'framework/exports'
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
  const { projects } = useAppStore()
  const project = projects.find(({ identifier }) => identifier === projectIdentifier)
  const { getString } = useStrings()

  return (
    <>
      <Page.Header
        title={
          <Layout.Vertical spacing="xsmall">
            <Breadcrumbs
              links={[
                {
                  url: routes.toCDDashboard({ orgIdentifier, projectIdentifier, accountId }),
                  label: project?.name as string
                },
                {
                  url: routes.toCDPipelines({ orgIdentifier, projectIdentifier, accountId }),
                  label: getString('pipelines')
                },
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
                to={routes.toCDPipelineDeploymentList({
                  orgIdentifier,
                  projectIdentifier,
                  pipelineIdentifier,
                  accountId
                })}
              >
                {i18n.executions}
              </NavLink>

              <NavLink
                className={css.tags}
                activeClassName={css.activeTag}
                to={routes.toCDInputSetList({ orgIdentifier, projectIdentifier, pipelineIdentifier, accountId })}
              >
                {i18n.inputSets}
              </NavLink>
              <NavLink
                className={css.tags}
                activeClassName={css.activeTag}
                to={routes.toCDTriggersPage({ orgIdentifier, projectIdentifier, pipelineIdentifier, accountId })}
              >
                {i18n.triggers}
              </NavLink>

              <NavLink
                className={css.tags}
                to={routes.toCDPipelineStudio({ orgIdentifier, projectIdentifier, pipelineIdentifier, accountId })}
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
