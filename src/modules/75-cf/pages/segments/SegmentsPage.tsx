import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import moment from 'moment'
import ReactTimeago from 'react-timeago'
import { Intent } from '@blueprintjs/core'
import { useHistory } from 'react-router-dom'
import { Container, FlexExpander, Layout, Pagination, Text } from '@wings-software/uicore'
import type { Cell, Column } from 'react-table'
import { ListingPageTemplate, ListingPageTitle } from '@cf/components/ListingPageTemplate/ListingPageTemplate'
import Table from '@common/components/Table/Table'
import {
  CF_DEFAULT_PAGE_SIZE,
  getErrorMessage,
  rewriteCurrentLocationWithActiveEnvironment,
  SEGMENT_PRIMARY_COLOR,
  showToaster
} from '@cf/utils/CFUtils'
import { useConfirmAction, useQueryParams } from '@common/hooks'
import { useStrings } from 'framework/strings'
import routes from '@common/RouteDefinitions'
import { useToaster } from '@common/exports'
import { OptionsMenuButton } from '@common/components'
import {
  makeStackedCircleShortName,
  StackedCircleContainer
} from '@cf/components/StackedCircleContainer/StackedCircleContainer'
import { NoEnvironment } from '@cf/components/NoEnvironment/NoEnvironment'
import type { EnvironmentResponseDTO } from 'services/cd-ng'
import { useEnvironmentSelectV2 } from '@cf/hooks/useEnvironmentSelectV2'
import { CFEnvironmentSelect } from '@cf/components/CFEnvironmentSelect/CFEnvironmentSelect'
import { Segment, useDeleteSegment, useGetAllSegments } from 'services/cf'
import { NoSegmentsView } from './NoSegmentsView'
import { NewSegmentButton } from './NewSegmentButton'

