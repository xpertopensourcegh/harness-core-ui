import React from 'react'
import { render } from '@testing-library/react'
import { Button } from '@blueprintjs/core'
import { RoundButtonGroup, OptionsRoundButtonGroup } from '../RoundButtonGroup'

describe('RoundButtonGroup snapshot test', () => {
  test('should render properly', async () => {
    const { container } = render(
      <RoundButtonGroup>
        <Button>a</Button>
      </RoundButtonGroup>
    )
    expect(container).toMatchSnapshot()
  })
})

describe('OptionsRoundButtonGroup snapshot test', () => {
  test('should render properly', async () => {
    const { container } = render(<OptionsRoundButtonGroup options={[{ value: 'test' }]} />)
    expect(container).toMatchSnapshot()
  })
})
