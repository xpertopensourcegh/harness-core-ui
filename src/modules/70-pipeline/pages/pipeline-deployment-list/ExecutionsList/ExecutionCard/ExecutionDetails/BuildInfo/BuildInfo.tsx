import React from 'react'
import cx from 'classnames'
import { first } from 'lodash-es'
import { Color, Icon, Link, Text } from '@wings-software/uikit'
import { String, useStrings } from 'framework/exports'
import type { CIBuildResponseDTO } from '../Types/types'
import css from './BuildInfo.module.scss'

export interface BuildInfoProps {
  buildData: CIBuildResponseDTO
  showCommits: boolean
  toggleCommits: () => void
  className?: string
}

const BuildInfo: React.FC<BuildInfoProps> = props => {
  const { showCommits, toggleCommits, buildData, className } = props

  const { getString } = useStrings()

  let sourceInfo
  switch (buildData?.event) {
    case 'branch': {
      const lastCommit = first(buildData?.branch?.commits)
      sourceInfo = (
        <>
          <div className={css.gitInfo1}>
            <span className={css.greyBox}>
              <Icon className={css.greyBoxIcon} color={Color.GREY_500} name="git-branch" size={10} />
              <span className={css.ellipsis} style={{ maxWidth: '250px' }}>
                {buildData?.branch?.name}
              </span>
            </span>
            {lastCommit ? (
              <span className={css.greyBox}>
                <Icon className={css.greyBoxIcon} color={Color.GREY_500} name="git-commit" size={10} />
                {lastCommit?.id?.slice(0, 7)}
              </span>
            ) : null}
          </div>

          {lastCommit ? (
            <div className={css.gitInfo2}>
              <String stringID="execution.latestCommit" color={Color.GREY_500} />
              <Text className={cx(css.ellipsis, css.commitOrPrTitle)}>{lastCommit?.message}</Text>
              <Link tooltip={lastCommit?.message} withoutHref>
                <span className={css.moreBox}>
                  <Icon color={Color.GREY_500} name="more" size={10} />
                </span>
              </Link>
              <Link withoutHref onClick={toggleCommits}>
                <Icon color={Color.GREY_500} name={showCommits ? 'main-chevron-up' : 'main-chevron-down'} size={14} />
              </Link>
            </div>
          ) : null}
        </>
      )
      break
    }

    case 'pullRequest': {
      const lastCommit = first(buildData?.pullRequest?.commits)
      sourceInfo = (
        <>
          <div className={css.gitInfo1}>
            <span className={css.greyBox}>
              <span className={css.ellipsis} style={{ maxWidth: '150px' }}>
                {buildData?.pullRequest?.sourceRepo}
              </span>
              <span className={css.greyBoxDelimiter} />
              <Icon className={css.greyBoxIcon} name="git-branch" size={10} />
              <span className={css.ellipsis} style={{ maxWidth: '150px' }}>
                {buildData?.pullRequest?.sourceBranch}
              </span>
            </span>
            <Icon className={css.sourceTargetArrow} name="arrow-right" size={12} />
            <span className={css.greyBox}>
              <Icon className={css.greyBoxIcon} name="git-branch" size={10} />
              <span className={css.ellipsis} style={{ maxWidth: '150px' }}>
                {buildData?.pullRequest?.targetBranch}
              </span>
            </span>
          </div>

          <div className={css.gitInfo2}>
            <Text className={cx(css.ellipsis, css.commitOrPrTitle)}>{buildData?.pullRequest?.title}</Text>
            <Link tooltip={buildData?.pullRequest?.title} withoutHref>
              <span className={css.moreBox}>
                <Icon color={Color.GREY_500} name="more" size={10} />
              </span>
            </Link>
            <Link href={buildData?.pullRequest?.link} target="_blank">
              {getString('execution.prSymbol')} {buildData?.pullRequest?.id}
            </Link>
            <span className={css.pullRequestStatus}>{buildData?.pullRequest?.state}</span>
            {lastCommit ? (
              <Link withoutHref onClick={toggleCommits}>
                <Icon color={Color.GREY_500} name={showCommits ? 'main-chevron-up' : 'main-chevron-down'} size={14} />
              </Link>
            ) : null}
          </div>
        </>
      )
      break
    }
  }

  return <div className={className}>{sourceInfo}</div>
}

export default BuildInfo
