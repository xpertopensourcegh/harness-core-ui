import React from 'react'
import { render, fireEvent, waitFor, act } from '@testing-library/react'

import { Basic } from '../FailureStrategyPanel.stories'
import { Strategy } from '../StrategySelection/StrategyConfig'
import { Modes } from '../../common'

describe('<FailureStratergyPanel /> tests', () => {
  test('initial render with no data', () => {
    const { container } = render(<Basic data={{ failureStrategies: [] }} mode={Modes.STEP} />)
    expect(container).toMatchSnapshot()
  })

  test('adding a new strategy works', async () => {
    const { container, findByTestId } = render(<Basic data={{ failureStrategies: [] }} mode={Modes.STEP} />)

    const add = await findByTestId('add-failure-strategy')

    await act(() => {
      fireEvent.click(add)
      return Promise.resolve()
    })

    await waitFor(() => findByTestId('failure-strategy-step-0'))

    expect(container).toMatchSnapshot()

    const code = await findByTestId('code-output')

    expect(code).toMatchInlineSnapshot(`
      <pre
        data-testid="code-output"
      >
        failureStrategies:
        - onFailure: {}

      </pre>
    `)
  })

  test('adding all error types disable Add button and prevents new stragery addition', async () => {
    const { findByTestId } = render(
      <Basic
        data={{
          failureStrategies: [
            {
              onFailure: {
                errors: ['AnyOther'],
                action: {
                  type: 'StageRollback'
                }
              }
            },
            {
              onFailure: {
                errors: [
                  'Authentication',
                  'Authorization',
                  'Connectivity',
                  'Timeout',
                  'Verification',
                  'DelegateProvisioning'
                ],
                action: {
                  type: 'Retry',
                  spec: {
                    retryCount: 2,
                    retryIntervals: ['1d'],
                    onRetryFailure: {
                      action: {
                        type: 'MarkAsSuccess'
                      }
                    }
                  }
                }
              }
            }
          ]
        }}
        mode={Modes.STEP}
      />
    )

    const add = await findByTestId('add-failure-strategy')

    expect(add.getAttribute('class')).toContain('bp3-disabled')
  })

  test('removing a strategy works', async () => {
    const { container, findByTestId, getByTestId } = render(
      <Basic data={{ failureStrategies: [{}, {}] }} mode={Modes.STEP} />
    )

    const step2 = await findByTestId('failure-strategy-step-1')

    await act(() => {
      fireEvent.click(step2)
      return Promise.resolve()
    })

    const deleteBtn = await findByTestId('remove-failure-strategy')

    await act(() => {
      fireEvent.click(deleteBtn)
      return Promise.resolve()
    })

    expect(() => getByTestId('failure-strategy-step-1')).toThrow()

    expect(container).toMatchSnapshot()

    const code = await findByTestId('code-output')

    expect(code).toMatchInlineSnapshot(`
      <pre
        data-testid="code-output"
      >
        failureStrategies:
        - {}

      </pre>
    `)
  })

  test.each<[Strategy]>([
    [Strategy.MarkAsSuccess],
    [Strategy.StageRollback],
    [Strategy.StepGroupRollback],
    [Strategy.Ignore],
    [Strategy.Abort]
  ])('simple strategy: "%s"', async strategy => {
    const { container, findByTestId } = render(<Basic data={{ failureStrategies: [{}] }} mode={Modes.STEP_GROUP} />)

    const selection = await findByTestId(`failure-strategy-${strategy.toLowerCase()}`)

    await act(() => {
      fireEvent.click(selection)
      return Promise.resolve()
    })

    expect(container).toMatchSnapshot()

    const code = await findByTestId('code-output')

    expect(code).toMatchSnapshot('code')
  })
})
