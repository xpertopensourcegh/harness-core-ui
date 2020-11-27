import React from 'react'
import { render } from '@testing-library/react'
import BuildArtifacts from '../BuildArtifacts'

describe('BuildArtifacts snapshot test', () => {
  test('should render properly', async () => {
    const { container } = render(<BuildArtifacts />)
    expect(container).toMatchSnapshot()
  })
})
