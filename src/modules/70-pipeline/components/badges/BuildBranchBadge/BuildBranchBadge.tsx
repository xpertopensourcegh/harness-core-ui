import React from 'react'
import cx from 'classnames'
import { Color, Icon } from '@wings-software/uicore'

import css from './BuildBranchBadge.module.scss'

export interface BuildBranchBadgeProps {
  branchName?: string
  isTag?: boolean
  commitId?: string
  className?: string
}

export const BuildBranchBadge: React.FC<BuildBranchBadgeProps> = props => {
  const { branchName, isTag, commitId, className } = props

  return (
    <div className={cx(css.main, className)}>
      {branchName ? (
        <span className={css.greyBox}>
          <Icon className={css.greyBoxIcon} color={Color.GREY_500} name={isTag ? 'tag' : 'git-branch'} size={10} />
          <span className={css.branchName}>{branchName}</span>
        </span>
      ) : null}
      {commitId ? (
        <span className={css.greyBox}>
          <Icon className={css.greyBoxIcon} color={Color.GREY_500} name="git-commit" size={10} />
          {commitId?.slice(0, 7)}
        </span>
      ) : null}
    </div>
  )
}

export default BuildBranchBadge
