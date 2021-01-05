import React, { useEffect, useRef } from 'react'
import cx from 'classnames'
import { Button, Icon, IconName, Color, Utils, ButtonProps } from '@wings-software/uicore'
import css from './ExecutionStageButton.module.scss'

export interface ExecutionStageButtonProps {
  icon: IconName
  color: Color
  parallel?: boolean
  tooltip?: ButtonProps['tooltip']
}

export const ExecutionStageButton: React.FC<ExecutionStageButtonProps> = ({ icon, color, parallel, tooltip }) => {
  const elementRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const container = (elementRef?.current?.closest?.(`.${css.btnContainer}`) as unknown) as { style: string }

    if (container) {
      container.style = `--stage-status-color: ${Utils.getRealCSSColor(color)}`
    }
  }, [elementRef, color])
  const button = (
    <Button
      noStyling
      className={cx(css.btnStage, parallel && css.parallel)}
      tooltip={tooltip}
      tooltipProps={{
        className: cx(css.btnContainer, parallel && css.parallel)
      }}
    >
      <Icon name={icon} size={10} color={color} />
      {parallel && (
        <>
          <span className={cx(css.shadowStage1, css.shadowStage2)}></span>
          <span className={css.shadowStage1}></span>
        </>
      )}
      <span ref={elementRef} className={css.hidden}></span>
    </Button>
  )

  return (
    <>
      {tooltip ? (
        button
      ) : (
        <span className={cx(css.btnContainer, parallel && css.parallel, css.noCursor)}>
          <span>{button}</span>
        </span>
      )}
    </>
  )
}
