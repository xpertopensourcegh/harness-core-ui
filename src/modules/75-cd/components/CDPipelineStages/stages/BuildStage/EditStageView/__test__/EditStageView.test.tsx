import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import { EditStageView } from '../EditStageView'

describe('EditStageView snapshot test', () => {
  test('initializes ok', async () => {
    const { container } = render(
      <TestWrapper pathParams={{ accountIdentifier: 'dummy', orgIdentifier: 'dummy', projectIdentifier: 'dummy' }}>
        <EditStageView />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
