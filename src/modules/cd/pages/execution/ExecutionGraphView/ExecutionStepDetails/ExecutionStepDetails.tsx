import React from 'react'
import cx from 'classnames'
import { Button } from '@wings-software/uikit'
import { Tabs } from '@blueprintjs/core'
import Draggable from 'react-draggable'
import { usePopper } from 'react-popper'

import ExecutionContext from 'modules/cd/pages/execution/ExecutionContext/ExecutionContext'

import ExecutionStepDetailsTab from './ExecutionStepDetailsTab'
import ExecutionStepInputTab from './ExecutionStepInputTab'
import ExecutionStepOutputTab from './ExecutionStepOutputTab'

import css from './ExecutionStepDetails.module.scss'

export enum DetailsViewState {
  NONE = 'NONE',
  RIGHT = 'RIGHT',
  BOTTOM = 'BOTTOM',
  FLOATING = 'FLOATING'
}

export interface ExecutionStepDetailsProps {
  viewState: DetailsViewState
  onViewStateChange(state: DetailsViewState): void
  selectedStep: string
}

export default function ExecutionStepDetails(props: ExecutionStepDetailsProps): React.ReactElement {
  const { viewState, onViewStateChange, selectedStep } = props
  const { pipelineExecutionDetail } = React.useContext(ExecutionContext)
  const [isOpen, setIsOpen] = React.useState(true)
  const [referenceElement, setReferenceElement] = React.useState<HTMLElement | null>(null)
  const [popperElement, setPopperElement] = React.useState<HTMLElement | null>(null)
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'bottom-end',
    modifiers: [
      {
        name: 'offset',
        options: { offset: [0, 12] }
      }
    ]
  })

  React.useEffect(() => {
    setIsOpen(true)
  }, [viewState])

  const step = pipelineExecutionDetail?.stageGraph?.nodeMap?.[selectedStep] || {}

  function handleViewChange(e: React.ChangeEvent<HTMLInputElement>): void {
    if (e.target.checked) {
      onViewStateChange(e.target.value as DetailsViewState)
    }
  }

  function toggleDialog(): void {
    setIsOpen(status => !status)
  }

  return (
    <div className={css.main} data-state={viewState.toLowerCase()}>
      {viewState === DetailsViewState.FLOATING ? (
        <Draggable
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          offsetParent={document.getElementById('pipeline-execution-container')!}
          disabled={isOpen}
          defaultPosition={{ x: -40, y: -30 }}
        >
          <div className={cx(css.stepDetails, { [css.draggable]: !isOpen })} ref={setReferenceElement}>
            <span>Step Details</span>
            <Button onClick={toggleDialog} rightIcon={isOpen ? 'minus' : 'plus'} minimal small intent="primary" />
          </div>
        </Draggable>
      ) : null}
      {isOpen ? (
        <div
          className={css.infoDialog}
          ref={setPopperElement}
          {...(viewState === DetailsViewState.FLOATING ? { ...attributes.popper, style: styles.popper } : {})}
        >
          <div className={css.header}>
            <div className={css.title}>Step: {step.name}</div>
            <div className={css.actions}>
              {[DetailsViewState.RIGHT, DetailsViewState.BOTTOM, DetailsViewState.FLOATING].map(key => (
                <label
                  key={key}
                  className={cx(css.aligmentIcon, key.toLowerCase(), {
                    [css.isCurrent]: viewState === key
                  })}
                  title={'Align ' + key.toLowerCase()}
                >
                  <input
                    type="radio"
                    name="detailsViewState"
                    value={key}
                    onChange={handleViewChange}
                    checked={viewState === key}
                  />
                </label>
              ))}
              <Button icon="more" minimal small className={css.more} />
            </div>
          </div>
          <Tabs id="step-details" className={css.tabs} renderActiveTabPanelOnly>
            <Tabs.Tab id="details" title="Details" panel={<ExecutionStepDetailsTab />} />
            <Tabs.Tab id="input" title="Input" panel={<ExecutionStepInputTab />} />
            <Tabs.Tab id="output" title="Output" panel={<ExecutionStepOutputTab />} />
          </Tabs>
        </div>
      ) : null}
    </div>
  )
}
