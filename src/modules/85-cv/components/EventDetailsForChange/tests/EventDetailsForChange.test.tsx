import React from 'react'
import { render, waitFor, fireEvent, getByText } from '@testing-library/react'
import type { UseGetReturn } from 'restful-react'
import { Container } from '@wings-software/uicore'
import type { EventData } from '@cv/components/ActivitiesTimelineView/ActivitiesTimelineView'
import { TestWrapper } from '@common/utils/testUtils'
import * as cvService from 'services/cv'
import { EventDetailsForChange } from '../EventDetailsForChange'

const MockEventData: EventData[] = [
  {
    activityId: '1234_activityId',
    name: '1 Warning kubernetes events',
    startTime: 1612471080000,
    verificationResult: 'VERIFICATION_PASSED'
  },
  {
    activityId: '4567_activityId',
    name: '3 Normal kubernetes events',
    startTime: 1612471140000,
    verificationResult: 'NOT_STARTED'
  },
  {
    activityId: '7891_activityId',
    name: '1 Warning kubernetes events',
    startTime: 1612471140000,
    verificationResult: 'VERIFICATION_FAILED'
  }
]

const MockActivityVerificationResult = {
  metaData: {},
  resource: {
    activityType: 'KUBERNETES',
    activityId: 'DIONunBCT8iLV0PqAguWdg',
    activityName: '1 Warning kubernetes events',
    activityStartTime: 1612471080000,
    environmentIdentifier: 'prod',
    environmentName: null,
    serviceIdentifier: 'todolist',
    endTime: 1612471980000,
    remainingTimeMs: 0,
    overallRisk: 88,
    preActivityRisks: [
      { category: 'Infrastructure', risk: -1.0 },
      { category: 'Errors', risk: 22.0 },
      { category: 'Performance', risk: 87.0 }
    ],
    postActivityRisks: [
      { category: 'Infrastructure', risk: -1.0 },
      { category: 'Errors', risk: 22.0 },
      { category: 'Performance', risk: 88.0 }
    ],
    progressPercentage: 100,
    status: 'VERIFICATION_FAILED'
  },
  responseMessages: []
}

const MockJSON = {
  status: 'SUCCESS',
  data: [
    'class V1Event {\n    action: null\n    apiVersion: v1\n    count: 1\n    eventTime: null\n    firstTimestamp: 2021-02-04T20:38:59.000Z\n    involvedObject: class V1ObjectReference {\n        apiVersion: v1\n        fieldPath: null\n        kind: Pod\n        name: harness-example-deployment-74978696ff-clhcj\n        namespace: harness\n        resourceVersion: 354212001\n        uid: e3f56b2a-c005-460a-a211-582a6b3f8743\n    }\n    kind: Event\n    lastTimestamp: 2021-02-04T20:38:59.000Z\n    message: MountVolume.SetUp failed for volume "default-token-vrx2x" : failed to sync secret cache: timed out waiting for the condition\n    metadata: class V1ObjectMeta {\n        annotations: null\n        clusterName: null\n        creationTimestamp: 2021-02-04T20:38:59.000Z\n        deletionGracePeriodSeconds: null\n        deletionTimestamp: null\n        finalizers: null\n        generateName: null\n        generation: null\n        labels: null\n        managedFields: null\n        name: harness-example-deployment-74978696ff-clhcj.1660a5f54aa9a0a0\n        namespace: harness\n        ownerReferences: null\n        resourceVersion: 22595738\n        selfLink: /api/v1/namespaces/harness/events/harness-example-deployment-74978696ff-clhcj.1660a5f54aa9a0a0\n        uid: 28060f14-268f-47ff-8079-dab6daddd135\n    }\n    reason: FailedMount\n    related: null\n    reportingComponent: \n    reportingInstance: \n    series: null\n    source: class V1EventSource {\n        component: kubelet\n        host: gke-qa-target-ci-pool-1b51f8ee-tqtj\n    }\n    type: Warning\n}'
  ],
  metaData: null,
  correlationId: null
}

jest.mock('react-monaco-editor', () => (props: any) => (
  <Container className="monaco-editor">
    <button className="monaco-editor-onChangebutton" onClick={() => props.onChange('{ "sdfsdffdf": "2132423" }')} />
  </Container>
))

describe('Unit tests for EventDetailsForChange', () => {
  test('Ensure left nav is rendered with correct events when provided', async () => {
    jest
      .spyOn(cvService, 'useGetActivityVerificationResult')
      .mockReturnValue({ data: MockActivityVerificationResult, refetch: jest.fn() as unknown } as UseGetReturn<
        any,
        any,
        any,
        any
      >)

    const { rerender } = render(
      <TestWrapper>
        <EventDetailsForChange selectedActivities={MockEventData} onCloseCallback={jest.fn()} />
      </TestWrapper>
    )

    // check what happens when there are 3 activities to render
    await waitFor(() => expect(document.body.querySelectorAll('[class*="activityItem"]')?.length).toBe(3))
    const activityItems = document.body.querySelectorAll('[class*="activityItem"]')
    expect(document.body.querySelector('[class*="selectedActivity"]')).toEqual(activityItems[0])

    fireEvent.click(activityItems[1])
    await waitFor(() => expect(activityItems[1]?.getAttribute('class')).toContain('selectedActivity'))

    //re render with only one item
    rerender(
      <TestWrapper>
        <EventDetailsForChange selectedActivities={[MockEventData[2]]} onCloseCallback={jest.fn()} />
      </TestWrapper>
    )
    await waitFor(() => expect(document.body.querySelectorAll('[class*="activityItem"]')?.length).toBe(1))
  })

  test('Ensure that when view json is clicked the json is rendered', async () => {
    jest
      .spyOn(cvService, 'useGetActivityVerificationResult')
      .mockReturnValue({ data: MockActivityVerificationResult, refetch: jest.fn() as unknown } as UseGetReturn<
        any,
        any,
        any,
        any
      >)

    jest.spyOn(cvService, 'useGetActivityDetails').mockReturnValue({
      data: MockJSON
    } as UseGetReturn<any, any, any, any>)

    render(
      <TestWrapper>
        <EventDetailsForChange selectedActivityId="1234_activityId" onCloseCallback={jest.fn()} />
      </TestWrapper>
    )

    await waitFor(() =>
      expect(document.body.querySelector('[class*="largeTile"]')?.children[0]?.innerHTML).toEqual('88')
    )
    expect(document.querySelector('[class*="activityItem"]')).toBeNull()
    const viewJSONButton = getByText(document.body, 'View JSON')
    fireEvent.click(viewJSONButton)

    await waitFor(() => expect(document.body.querySelector('[class*="monaco-editor"]')).not.toBeNull())
  })
})
