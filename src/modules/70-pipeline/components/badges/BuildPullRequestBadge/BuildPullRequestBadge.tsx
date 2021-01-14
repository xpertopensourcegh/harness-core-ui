import React from 'react'
import cx from 'classnames'
import { Icon } from '@wings-software/uicore'

import css from './BuildPullRequestBadge.module.scss'

export interface BuildPullRequestBadgeProps {
  sourceRepo?: string
  sourceBranch?: string
  targetBranch?: string
  className?: string
}

export const BuildPullRequestBadge: React.FC<BuildPullRequestBadgeProps> = props => {
  const { sourceRepo, sourceBranch, targetBranch, className } = props

  return (
    <div className={cx(css.main, className)}>
      <span className={css.greyBox}>
        {sourceRepo && (
          <>
            <span className={cx(css.ellipsis, css.sourceRepo)}>{sourceRepo}</span>
            <span className={css.greyBoxDelimiter} />
          </>
        )}
        <Icon className={css.greyBoxIcon} name="git-branch" size={10} />
        <span className={cx(css.ellipsis, css.sourceBranch)}>{sourceBranch}</span>
      </span>
      <Icon className={css.sourceTargetArrow} name="arrow-right" size={12} />
      <span className={css.greyBox}>
        <Icon className={css.greyBoxIcon} name="git-branch" size={10} />
        <span className={cx(css.ellipsis, css.targetBranch)}>{targetBranch}</span>
      </span>
    </div>
  )
}

export default BuildPullRequestBadge
