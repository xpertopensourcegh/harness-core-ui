import React from 'react'
import classNames from 'classnames'
import moment from 'moment'
import { Icon, Text } from '@wings-software/uicore'
import { Spinner } from '@blueprintjs/core'
import { String } from 'framework/exports'
import css from '../components.module.scss'
export interface BarrierStageTooltipProps {
  loading: boolean
  data?: any
  stageName: string
}

export default function BarrierStageTooltip(props: BarrierStageTooltipProps): React.ReactElement {
  return props.loading ? (
    <div className={css.spinner}>
      <Spinner size={40} />
    </div>
  ) : (
    <div className={css.barrierList}>
      {props?.data.map((barrier: any) => {
        let timeDiff = barrier?.startedAt + barrier?.timeoutIn - Date.now()
        timeDiff = timeDiff > 0 ? timeDiff : 0
        const timeoutData: { value: number; unit: string } = moment.duration(timeDiff, 'milliseconds').get('minutes')
          ? { value: moment.duration(timeDiff, 'milliseconds').get('minutes'), unit: 'min' }
          : { value: moment.duration(timeDiff, 'milliseconds').get('seconds'), unit: 'sec' }
        const altUnit = 'min'
        const altDuration = moment.duration(barrier?.timeoutIn, 'milliseconds').get('minutes')

        return (
          <div className={css.barrierRow} key={barrier.identifier}>
            <div>
              <Icon name="barrier-open-with-links" size={30} />
            </div>
            <div>
              <div className={css.row}>
                <div>{barrier.name}</div>
                <div className={classNames(css.subheading, css.barrierData)}>
                  <String stringID="pipeline.barriers.tooltips.barrierWaiting" />
                  <Text width={50} inline>
                    {barrier.identifier}
                  </Text>{' '}
                  | <String stringID="pipeline.execution.stageTitlePrefix" /> {props?.stageName}
                </div>
              </div>
            </div>
            <div className={css.timeout}>
              <div className={classNames(css.timeoutRow, css.row)}>
                <div>{barrier?.startedAt > 0 ? timeoutData.value : altDuration}</div>
                <div className={css.subheading}>{barrier?.startedAt > 0 ? timeoutData.unit : altUnit}</div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
