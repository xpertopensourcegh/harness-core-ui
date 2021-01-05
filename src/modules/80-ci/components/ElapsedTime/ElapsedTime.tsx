import React, { useState, useEffect } from 'react'
import classNames from 'classnames'
import { Color, Icon, Text } from '@wings-software/uicore'
import { formatElapsedTime } from '../common/time'
import type { DivAttributesProps } from '../common/props'
import css from './ElapsedTime.module.scss'

export interface ElapsedTimeProps extends DivAttributesProps {
  /** Counter start time - unix timestamp  */
  startTime: number // unix timestamp (start time)

  /** End time - unix timestamp - if not provided, local time is be used */
  endTime?: number // unix timestamp

  /** Add leading zeros to hours, minutes and seconds */
  addLeadingZero?: boolean
}

const ElapsedTime: React.FC<ElapsedTimeProps> = props => {
  const { startTime, addLeadingZero, className, endTime, ...restProps } = props

  // if falsy (zero or undefined) use Date.now()
  const endTimeOrNow = endTime ? endTime : Date.now()

  const seconds = Math.floor(Math.floor(endTimeOrNow - startTime) / 1000)
  const [counter, setCounter] = useState(seconds)

  useEffect(() => {
    setCounter(seconds)

    if (!endTime) {
      const interval = setInterval(() => setCounter(count => count + 1), 1000)
      return () => clearInterval(interval)
    }
  }, [endTime, seconds])

  return (
    <div className={classNames(css.elapsedTime, className)} {...restProps}>
      <Icon name="hourglass" color={Color.GREY_500} size={14} />
      <Text inline font={{ size: 'small' }} color={Color.GREY_500}>
        {formatElapsedTime(counter, addLeadingZero)}
      </Text>
    </div>
  )
}

export default ElapsedTime
