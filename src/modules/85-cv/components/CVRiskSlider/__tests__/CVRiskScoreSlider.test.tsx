import React from 'react'
import { render } from '@testing-library/react'
import CVRiskScoreSlider from '../CVRiskScoreSlider'

describe('CVRiskScoreSlider', () => {
  test('render', async () => {
    const { container } = render(<CVRiskScoreSlider onSelected={jest.fn()} />)
    expect(container).toMatchSnapshot()
  })
})
