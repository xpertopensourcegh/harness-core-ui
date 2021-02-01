import React from 'react'
import { Container, Text, FlexExpander } from '@wings-software/uicore'
import type { Delegate, DelegateProfile } from 'services/portal'
import { useStrings } from 'framework/exports'
import { delegateTypeToIcon } from './utils/DelegateHelper'
import css from './DelegateDetails.module.scss'

interface DelegateOverviewProps {
  delegate: Delegate
  delegateProfile: DelegateProfile
}

export const DelegateOverview: React.FC<DelegateOverviewProps> = ({ delegate, delegateProfile }) => {
  const { getString } = useStrings()

  return (
    <Container className={css.card} padding="xlarge">
      <Text
        font={{ size: 'medium', weight: 'bold' }}
        style={{ color: '#22272D', paddingBottom: 'var(--spacing-medium)' }}
      >
        {getString('overview')}
      </Text>

      <Container className={css.delegateOverviewEntry}>
        <Container flex>
          <Container>
            <Text
              style={{
                fontSize: '12px',
                lineHeight: '16px',
                color: 'var(--grey-450)',
                letterSpacing: '0.2px',
                paddingBottom: 'var(--spacing-xsmall)'
              }}
            >
              {getString('delegate.hostName')}
            </Text>
            <Text style={{ fontSize: '14px', lineHeight: '24px', color: '#22272D', letterSpacing: '-0.01px' }}>
              {delegate.hostName}
            </Text>
          </Container>
          <FlexExpander />
          <Container>
            <Text
              style={{
                fontSize: '12px',
                lineHeight: '16px',
                color: 'var(--grey-450)',
                letterSpacing: '0.2px',
                paddingBottom: 'var(--spacing-xsmall)'
              }}
            >
              {getString('delegate.delegateType')}
            </Text>
            <Text
              style={{ fontSize: '14px', color: 'var(--black)' }}
              icon={delegateTypeToIcon(delegate.delegateType as string)}
              iconProps={{ size: 21 }}
            >
              {delegate.delegateType}
            </Text>
          </Container>
        </Container>
      </Container>

      <Container className={css.delegateOverviewEntry}>
        <Text
          style={{
            fontSize: '12px',
            lineHeight: '16px',
            color: 'var(--grey-450)',
            letterSpacing: '0.2px',
            paddingBottom: 'var(--spacing-xsmall)'
          }}
        >
          {getString('delegate.delegateName')}
        </Text>
        <Text style={{ fontSize: '14px', lineHeight: '24px', color: '#22272D', letterSpacing: '-0.01px' }}>
          {delegate.delegateName}
        </Text>
      </Container>

      <Container className={css.delegateOverviewEntry}>
        <Text
          style={{
            fontSize: '12px',
            lineHeight: '16px',
            color: 'var(--grey-450)',
            letterSpacing: '0.2px',
            paddingBottom: 'var(--spacing-xsmall)'
          }}
        >
          {getString('delegate.delegateConfiguration')}
        </Text>
        <Text style={{ fontSize: '14px', lineHeight: '24px', color: '#25A6F7', letterSpacing: '-0.01px' }}>
          {delegateProfile.name}
        </Text>
      </Container>

      {delegate.description && (
        <Container className={css.delegateOverviewEntry}>
          <Text
            style={{
              fontSize: '12px',
              lineHeight: '16px',
              color: 'var(--grey-450)',
              letterSpacing: '0.2px',
              paddingBottom: 'var(--spacing-xsmall)'
            }}
          >
            {getString('description')}
          </Text>
          <Text style={{ fontSize: '14px', lineHeight: '24px', color: '#22272D', letterSpacing: '-0.01px' }}>
            {delegate.description}
          </Text>
        </Container>
      )}
    </Container>
  )
}
