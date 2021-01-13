import React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import routes from '@common/RouteDefinitions'
import type { PipelineType } from '@common/interfaces/RouteInterfaces'
import { useStrings } from 'framework/exports'
import { useDocumentTitle } from '@common/hooks/useDocumentTitle'
import TriggersList from './views/TriggersList'

interface TriggerDataInterface {
  triggerType: string
  sourceRepo: string
}
const TriggersPage: React.FC = (): React.ReactElement => {
  const { orgIdentifier, projectIdentifier, accountId, pipelineIdentifier, module } = useParams<
    PipelineType<{
      projectIdentifier: string
      orgIdentifier: string
      accountId: string
      pipelineIdentifier: string
      triggerIdentifier: string
    }>
  >()
  const history = useHistory()
  const onNewTriggerClick = (val: TriggerDataInterface): void => {
    const { triggerType, sourceRepo } = val
    history.push(
      routes.toTriggersWizardPage({
        accountId,
        orgIdentifier,
        projectIdentifier,
        pipelineIdentifier,
        triggerIdentifier: 'new', // new is a reserved identifier
        triggerType,
        sourceRepo,
        module
      })
    )
  }
  const { getString } = useStrings()

  useDocumentTitle([getString('pipelines'), getString('pipeline-triggers.triggersLabel')])

  return <TriggersList onNewTriggerClick={onNewTriggerClick} />
}

export default TriggersPage
