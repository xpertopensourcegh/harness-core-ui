import React from 'react'
import { Layout, Text } from '@wings-software/uikit'
import { render } from '@testing-library/react'
import ActivityStack from '../ActivityStack'
import { activityData } from './ActivityMock'

describe('Activity Stack test', () => {
  test('initializes ok ', async () => {
    const { container } = render(
      <ActivityStack
        items={activityData}
        tooltip={item => (
          <Layout.Vertical padding="medium">
            <Text>{item.activity}</Text>
            <Text>{item.updatedBy}</Text>
          </Layout.Vertical>
        )}
      />
    )
    expect(container).toMatchSnapshot()
  })
})
