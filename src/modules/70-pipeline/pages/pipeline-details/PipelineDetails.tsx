import React from 'react'
import { Container, Layout, Icon, Color } from '@wings-software/uikit'
import { NavLink, useParams } from 'react-router-dom'
import { Page } from '@common/exports'
import routes from '@common/RouteDefinitions'
import { useGetPipelineSummary } from 'services/cd-ng'
import { Breadcrumbs } from '@common/components/Breadcrumbs/Breadcrumbs'
import { useAppStore, useStrings } from 'framework/exports'
import type { PipelinePathProps } from '@common/interfaces/RouteInterfaces'
import css from './PipelineDetails.module.scss'

export default function PipelineDetails({ children }: React.PropsWithChildren<{}>): React.ReactElement {
  const { orgIdentifier, projectIdentifier, pipelineIdentifier, accountId } = useParams<PipelinePathProps>()
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
                  url: routes.toCDProjectOverview({ orgIdentifier, projectIdentifier, accountId }),
                  label: project?.name as string
                },
                {
                  url: routes.toCDPipelines({
                    orgIdentifier,
                    projectIdentifier,
                    accountId
                  }),
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
                {getString('executionsText')}
              </NavLink>

              <NavLink
                className={css.tags}
                activeClassName={css.activeTag}
                to={routes.toCDInputSetList({ orgIdentifier, projectIdentifier, pipelineIdentifier, accountId })}
              >
                {getString('inputSetsText')}
              </NavLink>
              <NavLink
                className={css.tags}
                activeClassName={css.activeTag}
                to={routes.toCDTriggersPage({ orgIdentifier, projectIdentifier, pipelineIdentifier, accountId })}
              >
                {getString('pipeline-triggers.triggersLabel')}
              </NavLink>

              <NavLink
                className={css.tags}
                to={routes.toCDPipelineStudio({ orgIdentifier, projectIdentifier, pipelineIdentifier, accountId })}
              >
                <Icon name="pipeline-ng" size={20} style={{ marginRight: '8px' }} color={Color.BLUE_600} />
                {getString('studioText')}
              </NavLink>
            </Layout.Horizontal>
          </Container>
        }
      />
      <Page.Body>{children}</Page.Body>
    </>
  )
}
