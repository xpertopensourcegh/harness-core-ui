import React from 'react'
import { Menu, Spinner } from '@blueprintjs/core'
import { Container, Button, Layout, Text } from '@wings-software/uikit'
import type { Column } from 'react-table'
import { useHistory } from 'react-router-dom'
import routes from '@common/RouteDefinitions'
import { Page } from '@common/exports'
import Table from '@common/components/Table/Table'
import { useStrings } from 'framework/exports'
import type { Feature, Segment } from 'services/cf'
import CreateTargetSegmentModal from './CreateTargetSegmentModal'
import css from './CFTargetsPage.module.scss'

const UsedByCell: React.FC<any> = ({ value }: any) => {
  const { getString } = useStrings()
  return (
    <Layout.Horizontal flex={{ distribution: 'space-between', align: 'center-center' }}>
      <Text>{value.length} flags</Text>
      <Container
        style={{ textAlign: 'right' }}
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation()
        }}
      >
        <Button
          minimal
          icon="Options"
          iconProps={{ size: 24 }}
          tooltip={
            <Menu style={{ minWidth: 'unset' }}>
              <Menu.Item icon="edit" text={getString('edit')} />
              <Menu.Item icon="cross" text={getString('delete')} />
            </Menu>
          }
          tooltipProps={{ isDark: true, interactionKind: 'click' }}
        />
      </Container>
    </Layout.Horizontal>
  )
}

interface TargetSegmentsProps {
  loading: boolean
  segments: Segment[]
  flags: Feature[]
  pagination?: {
    itemCount: number
    pageCount: number
    pageIndex: number
    pageSize: number
    gotoPage: (pageNumber: number) => void
  }
  project: string
  environment: string
  accountId: string
  orgIdentifier: string
  onCreateSegment: () => void
}

const TargetSegmentsView: React.FC<TargetSegmentsProps> = ({
  loading,
  segments,
  flags,
  pagination,
  project,
  environment,
  orgIdentifier,
  accountId,
  onCreateSegment
}) => {
  const { getString } = useStrings()
  const history = useHistory()

  type CustomColumn<T extends Record<string, any>> = Column<T>
  const columnDefs: CustomColumn<Segment>[] = [
    {
      Header: getString('cf.segments.create').toLocaleUpperCase(),
      accessor: 'name',
      width: '30%'
    },
    {
      Header: getString('cf.segments.targetDefinition').toLocaleUpperCase(),
      accessor: () => 'Not yet implemented',
      width: '30%'
    },
    {
      Header: getString('cf.segments.usingSegment').toLocaleUpperCase(),
      accessor: (row: Segment) =>
        flags?.filter(f =>
          f.envProperties?.variationMap?.find(vm => vm.targetSegments?.find(ts => ts === row.identifier))
        ) || [],
      Cell: UsedByCell,
      width: '40%'
    }
  ]

  const handleRowClick = ({ identifier }: { identifier: string }) => {
    history.push(
      routes.toCFSegmentDetails({
        segmentIdentifier: identifier,
        projectIdentifier: project,
        environmentIdentifier: environment,
        orgIdentifier,
        accountId
      })
    )
  }

  if (loading) {
    return (
      <Container flex style={{ justifyContent: 'center', height: '100%' }}>
        <Spinner size={50} />
      </Container>
    )
  }

  return (
    <Page.Body>
      <Container className={css.header}>
        <CreateTargetSegmentModal project={project} environment={environment} onCreate={onCreateSegment} />
      </Container>
      <Container flex className={css.content}>
        <Table<Segment>
          className={css.table}
          columns={columnDefs}
          data={segments}
          pagination={pagination}
          onRowClick={handleRowClick}
        />
      </Container>
    </Page.Body>
  )
}

export default TargetSegmentsView
