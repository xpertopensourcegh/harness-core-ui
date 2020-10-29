import React from 'react'
import { render } from '@testing-library/react'
import { PipelineTriggers } from '../PipelineTriggers/PipelineTriggers'

describe('Test PipelineTriggers', () => {
  test('should test render', () => {
    const { container } = render(<PipelineTriggers />)
    expect(container).toMatchSnapshot()
  })
})
