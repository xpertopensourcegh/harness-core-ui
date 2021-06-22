import React from 'react'
import { render, fireEvent, act } from '@testing-library/react'

import { Strategy } from '@pipeline/utils/FailureStrategyUtils'
import { StepMode as Modes } from '@pipeline/utils/stepUtils'
import { testIds } from '../StrategySelection/StrategyConfig'
import { Basic } from '../FailureStrategyPanel.stories'
describe('Failure Strategy: MarkAsSuccess', () => {
  test('selection works', async () => {
    const { findByTestId } = render(
      <Basic data={{ failureStrategies: [{ onFailure: { errors: [], action: {} as any } }] }} mode={Modes.STEP} />
    )

    const selection = await findByTestId(testIds.MarkAsSuccess)

    await act(() => {
      fireEvent.click(selection)
      return Promise.resolve()
    })

    const panel = await findByTestId('failure-strategy-panel')
    expect(panel).toMatchSnapshot()

    const code = await findByTestId('code-output')

    expect(code).toMatchInlineSnapshot(`
      <pre
        data-testid="code-output"
      >
        failureStrategies:
        - onFailure:
            errors: []
            action:
              type: MarkAsSuccess

      </pre>
    `)
  })

  test('deselection works', async () => {
    const { findByTestId } = render(
      <Basic
        data={{ failureStrategies: [{ onFailure: { errors: [], action: { type: Strategy.MarkAsSuccess } } }] }}
        mode={Modes.STEP_GROUP}
      />
    )

    const selection = await findByTestId(testIds.MarkAsSuccess)

    await act(() => {
      fireEvent.click(selection)
      return Promise.resolve()
    })

    const code = await findByTestId('code-output')

    expect(code).toMatchInlineSnapshot(`
      <pre
        data-testid="code-output"
      >
        failureStrategies:
        - onFailure:
            errors: []
            action: {}

      </pre>
    `)
  })
})
