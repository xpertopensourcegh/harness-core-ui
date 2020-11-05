import React from 'react'
import { useParams } from 'react-router-dom'

import { useGetProject } from 'services/cd-ng'
import { useStrings } from 'framework/exports'
import { Breadcrumbs } from '@common/components/Breadcrumbs/Breadcrumbs'
import PipelineDeploymentList from '@pipeline/pages/pipeline-deployment-list/PipelineDeploymentList'

import css from './DeploymentsList.module.scss'

export default function DeploymentsList(): React.ReactElement {
  const { projectIdentifier, accountId, orgIdentifier } = useParams()
  const { getString } = useStrings()

  const { data } = useGetProject({
    identifier: projectIdentifier,
    queryParams: {
      orgIdentifier,
      accountIdentifier: accountId
    }
  })

  return (
    <div className={css.main}>
      <div className={css.header}>
        <Breadcrumbs
          links={[
            {
              label: data?.data?.name || 'Project',
              url: '/'
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
        <PipelineDeploymentList />
      </div>
    </div>
  )
}
