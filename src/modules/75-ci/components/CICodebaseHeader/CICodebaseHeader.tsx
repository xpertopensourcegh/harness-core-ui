import React from 'react'
import cx from 'classnames'
import { Text, Icon, Container, Layout } from '@wings-software/uicore'

import css from './CICodebaseHeader.module.scss'

interface CICodebaseHeaderProps {
  repo?: string
  branch?: string
  targetBranch?: string
  tag?: string
  isDetailedView?: boolean
}

export const CICodebaseHeader: React.FC<CICodebaseHeaderProps> = props => {
  const { repo = '', branch = '', tag = '', targetBranch = '', isDetailedView } = props

  return repo || branch ? (
    <Layout.Horizontal className={cx({ [css.strip]: isDetailedView })} spacing={tag ? 'small' : ''}>
      <div className={css.label}>
        {repo ? (
          <Container flex className={cx({ [css.separator]: branch })} padding={{ right: 'small' }}>
            <Icon name="repository" size={14} color="primary7" />
            <Text
              lineClamp={1}
              color="primary7"
              font={{ size: 'small', weight: 'semi-bold' }}
              className={css.partLabel}
            >
              {repo}
            </Text>
          </Container>
        ) : null}
        {branch ? (
          <Container flex padding={{ left: 'small' }}>
            <Icon name="git-new-branch" size={12} color="primary7" />
            <Text
              lineClamp={1}
              color="primary7"
              font={{ size: 'small', weight: 'semi-bold' }}
              className={css.partLabel}
            >
              {branch}
            </Text>
          </Container>
        ) : null}
      </div>
      {targetBranch ? (
        <Container flex>
          <Icon name="arrow-right" size={14} padding={{ left: 'small', right: 'small' }} />
          <Container flex padding={{ left: 'medium', right: 'small' }} className={css.label}>
            <Icon name="git-new-branch" size={12} color="primary7" />
            <Text lineClamp={1} color="primary7" font={{ size: 'small', weight: 'semi-bold' }}>
              {targetBranch}
            </Text>
          </Container>
        </Container>
      ) : null}
      {tag ? (
        <Container flex className={css.label}>
          <Icon name="tag" size={14} color="primary7" />
          <Text lineClamp={1} color="primary7" font={{ size: 'small', weight: 'semi-bold' }}>
            {tag}
          </Text>
        </Container>
      ) : null}
    </Layout.Horizontal>
  ) : null
}
