import React, { useState, useEffect } from 'react'
import classNames from 'classnames'
import { Icon } from '@wings-software/uikit'
import { formatElapsedTime } from '../common/time'
import type { DivAttributesProps } from '../common/props'
import css from './ElapsedTime.module.scss'

export interface ElapsedTimeProps extends DivAttributesProps {
  /** Counter start time - unix timestamp  */
  startTime: number // unix timestamp (start time)

  /** Add leading zeros to hours, minutes and seconds */
  addLeadingZero?: boolean
}

const ElapsedTime: React.FC<ElapsedTimeProps> = props => {
  const { startTime, addLeadingZero, className, ...restProps } = props

  const seconds = Math.floor(Math.floor(Date.now() - startTime) / 1000)

  const [counter, setCounter] = useState(seconds)

  useEffect(() => {
    const interval = setInterval(() => setCounter(count => count + 1), 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={classNames(css.elapsedTime, className)} {...restProps}>
      <Icon name="time" />
      {formatElapsedTime(counter, addLeadingZero)}
    </div>
  )
}

export default ElapsedTime
