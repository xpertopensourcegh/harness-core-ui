import React from 'react'
import { render } from '@testing-library/react'
import ArtifactsSelection from '../ArtifactsSelection'

describe('ArtifactsSelection Snapshot', () => {
  test('should render ArtifactsSelection component', () => {
    const { container } = render(<ArtifactsSelection />)
    expect(container).toMatchSnapshot()
  })
})
