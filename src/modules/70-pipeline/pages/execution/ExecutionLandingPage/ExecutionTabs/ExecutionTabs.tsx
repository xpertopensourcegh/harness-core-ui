import React from 'react'
import { Icon } from '@wings-software/uikit'
import { NavLink, useParams, useLocation, matchPath } from 'react-router-dom'
import cx from 'classnames'

import routes from '@common/RouteDefinitions'
import { accountPathProps, executionPathProps, pipelineModuleParams } from '@common/utils/routeUtils'
import type { ExecutionPathProps, PipelineType } from '@common/interfaces/RouteInterfaces'

import i18n from './ExecutionTabs.i18n'

import css from './ExecutionTabs.module.scss'

export default function ExecutionTabs(props: React.PropsWithChildren<{}>): React.ReactElement {
  const { children } = props
  const params = useParams<PipelineType<ExecutionPathProps>>()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  const isPipeLineView = !!matchPath(location.pathname, {
    path: routes.toExecutionPipelineView({ ...accountPathProps, ...executionPathProps, ...pipelineModuleParams })
  })
  const view = queryParams.get('view')
  const isGraphView = !view || view === 'graph'
  const isLogView = view === 'log'
  const indicatorRef = React.useRef<HTMLDivElement | null>(null)

  /* The following function does not have any business logic and hence can be ignored */
  /* istanbul ignore next */
  React.useEffect(() => {
    const id = window.setTimeout(() => {
      if (!indicatorRef.current) return

      const parent = indicatorRef.current.parentElement
      const activeLink = parent?.querySelector(`.${css.activeLink}`)

      if (!parent || !activeLink) return
      const parentRect = parent.getBoundingClientRect()
      const rect = activeLink.getBoundingClientRect()

      indicatorRef.current.style.transform = `translateX(${rect.x - parentRect.x}px) scaleX(${rect.width / 10})`
    }, 100)

    return () => {
      clearTimeout(id)
    }
  }, [location.pathname])

  return (
    <div className={css.main}>
      <div className={css.tabs}>
        <NavLink to={routes.toExecutionPipelineView(params)} className={css.tabLink} activeClassName={css.activeLink}>
          <Icon name="alignment-vertical-center" size={16} />
          <span>{i18n.piplines}</span>
        </NavLink>
        <NavLink to={routes.toExecutionInputsView(params)} className={css.tabLink} activeClassName={css.activeLink}>
          <Icon name="manually-entered-data" size={16} />
          <span>{i18n.inputs}</span>
        </NavLink>
        <NavLink to={routes.toExecutionArtifactsView(params)} className={css.tabLink} activeClassName={css.activeLink}>
          <Icon name="add-to-artifact" size={16} />
          <span>{i18n.artifacts}</span>
        </NavLink>
        <div ref={indicatorRef} className={css.tabIndicator} />
      </div>
      <div className={css.children}>{children}</div>
      {isPipeLineView ? (
        <div className={css.viewToggle}>
          <NavLink
            className={cx({ [css.activeView]: isGraphView })}
            to={`${routes.toExecutionPipelineView(params)}?view=graph`}
          >
            {i18n.graphView}
          </NavLink>
          <NavLink
            className={cx({ [css.activeView]: isLogView })}
            to={`${routes.toExecutionPipelineView(params)}?view=log`}
          >
            {i18n.logView}
          </NavLink>
        </div>
      ) : null}
    </div>
  )
}
