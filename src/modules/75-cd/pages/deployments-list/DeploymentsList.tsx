import React from 'react'
import { useParams } from 'react-router-dom'

import { useAppStore, useStrings } from 'framework/exports'
import { Breadcrumbs } from '@common/components/Breadcrumbs/Breadcrumbs'
import PipelineDeploymentList from '@pipeline/pages/pipeline-deployment-list/PipelineDeploymentList'

import routes from '@common/RouteDefinitions'
import css from './DeploymentsList.module.scss'

export default function DeploymentsList(): React.ReactElement {
  const { projectIdentifier, orgIdentifier, accountId } = useParams()
  const { getString } = useStrings()

  const { projects } = useAppStore()
  const project = projects.find(({ identifier }) => identifier === projectIdentifier)

  return (
    <div className={css.main}>
      <div className={css.header}>
        <Breadcrumbs
          links={[
            {
              label: project?.name || '',
              url: routes.toCDProjectOverview({ orgIdentifier, projectIdentifier, accountId })
            },
            {
              label: getString('deploymentsText'),
              url: ''
            }
          ]}
        />
        <h2>Deployments</h2>
      </div>
      <div className={css.content}>
        <PipelineDeploymentList onRunPipeline={() => alert('TODO: implement this feature')} />
      </div>
    </div>
  )
}
