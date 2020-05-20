import React from 'react'
import { render } from '@testing-library/react'

import { PipelineStudioPage } from '../PipelineStudioPage'

describe('PipelineStudioPage tests', () => {
  test('page snapshot', () => {
    const { container } = render(<PipelineStudioPage />)
    expect(container).toMatchSnapshot()
  })
})