export const SegmentsPage: React.FC = () => {
  const urlQuery: Record<string, string> = useQueryParams()
  const [activeEnvironment, setActiveEnvironment] = useState<EnvironmentResponseDTO>()
  const {
    EnvironmentSelect,
    loading: loadingEnvironments,
    error: errEnvironments,
    refetch: refetchEnvs,
    environments
  } = useEnvironmentSelectV2({
    selectedEnvironmentIdentifier: urlQuery.activeEnvironment || activeEnvironment?.identifier,
    onChange: (_value, _environment, _userEvent) => {
      setActiveEnvironment(_environment)
      rewriteCurrentLocationWithActiveEnvironment(_environment)
    }
  })
  const { projectIdentifier, orgIdentifier, accountId } = useParams<Record<string, string>>()
  const { getString } = useStrings()
  const [pageNumber, setPageNumber] = useState(0)
  const queryParams = useMemo(
    () => ({
      project: projectIdentifier,
      environment: (activeEnvironment?.identifier || urlQuery.activeEnvironment || '') as string,
      pageNumber,
      pageSize: CF_DEFAULT_PAGE_SIZE,
      account: accountId,
      accountIdentifier: accountId,
      org: orgIdentifier
    }),
    [accountId, orgIdentifier, projectIdentifier, activeEnvironment?.identifier, pageNumber, urlQuery.activeEnvironment] // eslint-disable-line react-hooks/exhaustive-deps
  )
  const {
    data: segmentsData,
    loading: loadingSegments,
    error: errSegments,
    refetch: refetchSegments
  } = useGetAllSegments({
    queryParams
  })
  const history = useHistory()
  const loading = loadingEnvironments || loadingSegments
  const error = errEnvironments || errSegments
  const noSegmentExists = segmentsData?.segments?.length === 0
  const noEnvironmentExists = !loadingEnvironments && environments?.length === 0
  const title = getString('cf.shared.segments')

  const header = (
    <Layout.Horizontal flex={{ align: 'center-center' }} style={{ flexGrow: 1 }} padding={{ right: 'xlarge' }}>
      <ListingPageTitle style={{ borderBottom: 'none' }}>{title}</ListingPageTitle>
      <FlexExpander />
      {!!environments?.length && <CFEnvironmentSelect component={<EnvironmentSelect />} />}
    </Layout.Horizontal>
  )
  const gotoSegmentDetailPage = useCallback(
    (identifier: string): void => {
      history.push(
        routes.toCFSegmentDetails({
          segmentIdentifier: identifier as string,
          environmentIdentifier: activeEnvironment?.identifier as string,
          projectIdentifier,
          orgIdentifier,
          accountId
        }) + `${activeEnvironment?.identifier ? `?activeEnvironment=${activeEnvironment?.identifier}` : ''}`
      )
    },
    [history, accountId, orgIdentifier, projectIdentifier, activeEnvironment?.identifier] // eslint-disable-line react-hooks/exhaustive-deps
  )
  const toolbar = (
    <Layout.Horizontal>
      <NewSegmentButton
        accountId={accountId}
        orgIdentifier={orgIdentifier}
        projectIdentifier={projectIdentifier}
        environmentIdentifier={activeEnvironment?.identifier}
        onCreated={segmentIdentifier => {
          gotoSegmentDetailPage(segmentIdentifier)
          showToaster(getString('cf.messages.segmentCreated'))
        }}
      />
    </Layout.Horizontal>
  )
  const { showError, clear } = useToaster()
  const deleteSegmentParams = useMemo(
    () => ({
      account: accountId,
      accountIdentifier: accountId,
      org: orgIdentifier,
      project: projectIdentifier,
      environment: activeEnvironment?.identifier as string
    }),
    [accountId, orgIdentifier, projectIdentifier, activeEnvironment?.identifier] // eslint-disable-line react-hooks/exhaustive-deps
  )
  const { mutate: deleteSegment } = useDeleteSegment({
    queryParams: deleteSegmentParams
  })
  const columns: Column<Segment>[] = useMemo(
    () => [
      {
        Header: getString('cf.shared.segment').toUpperCase(),
        id: 'name',
        accessor: 'name',
        width: '45%',
        Cell: function NameCell(cell: Cell<Segment>) {
          const description = (cell.row.original as { description?: string })?.description

          return (
            <Layout.Horizontal spacing="xsmall" style={{ alignItems: 'center' }}>
              <StackedCircleContainer
                items={[{ name: cell.row.original.name, identifier: cell.row.original.identifier }]}
                keyOfItem={item => item.identifier}
                renderItem={item => <Text>{makeStackedCircleShortName(item.name)}</Text>}
                backgroundColor={() => SEGMENT_PRIMARY_COLOR}
                margin={{ right: 'small' }}
              />
              <Container>
                <Text style={{ fontWeight: 600, lineHeight: '24px', color: '#22222A' }}>{cell.row.original.name}</Text>
                {description && <Text>{description}</Text>}
              </Container>
            </Layout.Horizontal>
          )
        }
      },
      {
        Header: getString('identifier').toUpperCase(),
        id: 'identifier',
        accessor: 'identifier',
        width: '25%',
        Cell: function IdCell(cell: Cell<Segment>) {
          return <Text>{cell.row.original.identifier}</Text>
        }
      },
      {
        Header: getString('cf.targets.createdDate').toUpperCase(),
        id: 'createdAt',
        accessor: 'createdAt',
        width: '30%',
        Cell: function CreateAtCell(cell: Cell<Segment>) {
          const deleteSegmentConfirm = useConfirmAction({
            title: getString('cf.segments.delete.title'),
            message: (
              <Text>
                <span
                  dangerouslySetInnerHTML={{
                    __html: getString('cf.segments.delete.message', { segmentName: cell.row.original.name })
                  }}
                ></span>
              </Text>
            ),
            intent: Intent.DANGER,
            action: async () => {
              clear()

              try {
                deleteSegment(cell.row.original.identifier as string)
                  .then(() => {
                    refetchSegments()
                    showToaster(getString('cf.messages.segmentDeleted'))
                  })
                  .catch(_error => {
                    showError(getErrorMessage(_error), 0)
                  })
              } catch (err) {
                showError(getErrorMessage(err), 0)
              }
            }
          })

          return (
            <Layout.Horizontal flex={{ distribution: 'space-between', align: 'center-center' }}>
              <Text>
                <ReactTimeago date={moment(cell.row.original.createdAt).toDate()} />
              </Text>
              <Container
                style={{ textAlign: 'right' }}
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation()
                }}
              >
                <OptionsMenuButton
                  items={[
                    {
                      icon: 'edit',
                      text: getString('edit'),
                      onClick: () => {
                        gotoSegmentDetailPage(cell.row.original.identifier as string)
                      }
                    },
                    {
                      icon: 'cross',
                      text: getString('delete'),
                      onClick: deleteSegmentConfirm
                    }
                  ]}
                />
              </Container>
            </Layout.Horizontal>
          )
        }
      }
    ],
    [getString, clear, deleteSegment, gotoSegmentDetailPage, showError, refetchSegments]
  )

  useEffect(() => {
    return () => {
      clear()
    }
  }, [clear])

  const content = noEnvironmentExists ? (
    <Container flex={{ align: 'center-center' }} height="100%">
      <NoEnvironment onCreated={() => refetchEnvs()} />
    </Container>
  ) : noSegmentExists ? (
    <NoSegmentsView
      environmentIdentifier={activeEnvironment?.identifier}
      hasEnvironment={!!environments?.length}
      onNewSegmentCreated={segmentIdentifier => {
        gotoSegmentDetailPage(segmentIdentifier)
        showToaster(getString('cf.messages.segmentCreated'))
      }}
    />
  ) : (
    <Container padding={{ top: 'medium', right: 'xxlarge', left: 'xxlarge' }}>
      <Table<Segment>
        columns={columns}
        data={segmentsData?.segments || []}
        onRowClick={segment => {
          gotoSegmentDetailPage(segment.identifier as string)
        }}
      />
    </Container>
  )

  return (
    <ListingPageTemplate
      pageTitle={title}
      header={header}
      headerStyle={{ display: 'flex' }}
      toolbar={!error && !noEnvironmentExists && !noSegmentExists && toolbar}
      content={((!error || noEnvironmentExists) && content) || null}
      pagination={
        !noEnvironmentExists &&
        !!segmentsData?.segments?.length && (
          <Pagination
            itemCount={segmentsData?.itemCount || 0}
            pageSize={segmentsData?.pageSize || 0}
            pageCount={segmentsData?.pageCount || 0}
            pageIndex={pageNumber}
            gotoPage={index => {
              setPageNumber(index)
            }}
          />
        )
      }
      loading={loading}
      error={noEnvironmentExists ? undefined : error}
      retryOnError={() => {
        refetchEnvs()
        refetchSegments()
      }}
    />
  )
}
