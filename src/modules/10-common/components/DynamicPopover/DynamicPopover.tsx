import React, { useState } from 'react'
import { usePopper } from 'react-popper'
import cx from 'classnames'
import type * as PopperJS from '@popperjs/core'
import { isNil } from 'lodash-es'
import { useGlobalEventListener } from '@common/hooks'
import css from './DynamicPopover.module.scss'

declare global {
  interface WindowEventMap {
    UPDATE_POPOVER_POSITION: CustomEvent<string>
  }
}
export interface DynamicPopoverHandlerBinding<T> {
  show: (
    ref: Element | PopperJS.VirtualElement | string,
    data?: T,
    options?: { darkMode?: boolean; useArrows?: boolean; fixedPosition?: boolean; placement?: PopperJS.Placement },
    onHideCallBack?: () => void,
    isHoverView?: boolean
  ) => void
  hide: () => void
  isHoverView: () => boolean
}

export interface DynamicPopoverProps<T> {
  render: (data: T) => JSX.Element
  className?: string
  darkMode?: boolean
  useArrows?: boolean
  fixedPosition?: boolean
  bind: (dynamicPopoverHandler: DynamicPopoverHandlerBinding<T>) => void
  closeOnMouseOut?: boolean
}

export function DynamicPopover<T>(props: DynamicPopoverProps<T>): JSX.Element {
  const {
    bind,
    render,
    className = '',
    darkMode = false,
    useArrows = true,
    fixedPosition = false,
    closeOnMouseOut
  } = props
  const [darkModeState, setDarkMode] = useState<boolean>(darkMode)
  const [useArrowsState, setArrowVisibility] = useState<boolean>(useArrows)
  const [fixedPositionState, setFixedPosition] = useState<boolean>(fixedPosition)

  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null)
  const [data, setData] = useState<T>()
  const [arrowElement, setArrowElement] = useState<HTMLElement | null>(null)
  const [referenceElement, setReferenceElement] = useState<Element | PopperJS.VirtualElement | null>(null)
  const [visible, setVisibility] = useState<boolean>(false)
  const [hideCallback, setHideCallBack] = useState<() => void | undefined>()
  const [placement, setPlacement] = useState<PopperJS.Placement>('auto')
  const showTimerRef = React.useRef<number | null>(null)
  const mouseInRef = React.useRef<boolean>(false)
  const [isHoverView, setIsHoverView] = React.useState<boolean>()

  const { styles, attributes, forceUpdate } = usePopper(referenceElement, popperElement, {
    modifiers: [{ name: 'arrow', options: { element: arrowElement } }],
    placement
  })

  useGlobalEventListener('UPDATE_POPOVER_POSITION', () => {
    forceUpdate?.()
  })

  const clearTimeout = React.useCallback(() => {
    if (showTimerRef.current) {
      window.clearTimeout(showTimerRef.current)
      showTimerRef.current = null
    }
  }, [showTimerRef.current])

  const show: DynamicPopoverHandlerBinding<T>['show'] = React.useCallback(
    (ref, dataTemp, options, callback, hoverView) => {
      clearTimeout()
      setIsHoverView(!!hoverView)
      showTimerRef.current = window.setTimeout(
        () => {
          setData(dataTemp)
          if (options) {
            typeof options.darkMode === 'boolean' && setDarkMode(options.darkMode)
            typeof options.useArrows === 'boolean' && setArrowVisibility(options.useArrows)
            typeof options.fixedPosition === 'boolean' && setFixedPosition(options.fixedPosition)
            options.placement ? setPlacement(options.placement) : setPlacement('auto')
          }
          setHideCallBack(prev => {
            prev?.()
            return callback
          })
          if (typeof ref === 'string') {
            setReferenceElement(document.querySelector(ref))
          } else {
            setReferenceElement(ref)
          }
          setVisibility(true)
          clearTimeout()
        },
        hoverView ? 500 : 100
      )
    },
    [
      clearTimeout,
      setIsHoverView,
      setData,
      setDarkMode,
      setArrowVisibility,
      setFixedPosition,
      setPlacement,
      setHideCallBack,
      setReferenceElement,
      setVisibility
    ]
  )

  const hide = React.useCallback(() => {
    if (isNil(showTimerRef.current) && !mouseInRef.current) {
      setVisibility(false)
    }
    clearTimeout()
  }, [showTimerRef.current, mouseInRef.current, setVisibility, clearTimeout])

  const checkIfHoverView = React.useCallback(() => {
    return isHoverView
  }, [isHoverView])

  const handler = React.useMemo(() => {
    return {
      show: show,
      hide: hide,
      isHoverView: checkIfHoverView
    } as DynamicPopoverHandlerBinding<T>
  }, [show, hide, checkIfHoverView])

  React.useEffect(() => {
    if (!visible && hideCallback) {
      hideCallback()
      setHideCallBack(undefined)
    }
  }, [hideCallback, visible])

  React.useEffect(() => {
    bind(handler)
  }, [bind, handler])

  const popperStyle = fixedPositionState ? { ...styles.popper, transform: 'initial' } : styles.popper

  return (
    <>
      {visible && (
        <span
          ref={setPopperElement}
          className={cx(css.dynamicPopover, { [css.dark]: darkModeState }, className)}
          style={popperStyle}
          {...attributes.popper}
          onMouseEnter={() => {
            if (closeOnMouseOut) {
              mouseInRef.current = true
              setVisibility(true)
            }
          }}
          onMouseLeave={() => {
            if (closeOnMouseOut) {
              mouseInRef.current = false
              handler.hide()
            }
          }}
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
