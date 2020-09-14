import React, { useState } from 'react'
import { Button, Icon, Link, Container } from '@wings-software/uikit'
import pipelines from './pipelines.png'
import Status from '../Status/Status'
import { ExecutionStatus } from '../common/status'
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

  // pipeline: Pipeline
  pipelineId: string
  pipelineName: string

  triggerType: string
  event: string

  // author: Author
  authorId: string
  avatar: string

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
}

// TO DO add BuildCardProps
export const BuildCard: React.FC<BuildCardProps> = props => {
  const copyFunction = (input: string): void => {
    navigator.clipboard.writeText(String(input))
    alert('copied')
  }

  const isPullRequest = props.event === 'pull_request'

  const duration = formatElapsedTime((props.endTime - props.startTime) / 1000)

  const elements = (
    <p>
      <Link className={css.links} href="//harness.io" target="_blank">
        {isPullRequest ? props.PRSourceBranch : i18n.master}
      </Link>
      <Icon name={isPullRequest ? 'arrow-right' : 'git-commit'} />
      <Link className={css.links} href="//harness.io" target="_blank">
        {isPullRequest ? props.PRTargetBranch : props.branchName}
      </Link>
      |
      <Link className={css.links} href="//harness.io" target="_blank">
        {props.pipelineName}
      </Link>
    </p>
  )

  // hardcoded tags
  const tags = ['Tag 1', 'Tag 2'].map((item, key) => {
    return (
      <div key={key} className={css.buildTag}>
        {item} <Icon className={css.deleteIcon} name="main-close" size={6} />
      </div>
    )
  })

  const [expanded, setExpanded] = useState(false)

  const commits =
    !isPullRequest &&
    props?.commits?.map((item, key) => {
      return (
        <div className={css.commitItem} key={key}>
          <div>
            {item.message} | {item.description}
          </div>
          <div>
            <Icon name="nav-user-profile" /> {item.ownerId} {i18n.commited}
            <span onClick={() => copyFunction(item.id)} className={css.commitHash}>
              {item.id.slice(0, 7)}
              <Icon size={16} name="clipboard" />
            </span>
          </div>
        </div>
      )
    })

  return (
    <Container className={css.buildCard}>
      <div className={css.topper}>
        <div className={css.leftSide}>
          <div className={css.buildId}>
            <Icon name="git-branch" />
            {i18n.buildId}
            {props.id}
          </div>
          {elements}
          <p>{!isPullRequest && props.commits && props.commits[0].message}</p>
        </div>

        <div className={css.rightSide}>
          <img src={pipelines}></img>
        </div>
      </div>
      <div className={css.lower}>
        <div>
          <Icon name="nav-user-profile" /> {props.authorId}| {props.triggerType}
        </div>
        <div className={css.buildCardStatus}>
          <Status status={ExecutionStatus.SUCCESS}>Build Successful</Status>{' '}
          <span>
            | <Icon name="nav-user-profile" /> {i18n.duration} {duration}
          </span>
        </div>
        <div>
          <Icon name="nav-user-profile" /> 10d ago | 8/31/2020 4:30:45
        </div>
        <div className={css.buildTags}>
          <Icon name="main-tags" /> {tags}
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
