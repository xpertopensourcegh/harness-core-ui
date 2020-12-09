import React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import routes from '@common/RouteDefinitions'
import TriggersList from './views/TriggersList'

interface TriggerDataInterface {
  triggerType: string
  sourceRepo: string
}
const TriggersPage: React.FC = (): React.ReactElement => {
  const { orgIdentifier, projectIdentifier, accountId, pipelineIdentifier } = useParams<{
    projectIdentifier: string
    orgIdentifier: string
    accountId: string
    pipelineIdentifier: string
    triggerIdentifier: string
  }>()
  const history = useHistory()
  const onNewTriggerClick = (val: TriggerDataInterface): void => {
    const { triggerType, sourceRepo } = val
    history.push(
      routes.toCDTriggersWizardPage({
        accountId,
        orgIdentifier,
        projectIdentifier,
        pipelineIdentifier,
        triggerIdentifier: 'new', // new is a reserved identifier
        triggerType,
        sourceRepo
      })
    )
  }

  return <TriggersList onNewTriggerClick={onNewTriggerClick} />
}

export default TriggersPage
