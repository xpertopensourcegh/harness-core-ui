import React from 'react'
import classNames from 'classnames'
import moment from 'moment'
import { Spinner } from '@blueprintjs/core'
import { String } from 'framework/exports'
import css from './components.module.scss'
export interface BarrierStageTooltipProps {
  loading: boolean
  data?: any
  stageName: string
}

export default function BarrierStageTooltip(props: BarrierStageTooltipProps): React.ReactElement {
  return props.loading || !props.data ? (
    <div className={css.spinner}>
      <Spinner size={40} />
    </div>
  ) : (
    <div className={css.barrierList}>
      {props?.data?.map((barrier: any, index: number) => {
        let timeDiff = barrier?.startedAt + barrier?.timeoutIn - Date.now()
        timeDiff = timeDiff > 0 ? timeDiff : 0
        const timeoutData: { value: number; unit: string } = moment.duration(timeDiff, 'milliseconds').get('minutes')
          ? { value: moment.duration(timeDiff, 'milliseconds').get('minutes'), unit: 'min' }
          : { value: moment.duration(timeDiff, 'milliseconds').get('seconds'), unit: 'sec' }
        const altUnit = 'min'
        const altDuration = moment.duration(barrier?.timeoutIn, 'milliseconds').get('minutes')
        return (
          <div className={css.barrierRow} key={`${barrier.identifier}}_${index}`}>
            <div className={classNames(css.timeoutRow, css.row)}>
              <div>{barrier?.startedAt > 0 ? timeoutData.value : altDuration}</div>
              <div className={css.subheading}>{barrier?.startedAt > 0 ? timeoutData.unit : altUnit}</div>
            </div>
            <div className={css.row}>
              <div className={css.barriername}>{barrier.name}</div>
              <div className={css.subheading}>{barrier.identifier}</div>
            </div>
            <div className={classNames(css.row, css.stageName)}>
              <div></div>
              <div className={css.subheading}>
                <String stringID="stage" className={css.stagePadLeft} />
                {props?.stageName}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
