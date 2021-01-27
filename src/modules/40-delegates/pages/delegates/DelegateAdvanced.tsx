import React from 'react'
import { Card, Container, Intent, Tag, Text } from '@wings-software/uicore'
import { useStrings } from 'framework/exports'
import type { Delegate, DelegateProfile } from 'services/portal'
import css from './DelegateDetails.module.scss'

interface DelegateAdvancedProps {
  delegate: Delegate
  delegateProfile: DelegateProfile
}

export const DelegateAdvanced: React.FC<DelegateAdvancedProps> = ({ delegate, delegateProfile }) => {
  const { getString } = useStrings()

  return (
    <Card interactive={false} elevation={0} selected={false} className={css.advancedCard}>
      <Text font={{ size: 'medium', weight: 'bold' }}>{getString('advancedTitle')}</Text>
      <Container flex>
        <div className={css.addSpacing}>
          <Text font="small" style={{ marginBottom: '5px', color: 'var(--grey-350)' }}>
            {getString('delegate.delegateTags')}
          </Text>
          <Text font="small">{getString('delegate.delegateTagDescription')}</Text>
          <Text font="small" color="#4F4F4F">
            {getString('delegate.delegateSpecificTags')}
          </Text>
          {delegate?.tags &&
            delegate?.tags.map((tag: string) => {
              return (
                <Tag intent={Intent.PRIMARY} minimal={true} key={tag}>
                  <span>{tag}</span>
                </Tag>
              )
            })}
          <Text font="small">{getString('delegate.tagsFromDelegateConfig')}</Text>
          {delegateProfile?.selectors?.map((tag: string) => {
            return (
              <Tag intent={Intent.PRIMARY} minimal={true} key={tag}>
                <span>{tag}</span>
              </Tag>
            )
          })}
        </div>
      </Container>
    </Card>
  )
}
