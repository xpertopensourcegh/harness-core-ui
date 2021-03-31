import React from 'react'
import moment from 'moment'
import { Spinner } from '@blueprintjs/core'
import { Icon } from '@wings-software/uicore'
import { String } from 'framework/exports'
import css from './components.module.scss'
export interface BarrierStepTooltipProps {
  loading: boolean
  data?: any
  startTs?: number
}

export default function BarrierStepTooltip(props: BarrierStepTooltipProps): React.ReactElement {
  const startTs = props?.startTs ? props?.startTs : 0
  let timeDiff = startTs + props.data?.timeoutIn - Date.now()
  timeDiff = timeDiff > 0 ? timeDiff : 0
  const timeoutData: { value: number; unit: string } = moment.duration(timeDiff, 'milliseconds').get('minutes')
    ? { value: moment.duration(timeDiff, 'milliseconds').get('minutes'), unit: 'min' }
    : { value: moment.duration(timeDiff, 'milliseconds').get('seconds'), unit: 'sec' }
  const altUnit = 'min'
  const altDuration = moment.duration(props.data?.timeoutIn, 'milliseconds').get('minutes')
  return props.loading ? (
    <div className={css.spinner}>
      <Spinner size={40} />
    </div>
  ) : (
    <div className={css.barrierInfo}>
      <div className={css.timeoutIcon}>
        <Icon name="timeout" />
      </div>
      <div className={css.barrierDetails}>
        <div>{props.data?.name}</div>
        <div>
          <String stringID="barriers.tooltips.barrierWaiting" />
          {props.data?.stepParameters?.identifier}
        </div>
      </div>
      <div className={css.barrierDetails}>
        <div className={css.timeoutContainer}>
          <div className={css.timeout}>
            <div>{props?.startTs ? timeoutData.value : altDuration}</div>
            <div className={css.subheading}>{props?.startTs ? timeoutData.unit : altUnit}</div>
          </div>
        </div>
        <div>
          <String stringID="barriers.tooltips.timeout" />
        </div>
      </div>
    </div>
  )
}
