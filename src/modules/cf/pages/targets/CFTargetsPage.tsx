import React, { useEffect, useState } from 'react'
import { Button, Container, Layout, Select, SelectOption, Text } from '@wings-software/uikit'
import { Spinner } from '@blueprintjs/core'
import { useParams } from 'react-router-dom'
import { useStrings } from 'framework/exports'
import { TargetSegment, useGetAllTargets, useGetAllTargetSegments } from 'services/cf'
import type { Target } from 'services/cf'
import { useEnvironments } from '@cf/hooks/environment'
import { Page, useToaster } from '@common/exports'
import IndividualTargets from './IndividualTargets'
import TargetSegmentsView from './TargetSegmentsView'

interface HeaderContentProps {
  page: 'individual' | 'segments'
  leftLabel: string
  rightLabel: string
  onChangePage: () => void
}

const HeaderContent: React.FC<HeaderContentProps> = ({ page, onChangePage, leftLabel, rightLabel }) => (
  <Layout.Horizontal>
    <Button
      text={leftLabel}
      minimal={page === 'segments'}
      intent={page === 'individual' ? 'primary' : undefined}
      onClick={onChangePage}
    />
    <Button
      text={rightLabel}
      minimal={page === 'individual'}
      intent={page === 'segments' ? 'primary' : undefined}
      onClick={onChangePage}
    />
  </Layout.Horizontal>
)

interface HeaderToolbar {
  label: string
  environment: SelectOption
  environments: SelectOption[]
  onChange: (opt: SelectOption) => void
}

const HeaderToolbar: React.FC<HeaderToolbar> = ({ label, environment, environments, onChange }) => (
  <Layout.Horizontal flex={{ align: 'center-center' }}>
    <Text margin={{ right: 'small' }} font={{ weight: 'bold' }}>
      {label}
    </Text>
    <Select value={environment} items={environments} onChange={onChange} />
  </Layout.Horizontal>
)

const CFTargetsPage: React.FC = () => {
  const { showError } = useToaster()
  const { projectIdentifier } = useParams<{
    projectIdentifier: string
  }>()

  const { data: environments, loading: loadingEnvs, error: errEnvs } = useEnvironments({
    project: projectIdentifier,
    account: 'default',
    org: 'default_org'
  })

  const [page, setPage] = useState<'individual' | 'segments'>('individual')
  const onChangePage = () => setPage(page === 'individual' ? 'segments' : 'individual')
  const { getString } = useStrings()
  const getSharedString = (key: string) => getString(`cf.shared.${key}`)
  const getPageString = (key: string) => getString(`cf.targets.${key}`)
  const [environment, setEnvironment] = useState<SelectOption>()

  const { data: targetsData, loading: loadingTargets, error: errTargets, refetch: fetchTargets } = useGetAllTargets({
    lazy: true,
    queryParams: {
      project: projectIdentifier,
      environment: (environment?.value || '') as string,
      account: 'default',
      org: 'default_org'
    }
  })

  const {
    data: segmentsData,
    loading: loadingSegments,
    error: errSegments,
    refetch: fetchSegments
  } = useGetAllTargetSegments({
    lazy: true,
    queryParams: {
      project: projectIdentifier,
      environment: (environment?.value || '') as string,
      account: 'default',
      org: 'default_org'
    }
  })

  useEffect(() => {
    if (environment && page === 'individual') {
      fetchTargets()
    }
  }, [environment, page])

  useEffect(() => {
    if (environment && page === 'segments') {
      fetchSegments()
    }
  }, [environment, page])

  useEffect(() => {
    if (!loadingEnvs) {
      setEnvironment(environments?.length > 0 ? environments[0] : { label: 'production', value: 'production' })
    }
  }, [loadingEnvs])

  if (errEnvs) {
    showError('Error fetching environments')
  }
  if (errTargets) {
    showError('Error fetching targets')
  }
  if (errSegments) {
    showError('Error fetching target segments')
  }

  if (loadingEnvs) {
    return (
      <Container flex style={{ justifyContent: 'center', height: '100%' }}>
        <Spinner size={50} />
      </Container>
    )
  }

  return (
    <>
      <Page.Header
        title={getPageString('title')}
        size="medium"
        content={
          <HeaderContent
            leftLabel={getSharedString('individual')}
            rightLabel={getSharedString('segments')}
            page={page}
            onChangePage={onChangePage}
          />
        }
        toolbar={
          <HeaderToolbar
            label={getSharedString('environment').toLocaleUpperCase()}
            environment={environment || { label: 'production', value: 'production' }}
            environments={environments}
            onChange={setEnvironment}
          />
        }
      />
      {page === 'individual' ? (
        <IndividualTargets
          loading={loadingTargets}
          targets={(targetsData?.targets || []) as Target[]}
          environment={environment?.value as string}
          project={projectIdentifier}
          onCreateTargets={fetchTargets}
        />
      ) : (
        <TargetSegmentsView
          loading={loadingSegments}
          segments={(segmentsData?.data || []) as TargetSegment[]}
          environment={environment}
          project={projectIdentifier}
        />
      )}
    </>
  )
}

export default CFTargetsPage
