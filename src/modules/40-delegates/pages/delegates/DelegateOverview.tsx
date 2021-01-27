import React from 'react'
import { Card, Container, Text } from '@wings-software/uicore'
import type { Delegate, DelegateProfile } from 'services/portal'
import { useStrings } from 'framework/exports'

import css from './DelegateDetails.module.scss'

interface DelegateOverviewProps {
  delegate: Delegate
  delegateProfile: DelegateProfile
}

export const DelegateOverview: React.FC<DelegateOverviewProps> = ({ delegate, delegateProfile }) => {
  const { getString } = useStrings()

  return (
    <Card interactive={false} elevation={0} selected={false} className={css.overview}>
      <Text font={{ size: 'medium', weight: 'bold' }}>{getString('overview')}</Text>
      <Container flex>
        <div>
          <Text font="small" style={{ marginBottom: 'var(--spacing-small)', color: 'var(--grey-350)' }}>
            {getString('delegate.hostName')}
          </Text>
          <Text font="small" className={css.cardValue}>
            {delegate?.hostName}
          </Text>
        </div>
        {delegate.delegateType && (
          <div>
            <Text font="small" style={{ marginBottom: 'var(--spacing-small)', color: 'var(--grey-350)' }}>
              {getString('delegate.delegateType')}
            </Text>
            <Text font="small" className={css.cardValue}>
              {delegate.delegateType}
            </Text>
          </div>
        )}
      </Container>

      {delegate.delegateProfileId && (
        <div className={css.addSpacing}>
          <hr className={css.labelSeparator} />
          <Container flex>
            <div>
              <Text font="small" style={{ marginBottom: 'var(--spacing-small)', color: 'var(--grey-350)' }}>
                {getString('delegate.delegateConfiguration')}
              </Text>
              <Text font="small" className={css.cardValue}>
                {delegateProfile.name}
              </Text>
            </div>
          </Container>
        </div>
      )}

      {delegate.description && (
        <div className={css.addSpacing}>
          <div>
            <hr className={css.labelSeparator} />
            <Container flex>
              <div>
                <Text font="small" style={{ marginBottom: 'var(--spacing-small)', color: 'var(--grey-350)' }}>
                  {getString('description')}
                </Text>
                <Text font="small" className={css.cardValue}>
                  {delegate.description}
                </Text>
              </div>
            </Container>
          </div>
        </div>
      )}
    </Card>
  )
}
