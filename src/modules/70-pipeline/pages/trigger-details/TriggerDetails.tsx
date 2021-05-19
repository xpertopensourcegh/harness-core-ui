import React from 'react'
import { Container, Layout } from '@wings-software/uicore'
import { NavLink, useParams } from 'react-router-dom'
import { Page } from '@common/exports'
import routes from '@common/RouteDefinitions'
import {
  useGetPipelineSummary,
  useGetTrigger,
  ResponseNGTriggerResponse,
  ResponsePMSPipelineSummaryResponse
} from 'services/pipeline-ng'
import { useDocumentTitle } from '@common/hooks/useDocumentTitle'
import { Breadcrumbs } from '@common/components/Breadcrumbs/Breadcrumbs'
import { useStrings } from 'framework/strings'
import { useAppStore } from 'framework/AppStore/AppStoreContext'
import type { GitQueryParams, PipelineType } from '@common/interfaces/RouteInterfaces'
import { useQueryParams } from '@common/hooks'
import css from './TriggerDetails.module.scss'

export const TriggerBreadcrumbs = ({
  triggerResponse,
  pipelineResponse
}: {
  triggerResponse: ResponseNGTriggerResponse | null
  pipelineResponse: ResponsePMSPipelineSummaryResponse | null
}): JSX.Element => {
  const { orgIdentifier, projectIdentifier, pipelineIdentifier, accountId, module } = useParams<
    PipelineType<{
      projectIdentifier: string
      orgIdentifier: string
      accountId: string
      pipelineIdentifier: string
      triggerIdentifier: string
    }>
  >()
  const { repoIdentifier, branch } = useQueryParams<GitQueryParams>()

  const { selectedProject, isGitSyncEnabled } = useAppStore()
  const project = selectedProject
  const { getString } = useStrings()
  const onEditTriggerName = triggerResponse?.data?.name
  useDocumentTitle([getString('pipelines'), getString('pipeline.triggers.triggersLabel')])

  return (
    <Breadcrumbs
      links={[
        {
          url: routes.toCDProjectOverview({
            orgIdentifier,
            projectIdentifier,
            accountId
          }),
          label: project?.name as string
        },
        {
          url: routes.toPipelines({
            orgIdentifier,
            projectIdentifier,
            accountId,
            module
          }),
          label: getString('pipelines')
        },
        {
          url: routes.toTriggersPage({
            orgIdentifier,
            projectIdentifier,
            accountId,
            pipelineIdentifier,
            module,
            ...(isGitSyncEnabled && {
              repoIdentifier,
              branch
            })
          }),
          label: pipelineResponse?.data?.name || ''
        },
        { url: '#', label: onEditTriggerName || '' }
      ]}
    />
  )
}
const GetTriggerRightNav = (pipelineResponse: ResponsePMSPipelineSummaryResponse | null): JSX.Element => {
  const { orgIdentifier, projectIdentifier, pipelineIdentifier, accountId, module } = useParams<
    PipelineType<{
      projectIdentifier: string
      orgIdentifier: string
      accountId: string
      pipelineIdentifier: string
      triggerIdentifier: string
    }>
  >()

  const { getString } = useStrings()
  const { isGitSyncEnabled } = useAppStore()
  return (
    <Container>
      <Layout.Horizontal spacing="medium">
        <NavLink
          className={css.tags}
          activeClassName={css.activeTag}
          to={routes.toPipelineStudio({
            orgIdentifier,
            projectIdentifier,
            pipelineIdentifier,
            accountId,
            module,
            ...(isGitSyncEnabled && {
              branch: pipelineResponse?.data?.gitDetails?.branch,
              repoIdentifier: pipelineResponse?.data?.gitDetails?.repoIdentifier
            })
          })}
        >
          {getString('pipelineStudio')}
        </NavLink>

        <NavLink
          className={css.tags}
          activeClassName={css.activeTag}
          to={routes.toInputSetList({
            orgIdentifier,
            projectIdentifier,
            pipelineIdentifier,
            accountId,
            module,
            ...(isGitSyncEnabled && {
              branch: pipelineResponse?.data?.gitDetails?.branch,
              repoIdentifier: pipelineResponse?.data?.gitDetails?.repoIdentifier
            })
          })}
        >
          {getString('inputSetsText')}
        </NavLink>
        <NavLink
          className={css.tags}
          activeClassName={css.activeTag}
          to={routes.toTriggersPage({
            orgIdentifier,
            projectIdentifier,
            pipelineIdentifier,
            accountId,
            module,
            ...(isGitSyncEnabled && {
              branch: pipelineResponse?.data?.gitDetails?.branch,
              repoIdentifier: pipelineResponse?.data?.gitDetails?.repoIdentifier
            })
          })}
        >
          {getString('pipeline.triggers.triggersLabel')}
        </NavLink>
        <NavLink
          className={css.tags}
          activeClassName={css.activeTag}
          to={routes.toPipelineDeploymentList({
            orgIdentifier,
            projectIdentifier,
            pipelineIdentifier,
            accountId,
            module,
            ...(isGitSyncEnabled && {
              branch: pipelineResponse?.data?.gitDetails?.branch,
              repoIdentifier: pipelineResponse?.data?.gitDetails?.repoIdentifier
            })
          })}
        >
          {getString('executionHeaderText')}
        </NavLink>
      </Layout.Horizontal>
    </Container>
  )
}

export default function TriggerDetails({ children }: React.PropsWithChildren<unknown>): React.ReactElement {
  const { orgIdentifier, projectIdentifier, pipelineIdentifier, accountId, triggerIdentifier } = useParams<
    PipelineType<{
      projectIdentifier: string
      orgIdentifier: string
      accountId: string
      pipelineIdentifier: string
      triggerIdentifier: string
    }>
  >()

  const { isGitSyncEnabled } = useAppStore()
  const { repoIdentifier, branch } = useQueryParams<GitQueryParams>()

  const { data: triggerResponse } = useGetTrigger({
    triggerIdentifier,
    queryParams: {
      accountIdentifier: accountId,
      orgIdentifier,
      projectIdentifier,
      targetIdentifier: pipelineIdentifier
    }
  })

  const { data: pipeline } = useGetPipelineSummary({
    pipelineIdentifier,
    queryParams: {
      accountIdentifier: accountId,
      orgIdentifier,
      projectIdentifier,
      ...(isGitSyncEnabled && { repoIdentifier, branch })
    }
  })

  return (
    <>
      <Page.Header
        toolbar={GetTriggerRightNav(pipeline)}
        title={
          <Layout.Vertical spacing="xsmall">
            <TriggerBreadcrumbs triggerResponse={triggerResponse} pipelineResponse={pipeline} />
          </Layout.Vertical>
        }
      />
      <Page.Body>{children}</Page.Body>
    </>
  )
}
