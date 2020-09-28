import React, { useState } from 'react'
import { noop } from 'lodash-es'
import { Button, Icon, Link, Container, Text } from '@wings-software/uikit'
import ReactTimeago from 'react-timeago'
import { ExecutionStatus, status2Message } from 'modules/ci/components/common/status'
import pipelines from './pipelines.png'
import Status from '../Status/Status'
import { formatElapsedTime } from '../common/time'
import i18n from './BuildCard.i18n'
import css from './BuildCard.module.scss'

export interface Commit {
  id: string
  link: string
  message: string
  description?: string
  ownerName: string
  ownerId: string
  ownerEmail: string
}
export interface BuildCardProps {
  id: number
  startTime: number
  endTime: number
  status: string

  // pipeline: Pipeline
  pipelineId?: string
  pipelineName?: string

  triggerType: string
  event: string

  // author: Author
  authorId?: string
  avatar?: string

  // Branch
  branchName?: string
  branchLink?: string
  commits?: Commit[]

  // PullRequest
  PRId?: number
  PRLink?: string
  PRTitle?: string
  PRBody?: string
  PRSourceBranch?: string
  PRTargetBranch?: string
  PRState?: string
  onClick?: (id: number) => void
}

// TO DO add BuildCardProps
export const BuildCard: React.FC<BuildCardProps> = props => {
  const { onClick = noop } = props

  const copyFunction = (input: string): void => {
    navigator.clipboard.writeText(String(input))
    alert('copied')
  }

  const isPullRequest = props.event === 'pull_request'

  const duration = formatElapsedTime(Math.abs(props.endTime - props.startTime) / 1000)

  const elements = (
    <p>
      <Link className={css.links} href="//harness.io" target="_blank">
        {isPullRequest ? props.PRSourceBranch : i18n.master}
      </Link>
      <Icon name={isPullRequest ? 'arrow-right' : 'git-commit'} />
      <Link className={css.links} href="//harness.io" target="_blank">
        {isPullRequest ? props.PRTargetBranch : props.branchName}
      </Link>
      <Text className={css.lastCommit}>{!isPullRequest && props.commits && props.commits[0].message}</Text>
    </p>
  )

  const [expanded, setExpanded] = useState(false)

  const commits =
    !isPullRequest &&
    props?.commits?.map((item, key) => {
      return (
        <div className={css.commitItem} key={key}>
          <div>
            {item.message.slice(0, 80)} | {item.description}
          </div>
          <div>
            <Icon name="nav-user-profile" /> {item.ownerId} {i18n.commited}
            <Text onClick={() => copyFunction(item.id)} className={css.commitHash}>
              {item.id.slice(0, 7)}
              <Icon size={12} name="clipboard" />
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
          <div className={css.buildId} onClick={() => onClick(props.id)}>
            <Icon color="green800" name="git-branch" />
            {i18n.buildId} {props.id} | {props.pipelineName}
            <Status className={css.status} status={(props?.status as unknown) as ExecutionStatus}>
              {status2Message((props?.status as unknown) as ExecutionStatus)}
            </Status>
          </div>
          {elements}
        </Container>

        <Container className={css.rightSide}>
          <img src={pipelines}></img>
          <div>
            <Button minimal icon="pause" />
            <Button minimal icon="command-stop" />
            <Button minimal icon="more" />
          </div>
        </Container>
      </div>
      <div className={css.lower}>
        <div className={css.creatorInfo}>
          <Icon name="nav-user-profile" /> {props.authorId}| {props.triggerType}
        </div>
        <div className={css.duration}>
          <Icon name="nav-user-profile" /> {i18n.duration} {duration} | <Icon name="time" />
          <ReactTimeago date={props.startTime} />
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
