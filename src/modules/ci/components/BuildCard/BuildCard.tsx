import React, { useState } from 'react'
import { first, noop } from 'lodash-es'
import copy from 'copy-to-clipboard'
import { Button, Icon, Link, Container, Text, Color, IconName } from '@wings-software/uikit'
import ReactTimeago from 'react-timeago'
import { ExecutionStatus, status2Message } from 'modules/ci/components/common/status'
import { getShortCommitId } from 'modules/ci/services/CIUtils'
import { useToaster } from 'modules/common/exports'
import type { ExecutionPipeline } from 'modules/pipeline/exports'
import type { CIBuildCommit, GraphVertex } from 'services/ci'
import { CIExecutionStageGraph } from '../CIExecutionStageGraph/CIExecutionStageGraph'
import Status from '../Status/Status'
import { formatElapsedTime } from '../common/time'
import i18n from './BuildCard.i18n'
import css from './BuildCard.module.scss'

export interface BuildCardProps {
  id: number
  startTime: number
  endTime: number
  status: string

  triggerType: string
  event: 'pull_request' | 'branch'

  // pipeline
  pipelineId?: string
  pipelineName?: string

  // author
  authorId?: string
  avatar?: string

  // branch
  branchName?: string
  branchLink?: string
  commits?: CIBuildCommit[]

  // pull request
  PRId?: number
  PRLink?: string
  PRTitle?: string
  PRBody?: string
  PRSourceBranch?: string
  PRTargetBranch?: string
  PRState?: string

  pipeline: ExecutionPipeline<GraphVertex>

  onClick?: (id: number) => void
}

const getIconForEvent = (event: 'pull_request' | 'branch'): IconName => {
  switch (event) {
    case 'pull_request':
      return 'git-branch'
    case 'branch':
      return 'git-commit'
  }
}

export const BuildCard: React.FC<BuildCardProps> = props => {
  const { pipeline, onClick = noop } = props
  const [expanded, setExpanded] = useState(false)
  const { showSuccess, showError } = useToaster()

  const copy2Clipboard = (text: string): void => {
    copy(String(text)) ? showSuccess(i18n.clipboardCopySuccess) : showError(i18n.clipboardCopyFail)
  }

  const endTime = props.endTime ? props.endTime : Date.now()
  const duration = formatElapsedTime(Math.abs(endTime - props.startTime) / 1000)

  const lastCommit = first(props.commits)
  let sourceInfo

  switch (props.event) {
    case 'branch':
      sourceInfo = (
        <>
          <Link className={css.links} href={props.branchLink} target="_blank">
            {props.branchName}
          </Link>
          {lastCommit && (
            <>
              <Icon name="git-commit" size={12} color={Color.GREY_450} padding={{ left: 'xsmall', right: 'xsmall' }} />
              <Link className={css.links} href={lastCommit.link} target="_blank">
                {getShortCommitId(lastCommit.id as string)}
              </Link>
              <Text className={css.message}>{lastCommit.message}</Text>
            </>
          )}
        </>
      )
      break
    case 'pull_request':
      sourceInfo = (
        <>
          <span className={css.prBranchName}>{props.PRSourceBranch}</span>
          <Icon name="arrow-right" size={12} color={Color.GREY_350} padding={{ left: 'xsmall', right: 'xsmall' }} />
          <span className={css.prBranchName}>{props.PRTargetBranch}</span>
          <Text className={css.message}>{props.PRTitle}</Text>
          <Link className={css.links} href={props.PRLink} target="_blank">
            {i18n.prIdSymbol} {props.PRId}
          </Link>
          <span className={css.pullRequestStatus}>{props.PRState}</span>
        </>
      )
      break
  }

  const commits = props?.commits?.map(item => {
    return (
      <div className={css.commitItem} key={item.id}>
        <div>
          {item.message?.slice(0, 80)} {/*description missing in API?: item. && <>| {item.description}</>*/}
        </div>
        <div>
          <Icon name="nav-user-profile" />
          <span>
            {item.ownerId}
            {/*timeStamp missing in API?: <ReactTimeago date={item.timeStamp} />*/}
          </span>
          <Text className={css.commitHash} onClick={() => copy2Clipboard(item.id as string)}>
            {getShortCommitId(item.id as string)}
            <Icon size={12} name="clipboard" color={Color.BLUE_600} margin={{ left: 'xsmall' }} />
          </Text>
        </div>
      </div>
    )
  })

  return (
    <Container
      background="white"
      padding={{ left: 'large', right: 'large' }}
      margin={{ top: 'medium', bottom: 'medium' }}
      className={css.buildCard}
    >
      <div className={css.topper}>
        <Container className={css.leftSide}>
          <div className={css.buildTitle} onClick={() => onClick(props.id)}>
            <Icon color={Color.PURPLE_500} name={getIconForEvent(props.event as 'branch' | 'pull_request')} size={20} />
            <Text inline font={{ weight: 'semi-bold' }} color={Color.GREY_800}>
              {props.pipelineName} | {i18n.buildId} {props.id}
            </Text>
            <Status className={css.status} status={(props?.status as unknown) as ExecutionStatus}>
              {status2Message((props?.status as unknown) as ExecutionStatus)}
            </Status>
          </div>
          {sourceInfo}
        </Container>

        <Container className={css.rightSide}>
          <CIExecutionStageGraph pipeline={pipeline} />
          <div>
            <Button minimal icon="pause" small />
            <Button minimal icon="stop" small />
            <Button minimal icon="more" small />
          </div>
        </Container>
      </div>
      <div className={css.lower}>
        <div className={css.creatorInfo}>
          <img src={props.avatar} className={css.avatar} />
          <span>
            {props.authorId} | {props.triggerType}
          </span>
        </div>
        <div className={css.duration}>
          <div>
            <Icon name="time" size={12} color={Color.GREY_350} />
            <Text inline font={{ size: 'xsmall' }} color={Color.GREY_500}>
              {i18n.duration} {duration}
            </Text>
          </div>
          <div>
            <Icon name="calendar" size={12} color={Color.GREY_350} />
            <Text inline font={{ size: 'xsmall' }} color={Color.GREY_500}>
              <ReactTimeago date={props.startTime} />
            </Text>
          </div>
        </div>
        <Button
          disabled={!commits}
          icon={expanded ? 'chevron-up' : 'chevron-down'}
          minimal
          onClick={() => {
            setExpanded(!expanded)
          }}
        />
      </div>
      {expanded && commits && <div className={css.extendedPart}>{commits}</div>}
    </Container>
  )
}
