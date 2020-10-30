import React, { useEffect, useState } from 'react'
import { useGet } from 'restful-react'
import { useRouteParams } from 'framework/exports'
import ActivitiesTimelineView, { EventData } from './ActivitiesTimelineView'

export interface ActivitesTimelineViewSectionProps {
  startTime: number
  endTime: number
  environmentIdentifier: string
}

export default function ActivitesTimelineViewSection({
  startTime,
  endTime,
  environmentIdentifier
}: ActivitesTimelineViewSectionProps) {
  const [deployments, setDeployments] = useState<Array<EventData>>()
  const [configChanges, setConfigChanges] = useState<Array<EventData>>()
  const [infrastructureChanges, setInfrastructureChanges] = useState<Array<EventData>>()
  const [otherChanges, setOtherChanges] = useState<Array<EventData>>()
  const {
    params: { accountId, projectIdentifier, orgIdentifier }
  } = useRouteParams()

  const { refetch: getActivities } = useGet('/cv/api/activity/list', {
    lazy: true,
    resolve: res => {
      if (res) {
        const deploymentsData: Array<EventData> = []
        const configChangesData: Array<EventData> = []
        const infrastructureChangesData: Array<EventData> = []
        const otherChangesData: Array<EventData> = []
        res?.resource?.forEach((activity: any) => {
          const eventData = {
            startTime: activity.activityStartTime as number,
            name: activity.activityName as string,
            verificationResult: 'PASSED' as EventData['verificationResult'] // TODO - add in-progress
          }
          switch (activity.activityType) {
            case 'DEPLOYMENTS':
              deploymentsData.push(eventData)
              break
            case 'CONFIG_CHANGES':
              configChangesData.push(eventData)
              break
            case 'INFRASTRUCTURE':
              infrastructureChangesData.push(eventData)
              break
            case 'OTHER_CHANGES':
              otherChangesData.push(eventData)
              break
          }
          setDeployments(deploymentsData)
          setConfigChanges(configChangesData)
          setInfrastructureChanges(infrastructureChangesData)
          setOtherChanges(otherChangesData)
        })
      }
      return res
    }
  })

  useEffect(() => {
    if (startTime && endTime) {
      getActivities({
        queryParams: {
          accountId,
          orgIdentifier,
          projectIdentifier,
          environmentIdentifier,
          startTime: startTime,
          endTime: endTime
        }
      })
    }
  }, [startTime, endTime])

  return (
    <ActivitiesTimelineView
      startTime={startTime}
      endTime={endTime}
      deployments={deployments}
      configChanges={configChanges}
      infrastructureChanges={infrastructureChanges}
      otherChanges={otherChanges}
    />
  )
}
