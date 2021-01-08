import React from 'react'
import { Menu } from '@blueprintjs/core'
import { Container, Button, Layout, Text } from '@wings-software/uicore'
import type { Column } from 'react-table'
import { useHistory } from 'react-router-dom'
import routes from '@common/RouteDefinitions'
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
  const getPageString = (key: string) => getString(`cf.targets.${key}`)
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

  return (
    <>
      <Container className={css.header}>
        <CreateTargetSegmentModal project={project} environment={environment} onCreate={onCreateSegment} />
      </Container>
      <Container flex className={css.content}>
        {!!segments?.length && (
          <Table<Segment>
            className={css.table}
            columns={columnDefs}
            data={segments}
            pagination={pagination}
            onRowClick={handleRowClick}
          />
        )}
        {(segments?.length === 0 && (
          <Text style={{ margin: '0 auto' }} padding="huge">
            {getPageString('noSegmentFound')}
          </Text>
        )) ||
          null}
      </Container>
    </>
  )
}

export default TargetSegmentsView
