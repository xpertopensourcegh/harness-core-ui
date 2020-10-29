import React from 'react'
import { render } from '@testing-library/react'

import ExecutionArtifactsView from '../ExecutionArtifactsView'

describe('<ExecutionArtifactsView /> tests', () => {
  test('snapshot test', () => {
    const { container } = render(<ExecutionArtifactsView />)
    expect(container).toMatchSnapshot()
  })
})
