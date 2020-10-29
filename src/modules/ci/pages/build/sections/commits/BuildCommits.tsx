import React from 'react'
import copy from 'copy-to-clipboard'
import moment from 'moment'
import { Card, Container, Text, Icon } from '@wings-software/uikit'
import { useToaster } from '@common/exports'
import { getShortCommitId, getTimeAgo } from 'modules/ci/services/CIUtils'
import type { CIBuildCommit } from 'services/ci'
import i18n from './BuildCommits.i18n'
// TODO: Delete once commit contains user's avatar url
import avatar from './images/avatar.jpg'
import { BuildPageContext } from '../../context/BuildPageContext'
import css from './BuildCommits.module.scss'

interface CommitsGroupedByTimestamp {
  timeStamp: number
  commits: CIBuildCommit[]
}

const BuildCommits: React.FC = () => {
  const { buildData } = React.useContext(BuildPageContext)

  const { showSuccess, showError } = useToaster()

  const copy2Clipboard = (text: string): void => {
    copy(String(text)) ? showSuccess(i18n.clipboardCopySuccess) : showError(i18n.clipboardCopyFail)
  }

  const commitsGroupedByTimestamp: CommitsGroupedByTimestamp[] = []

  buildData?.response?.data?.branch?.commits?.forEach(commit => {
    const index = commitsGroupedByTimestamp.findIndex(({ timeStamp: timestamp2 }) =>
      moment(commit.timeStamp).isSame(timestamp2, 'day')
    )

    if (index > -1) {
      commitsGroupedByTimestamp[index].commits.push(commit)
    } else {
      commitsGroupedByTimestamp.push({ timeStamp: commit.timeStamp || 0, commits: [commit] })
    }
  })

  return (
    <div className={css.wrapper}>
      {commitsGroupedByTimestamp.map(({ timeStamp, commits }) => (
        <div className={css.stack} key={String(timeStamp)}>
          <div className={css.stackHeader}>
            <Icon className={css.stackHeaderIcon} name="git-commit" size={20} margin={{ right: 'medium' }} />
            <Text className={css.stackHeaderText} font="small">
              {i18n.commitsOn} {moment(timeStamp).format('MMM D, YYYY')}
            </Text>
          </div>
          {commits.map(({ id = '', message = '', timeStamp: commitTimestamp = 0, ownerId, ownerName }) => {
            const [title, description] = message.split('\n\n')

            return (
              <Card className={css.commit} key={id}>
                <div>
                  <Text className={css.commitTitle} font="small">
                    {title}
                  </Text>
                  {description && (
                    <Text className={css.commitDescription} font="small" margin={{ top: 'xsmall' }}>
                      {description}
                    </Text>
                  )}
                </div>
                <Container flex>
                  <img className={css.avatar} src={avatar} alt={ownerName} />
                  <Text className={css.committed} font="xsmall" margin={{ right: 'xlarge' }}>
                    {ownerId} {i18n.committed} {getTimeAgo(commitTimestamp)}
                  </Text>
                  <button className={css.hash} onClick={() => copy2Clipboard(id)}>
                    <Text
                      className={css.hashText}
                      font={{ size: 'xsmall', weight: 'semi-bold' }}
                      padding={{ top: 'xsmall', right: 'small', bottom: 'xsmall', left: 'small' }}
                      margin={{ right: 'small' }}
                    >
                      {getShortCommitId(id)}
                    </Text>
                    <Icon className={css.hashIcon} name="clipboard" size={14} margin={{ right: 'small' }} />
                  </button>
                </Container>
              </Card>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export default BuildCommits
