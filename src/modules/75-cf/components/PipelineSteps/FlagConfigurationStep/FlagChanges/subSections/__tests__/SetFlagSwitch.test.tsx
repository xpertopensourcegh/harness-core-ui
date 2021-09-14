import React from 'react'
import { render, screen } from '@testing-library/react'
import SetFlagSwitch from '../SetFlagSwitch'

describe('SetFlagSwitch', () => {
  test('it should render', async () => {
    render(<SetFlagSwitch subSectionSelector={<span />} />)

    expect(screen.getByText('Set Flag Switch')).toBeInTheDocument()
  })
})
