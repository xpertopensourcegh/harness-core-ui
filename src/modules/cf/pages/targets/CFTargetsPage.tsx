import React, { useEffect, useState } from 'react'
import { Button, Container, Layout, Select, SelectOption, Text } from '@wings-software/uikit'
import { Spinner } from '@blueprintjs/core'
import { omit } from 'lodash-es'
import { useParams } from 'react-router-dom'
import { useStrings } from 'framework/exports'
import { Target, Segment, useGetAllTargets, useGetAllSegments, useGetAllFeatures, Feature } from 'services/cf'
import { useEnvironments } from '@cf/hooks/environment'
import { SharedQueryParams } from '@cf/constants'
import { Page, useToaster } from '@common/exports'
import IndividualTargets from './IndividualTargets'
import TargetSegmentsView from './TargetSegmentsView'

interface HeaderContentProps {
  view: 'individual' | 'segments'
  leftLabel: string
  rightLabel: string
  onChangePage: () => void
}

const HeaderContent: React.FC<HeaderContentProps> = ({ view, onChangePage, leftLabel, rightLabel }) => (
  <Layout.Horizontal>
    <Button
      text={leftLabel}
      minimal={view === 'segments'}
      intent={view === 'individual' ? 'primary' : undefined}
      onClick={onChangePage}
    />
    <Button
      text={rightLabel}
      minimal={view === 'individual'}
      intent={view === 'segments' ? 'primary' : undefined}
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
  const { projectIdentifier, orgIdentifier, accountId } = useParams<any>()

  const { data: environments, loading: loadingEnvs, error: errEnvs } = useEnvironments({
    project: projectIdentifier,
    ...SharedQueryParams
  })

  const [view, setView] = useState<'individual' | 'segments'>('individual')
  const onChangePage = () => {
    view === 'individual' ? setTargetPage(0) : setSegmentPage(0)
    setView(view === 'individual' ? 'segments' : 'individual')
  }
  const { getString } = useStrings()
  const getSharedString = (key: string) => getString(`cf.shared.${key}`)
  const getPageString = (key: string) => getString(`cf.targets.${key}`)
  const [environment, setEnvironment] = useState<SelectOption>()

  const [targetPage, setTargetPage] = useState(0)
  const { data: targetsData, loading: loadingTargets, error: errTargets, refetch: fetchTargets } = useGetAllTargets({
    lazy: true,
    queryParams: {
      project: projectIdentifier,
      environment: (environment?.value || '') as string,
      pageNumber: targetPage,
      pageSize: 10,
      ...SharedQueryParams
    }
  })

  const [segmentPage, setSegmentPage] = useState(0)
  const {
    data: segmentsData,
    loading: loadingSegments,
    error: errSegments,
    refetch: fetchSegments
  } = useGetAllSegments({
    lazy: true,
    queryParams: {
      project: projectIdentifier,
      environment: (environment?.value || '') as string,
      pageNumber: segmentPage,
      pageSize: 10,
      ...SharedQueryParams
    }
  })

  const { data: flagsData, loading: loadingFlags, error: errFlags, refetch: fetchFlags } = useGetAllFeatures({
    lazy: true,
    queryParams: {
      project: projectIdentifier,
      environment: (environment?.value || '') as string,
      ...SharedQueryParams
    }
  })

  useEffect(() => {
    if (environment && view === 'individual') {
      fetchTargets({
        queryParams: {
          project: projectIdentifier,
          environment: (environment?.value || '') as string,
          pageNumber: targetPage,
          pageSize: 10,
          ...SharedQueryParams
        }
      })
    }
  }, [environment, view, targetPage])

  useEffect(() => {
    if (environment && view === 'segments') {
      fetchFlags()
      fetchSegments({
        queryParams: {
          project: projectIdentifier,
          environment: (environment?.value || '') as string,
          pageNumber: segmentPage,
          pageSize: 10,
          ...SharedQueryParams
        }
      })
    }
  }, [environment, view, segmentPage])

  useEffect(() => {
    if (!loadingEnvs) {
      setEnvironment(environments?.length > 0 ? environments[0] : { label: 'production', value: 'production' })
    }
  }, [loadingEnvs])

  useEffect(() => {
    if (errEnvs) {
      showError('Error fetching environments')
    }
  }, [errEnvs])

  useEffect(() => {
    if (errTargets) {
      showError('Error fetching targets')
    }
  }, [errTargets])

  useEffect(() => {
    if (errSegments) {
      showError('Error fetching target segments')
    }
  }, [errSegments])

  useEffect(() => {
    if (errFlags) {
      showError('Error fetching feature flags')
    }
  }, [errFlags])

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
            view={view}
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
      {view === 'individual' ? (
        <IndividualTargets
          loading={loadingTargets}
          targets={(targetsData?.targets ?? []) as Target[]}
          pagination={{ ...omit(targetsData, ['targets']), gotoPage: setTargetPage }}
          environment={environment?.value as string}
          project={projectIdentifier}
          onCreateTargets={fetchTargets}
        />
      ) : (
        <TargetSegmentsView
          loading={loadingSegments || loadingFlags}
          segments={(segmentsData?.segments || []) as Segment[]}
          flags={(flagsData?.features || []) as Feature[]}
          pagination={{ ...(omit(segmentsData, ['segments']) as any), gotoPage: setSegmentPage }}
          environment={environment?.value as string}
          project={projectIdentifier}
          orgIdentifier={orgIdentifier}
          accountId={accountId}
          onCreateSegment={fetchSegments}
        />
      )}
    </>
  )
}

export default CFTargetsPage
