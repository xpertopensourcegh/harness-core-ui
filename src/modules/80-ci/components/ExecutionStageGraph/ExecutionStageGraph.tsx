import React, { useCallback, useEffect, useRef, useState } from 'react'
import cx from 'classnames'
import { Container, Button, Layout, Text, Color, IconName, ButtonProps } from '@wings-software/uicore'
import { ExecutionStageButton } from './ExecutionStageButton'
import css from './ExecutionStageGraph.module.scss'

export interface RenderStageButtonInfo {
  key: string
  icon: IconName
  color: Color
  parallel?: boolean
  tooltip?: ButtonProps['tooltip']
}

export interface ExecutionStageGraphProps<T> {
  stages?: T[]
  stageStatusCounts: {
    success?: number
    running?: number
    failed?: number
  }
  renderStageButton: (stage: T) => RenderStageButtonInfo
  errorMsg?: string
  className?: string
}

export function ExecutionStageGraph<T>(props: ExecutionStageGraphProps<T>): JSX.Element {
  const { className, stageStatusCounts, errorMsg, stages, renderStageButton } = props
  const elementRef = useRef<HTMLSpanElement>(null)
  const [hideLeftButton, setHideLeftButton] = useState(true)
  const [hideRightButton, setHideRightButton] = useState(true)
  const getContainerDOM = useCallback(
    (): Element | null | undefined => elementRef?.current?.closest?.(`.${css.graph}`),
    [elementRef]
  )
  const toggleButtons = useCallback(() => {
    setTimeout(() => {
      const container = getContainerDOM()

      if (container) {
        setHideLeftButton(!container.scrollLeft)
        setHideRightButton(
          container.scrollWidth <= container.clientWidth ||
            container.scrollLeft + container.clientWidth >= container.scrollWidth
        )
      }
    }, 500)
  }, [getContainerDOM])
  const onLeftRightBtnClick = useCallback(
    (isFromRightButton: boolean) => {
      const container = getContainerDOM()
      if (container) {
        container.scrollLeft += isFromRightButton ? container.scrollWidth : -container.scrollWidth
      }
      toggleButtons()
    },
    [getContainerDOM, toggleButtons]
  )
  const totalStages =
    Number(stageStatusCounts.success || 0) +
    Number(stageStatusCounts.running || 0) +
    Number(stageStatusCounts.failed || 0)

  useEffect(() => {
    const container = getContainerDOM()

    container?.addEventListener?.('scroll', toggleButtons)

    toggleButtons()
    addEventListener('resize', toggleButtons)

    return () => {
      removeEventListener('resize', toggleButtons)
      container?.removeEventListener?.('scroll', toggleButtons)
    }
  }, [toggleButtons, getContainerDOM])

  return (
    <Container className={cx(css.wrapper, className)}>
      <Container className={cx(css.container)}>
        <Button
          minimal
          icon="circle-arrow-left"
          onClick={() => onLeftRightBtnClick(false)}
          className={cx(css.btnLeft, hideLeftButton && css.hidden)}
          iconProps={{ size: 12 }}
          style={{ color: 'var(--grey-350)' }}
        />
        <Container className={css.graph}>
          {stages?.map(stage => {
            const { parallel, icon, color, tooltip, key } = renderStageButton(stage)
            return <ExecutionStageButton key={key} parallel={parallel} icon={icon} color={color} tooltip={tooltip} />
          })}
          {/* <ExecutionStageButton icon="tick-circle" color="green500" tooltip="Stage1: Complete" />
          <ExecutionStageButton icon="tick-circle" color="green500" tooltip="Stage2: Complete" />
          <ExecutionStageButton
            icon="tick-circle"
            color="green500"
            tooltip="Stage3: 10 parallel stages: Complete"
            parallel
          />
          <ExecutionStageButton icon="tick-circle" color="green500" tooltip="Stage4: Complete" />
          <ExecutionStageButton icon="warning-sign" color="red500" tooltip="Stage5: Failed" />
          <ExecutionStageButton icon="tick-circle" color="red500" parallel tooltip="Stage6: Failed" />
          <ExecutionStageButton icon="tick-circle" color="red500" tooltip="Stage7: Failed" />
          <ExecutionStageButton icon="spinner" color="blue500" parallel tooltip="Stage8: Running" />
          <ExecutionStageButton icon="pending" color="grey300" parallel />
          <ExecutionStageButton icon="pending" color="grey300" />
          <ExecutionStageButton icon="pending" color="grey300" />
          <ExecutionStageButton icon="pending" color="grey300" />
          <ExecutionStageButton icon="pending" color="grey300" />
          <ExecutionStageButton icon="pending" color="grey300" />
          <ExecutionStageButton icon="pending" color="grey300" parallel />
          <ExecutionStageButton icon="pending" color="grey300" />
          <ExecutionStageButton icon="pending" color="grey300" />
          <ExecutionStageButton icon="pending" color="grey300" /> */}
          <span className={css.hidden} ref={elementRef}></span>
        </Container>
        <Button
          minimal
          icon="circle-arrow-right"
          onClick={() => onLeftRightBtnClick(true)}
          className={cx(css.btnRight, hideRightButton && css.hidden)}
          iconProps={{ size: 12 }}
          style={{ color: 'var(--grey-350)' }}
        />
      </Container>
      <Layout.Horizontal spacing="medium" margin={{ top: 'medium' }}>
        {(stageStatusCounts.success && (
          <Text icon="tick-circle" iconProps={{ color: 'green500', size: 10 }} font="small">
            {`${stageStatusCounts.success}/${totalStages}`}
          </Text>
        )) ||
          null}
        {(stageStatusCounts.failed && (
          <Text icon="tick-circle" iconProps={{ color: 'red500', size: 10 }} font="small">
            {`${stageStatusCounts.failed}/${totalStages}`}
          </Text>
        )) ||
          null}
        {(stageStatusCounts.running && (
          <Text icon="spinner" iconProps={{ color: 'blue500', size: 10 }} font="small">
            {`${stageStatusCounts.running}/${totalStages}`}
          </Text>
        )) ||
          null}
        {errorMsg && (
          <Text font="small" color={Color.RED_500}>
            {errorMsg}
          </Text>
        )}
      </Layout.Horizontal>
    </Container>
  )
}
