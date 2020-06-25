import React, { useState, useMemo } from 'react'
import { usePopper } from 'react-popper'
import cx from 'classnames'
import css from './DynamicPopover.module.scss'
import type * as PopperJS from '@popperjs/core'

export interface DynamicPopoverHandlerBinding<T> {
  show: (
    ref: Element | PopperJS.VirtualElement,
    data?: T,
    options?: { darkMode?: boolean; useArrows?: boolean }
  ) => void
  hide: () => void
}

export interface DynamicPopoverProps<T> {
  render: (data: T) => JSX.Element
  className?: string
  darkMode?: boolean
  useArrows?: boolean
  bind: (dynamicPopoverHandler: DynamicPopoverHandlerBinding<T>) => void
}

export function DynamicPopover<T>(props: DynamicPopoverProps<T>): JSX.Element {
  const { bind, render, className = '', darkMode = false, useArrows = true } = props
  const [darkModeState, setDarkMode] = useState<boolean>(darkMode)
  const [useArrowsState, setArrowVisibility] = useState<boolean>(useArrows)

  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null)
  const [data, setData] = useState<T>()
  const [arrowElement, setArrowElement] = useState<HTMLElement | null>(null)
  const [referenceElement, setReferenceElement] = useState<Element | PopperJS.VirtualElement | null>(null)
  const [visible, setVisibility] = useState<boolean>(false)

  const handler = useMemo(
    () =>
      ({
        show: (ref, dataTemp, options) => {
          setVisibility(true)
          setData(dataTemp)
          setReferenceElement(ref)
          if (options) {
            typeof options.darkMode === 'boolean' && setDarkMode(options.darkMode)
            typeof options.useArrows === 'boolean' && setArrowVisibility(options.useArrows)
          }
        },
        hide: () => {
          setVisibility(false)
        }
      } as DynamicPopoverHandlerBinding<T>),
    []
  )

  React.useEffect(() => {
    bind(handler)
  }, [bind, handler])

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    modifiers: [{ name: 'arrow', options: { element: arrowElement } }]
  })

  return (
    <>
      {visible && (
        <span
          ref={setPopperElement}
          className={cx(css.dynamicPopover, { [css.dark]: darkModeState }, className)}
          style={styles.popper}
          {...attributes.popper}
        >
          {data && render(data)}
          {useArrowsState && (
            <div className={css.arrow} data-popper-arrow="true" ref={setArrowElement} style={styles.arrow} />
          )}
        </span>
      )}
    </>
  )
}
