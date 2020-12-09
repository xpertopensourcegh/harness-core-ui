import React, { useEffect, useState } from 'react'
import ReactTimeago from 'react-timeago'
import moment from 'moment'
import { Button, Card, Container, Icon, Layout, Popover, Select, SelectOption, Text } from '@wings-software/uikit'
import { Menu, Spinner } from '@blueprintjs/core'
import type { Column } from 'react-table'
import { useParams } from 'react-router-dom'
import { useStrings } from 'framework/exports'
import Table from '@common/components/Table/Table'
import { useGetAllTargets } from 'services/cf'
import { useEnvironments } from '@cf/hooks/environment'
import { Page, useToaster } from '@common/exports'
import type { Target } from 'services/cf'
import css from './CFTargetsPage.module.scss'

const PlaceholderCell: React.FC<any> = () => <Text>TBD</Text>
const TableCell: React.FC<any> = ({ value }) => <Text>{value}</Text>

const LastUpdatedCell: React.FC<any> = ({ value }: any) => {
  const [open, setOpen] = useState(false)
  return (
    <Layout.Horizontal flex={{ distribution: 'space-between', align: 'center-center' }}>
      <ReactTimeago date={moment(value).toDate()} />
      <Popover isOpen={open} onInteraction={setOpen}>
        <Icon size={24} name="Options" />
        <Menu>
          <Menu.Item icon="edit" text="Edit" />
          <Menu.Item icon="cross" text="Delete" />
        </Menu>
      </Popover>
    </Layout.Horizontal>
  )
}

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
  const { projectIdentifier } = useParams<{ projectIdentifier: string }>()
  const { data: environments, loading: loadingEnvs, error: errEnvs } = useEnvironments(projectIdentifier)
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
      environment: (environment?.value || '') as string
    }
  })

  const loading = loadingEnvs || loadingTargets

  useEffect(() => {
    if (environment) {
      fetchTargets()
    }
  }, [environment])

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

  if (loading) {
    return (
      <Container flex style={{ justifyContent: 'center', height: '100%' }}>
        <Spinner size={50} />
      </Container>
    )
  }
  type CustomColumn<T extends object> = Column<T>
  const columnDefs: CustomColumn<Target>[] = [
    {
      Header: getPageString('name').toLocaleUpperCase(),
      accessor: 'Name',
      width: '20%',
      Cell: TableCell
    },
    {
      Header: getPageString('ID'),
      accessor: 'Identifier',
      width: '20%',
      Cell: TableCell
    },
    {
      Header: getPageString('targetSegment').toLocaleUpperCase(),
      width: '20%',
      Cell: PlaceholderCell
    },
    {
      Header: getString('featureFlagsText').toLocaleUpperCase(),
      width: '20%',
      Cell: PlaceholderCell
    },
    {
      Header: getPageString('lastActivity').toLocaleUpperCase(),
      accessor: 'UpdatedAt',
      width: '20%',
      Cell: LastUpdatedCell
    }
  ]

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
      <Page.Body>
        <Card style={{ width: '100%' }}>
          <Button intent="primary" text="+ Target(s)" />
        </Card>
        <Container flex padding="medium">
          <Table<Target>
            className={css.table}
            columns={columnDefs}
            data={(targetsData || []) as Target[]}
            pagination={{
              itemCount: targetsData?.data?.itemCount || 0,
              pageSize: targetsData?.data?.pageSize || 7,
              pageCount: targetsData?.data?.pageCount || -1,
              pageIndex: targetsData?.data?.pageIndex || 0,
              gotoPage: () => undefined
            }}
          />
        </Container>
      </Page.Body>
    </>
  )
}

export default CFTargetsPage
