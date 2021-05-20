import React from 'react'
import { Color, Icon, Layout, Text } from '@wings-software/uicore'
import { useStrings } from 'framework/strings'

interface TestConnectionWidgetProps {
  testStatus: TestStatus
  onTest: () => Promise<void>
}

export enum TestStatus {
  NOT_INITIATED,
  IN_PROGRESS,
  FAILED,
  SUCCESS
}

export const TestConnectionWidget: React.FC<TestConnectionWidgetProps> = ({ testStatus, onTest }) => {
  const { getString } = useStrings()

  return (
    <>
      <>
        {testStatus === TestStatus.NOT_INITIATED ? (
          <Layout.Horizontal spacing="small">
            <Icon name="test-connection" />
            <Text style={{ cursor: 'pointer' }} color={Color.BLUE_500} onClick={() => onTest()}>
              {getString('common.labelTestConnection')}
            </Text>
          </Layout.Horizontal>
        ) : null}
      </>
      <>
        {testStatus === TestStatus.IN_PROGRESS ? (
          <Layout.Horizontal spacing="small">
            <Icon name="steps-spinner" color={Color.PRIMARY_7} />
            <Text>{getString('common.test.inProgress')}</Text>
          </Layout.Horizontal>
        ) : null}
      </>
      <>
        {testStatus === TestStatus.FAILED ? (
          <Layout.Horizontal spacing="small">
            <Icon name="circle-cross" color={Color.RED_450} />
            <Text>{getString('common.test.connectionFailed')}</Text>
            <Icon name="test-connection" />
            <Text style={{ cursor: 'pointer' }} color={Color.BLUE_500} onClick={() => onTest()}>
              {getString('common.test.retest')}
            </Text>
          </Layout.Horizontal>
        ) : null}
      </>
      <>
        {testStatus === TestStatus.SUCCESS ? (
          <Layout.Horizontal spacing="small">
            <Icon name="command-artifact-check" color={Color.GREEN_450} />
            <Text>{getString('common.test.connectionSuccessful')}</Text>
          </Layout.Horizontal>
        ) : null}
      </>
    </>
  )
}
