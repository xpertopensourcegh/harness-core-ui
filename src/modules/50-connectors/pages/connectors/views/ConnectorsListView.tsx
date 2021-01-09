import React, { useState, useMemo, useEffect } from 'react'
import { Text, Layout, Color, Icon, Button, Popover } from '@wings-software/uicore'
import type { CellProps, Renderer, Column } from 'react-table'
import { Menu, Classes, Position, Intent } from '@blueprintjs/core'
import { useParams, useHistory, useLocation } from 'react-router-dom'
import ReactTimeago from 'react-timeago'
import { String } from 'framework/exports'
import {
  ConnectorResponse,
  useDeleteConnector,
  PageConnectorResponse,
  useGetTestConnectionResult,
  ConnectorConnectivityDetails,
  ConnectorInfoDTO
} from 'services/cd-ng'
import Table from '@common/components/Table/Table'
import { useConfirmationDialog } from '@common/exports'
import { useToaster } from '@common/components/Toaster/useToaster'

import TagsPopover from '@common/components/TagsPopover/TagsPopover'

import { StepIndex, STEP } from '@connectors/common/VerifyOutOfClusterDelegate/VerifyOutOfClusterDelegate'

import type { StepDetails } from '@connectors/interfaces/ConnectorInterface'

import { ConnectorStatus, Connectors } from '@connectors/constants'

import { useStrings } from 'framework/exports'

import { getIconByType } from '../utils/ConnectorUtils'
import i18n from './ConnectorsListView.i18n'
import css from './ConnectorsListView.module.scss'

interface ConnectorListViewProps {
  data?: PageConnectorResponse
  reload?: () => Promise<void>
  gotoPage: (pageNumber: number) => void
}

type CustomColumn<T extends object> = Column<T> & {
  reload?: () => Promise<void>
}

const getConnectorDisplaySummaryLabel = (titleStringId: string, value: string): JSX.Element | string => {
  return (
    <>
      {titleStringId ? <String stringID={titleStringId} /> : null}
      {value ? (
        <Text inline margin={{ left: 'xsmall' }} color={Color.BLACK}>
          {`(${value})`}
        </Text>
      ) : null}
    </>
  )
}

const getConnectorDisplaySummary = (connector: ConnectorInfoDTO): JSX.Element | string => {
  switch (connector?.type) {
    case Connectors.KUBERNETES_CLUSTER:
      return getConnectorDisplaySummaryLabel('UrlLabel', connector?.spec?.credential?.spec?.masterUrl)
    case Connectors.GIT:
    case Connectors.GITHUB:
    case Connectors.GITLAB:
    case Connectors.BITBUCKET:
      return getConnectorDisplaySummaryLabel('UrlLabel', connector?.spec?.url)
    case Connectors.DOCKER:
      return getConnectorDisplaySummaryLabel('UrlLabel', connector?.spec?.dockerRegistryUrl)
    case Connectors.NEXUS:
      return getConnectorDisplaySummaryLabel('UrlLabel', connector?.spec?.nexusServerUrl)
    case Connectors.ARTIFACTORY:
      return getConnectorDisplaySummaryLabel('UrlLabel', connector?.spec?.nexusSeartifactoryServerUrlrverUrl)
    default:
      return ''
  }
}

const RenderColumnConnector: Renderer<CellProps<ConnectorResponse>> = ({ row }) => {
  const data = row.original
  const tags = data.connector?.tags || {}
  return (
    <Layout.Horizontal spacing="small">
      <Icon name={getIconByType(data.connector?.type)} size={30}></Icon>
      <div className={css.wrapper}>
        <Layout.Horizontal spacing="small">
          <div className={css.name} title={data.connector?.name}>
            {data.connector?.name}
          </div>
          {tags && Object.keys(tags).length ? <TagsPopover tags={tags} /> : null}
        </Layout.Horizontal>
        <div className={css.identifier} title={data.connector?.identifier}>
          {data.connector?.identifier}
        </div>
      </div>
    </Layout.Horizontal>
  )
}
const RenderColumnDetails: Renderer<CellProps<ConnectorResponse>> = ({ row }) => {
  const data = row.original

  return data.connector ? (
    <div>
      <Text color={Color.BLACK} lineClamp={2} className={css.summaryLabel}>
        {getConnectorDisplaySummary(data.connector)}
      </Text>
      <Text color={Color.GREY_400}>{data.connector?.description}</Text>
    </div>
  ) : null
}

const RenderColumnActivity: Renderer<CellProps<ConnectorResponse>> = ({ row }) => {
  const data = row.original
  return (
    <Layout.Horizontal spacing="small">
      <Icon name="activity" />
      {data.lastModifiedAt ? <ReactTimeago date={data.lastModifiedAt} /> : null}
    </Layout.Horizontal>
  )
}
const RenderColumnStatus: Renderer<CellProps<ConnectorResponse>> = ({ row }) => {
  const data = row.original
  const { accountId, orgIdentifier, projectIdentifier } = useParams()
  const [testing, setTesting] = useState(false)
  const [lastTestedAt] = useState<number>()
  const [status, setStatus] = useState<ConnectorConnectivityDetails['status']>(data.status?.status)

  // Todo: const [testConnectionResponse, setTestConnectionResponse] = useState()

  const [errorMessage, setErrorMessage] = useState('')
  const { getString } = useStrings()

  const [stepDetails, setStepDetails] = useState<StepDetails>({
    step: 1,
    intent: Intent.WARNING,
    status: 'PROCESS' // Replace when enum is added in uikit
  })

  const { mutate: reloadTestConnection } = useGetTestConnectionResult({
    identifier: data.connector?.identifier || '',
    queryParams: { accountIdentifier: accountId, orgIdentifier: orgIdentifier, projectIdentifier: projectIdentifier },
    requestOptions: {
      headers: {
        'content-type': 'application/json'
      }
    }
  })

  const executeStepVerify = async (): Promise<void> => {
    if (stepDetails.step === StepIndex.get(STEP.TEST_CONNECTION)) {
      if (stepDetails.status === 'PROCESS') {
        try {
          const result = await reloadTestConnection()

          if (result?.data?.status === 'SUCCESS') {
            setStepDetails({
              step: 2,
              intent: Intent.SUCCESS,
              status: 'DONE'
            })
          } else {
            setErrorMessage(result.data?.errorSummary as string)
            setStepDetails({
              step: 1,
              intent: Intent.DANGER,
              status: 'ERROR'
            })
          }
          setTesting(false)
        } catch (err) {
          setErrorMessage(err.message as string)
          setStepDetails({
            step: 1,
            intent: Intent.DANGER,
            status: 'ERROR'
          })
          setTesting(false)
        }
      }
    }
  }

  useEffect(() => {
    if (data.status?.status) {
      setStatus(data.status?.status)
    }
    if (data.status?.errorMessage) {
      setErrorMessage(data.status?.errorMessage)
    }
  }, [data.status])
  return (
    <Layout.Horizontal>
      {!testing ? (
        <Layout.Vertical width="100px">
          <Layout.Horizontal spacing="small">
            {data.status?.status ? (
              <Text
                inline
                icon={status === ConnectorStatus.SUCCESS ? 'full-circle' : 'warning-sign'}
                iconProps={{
                  size: status === ConnectorStatus.SUCCESS ? 6 : 12,
                  color: status === ConnectorStatus.SUCCESS ? Color.GREEN_500 : Color.RED_500
                }}
                tooltip={
                  <Layout.Vertical font={{ size: 'small' }} padding="xsmall" spacing="xsmall">
                    <Text>{errorMessage || data.status?.errorMessage}</Text>
                    <Text color={Color.BLUE_600}>{getString('connectors.testConnectionStep.errorDetails')}</Text>
                  </Layout.Vertical>
                }
                tooltipProps={{ isDark: true }}
              >
                {status === ConnectorStatus.SUCCESS ? i18n.success : i18n.failed}
              </Text>
            ) : null}
          </Layout.Horizontal>
          {data.status ? (
            <Text font={{ size: 'small' }} color={Color.GREY_400}>
              {<ReactTimeago date={lastTestedAt || data.status?.lastTestedAt || ''} />}
            </Text>
          ) : null}
        </Layout.Vertical>
      ) : (
        <Layout.Horizontal>
          {/* Todo:  <Popover interactionKind={PopoverInteractionKind.HOVER} position={Position.LEFT_TOP}> */}

          <Button intent="primary" minimal loading />
          {/* <div className={css.testConnectionPop}> */}
          {/* <StepsProgress
                steps={[getStepOne() || '', i18n.STEPS.TWO, i18n.STEPS.THREE]}
                intent={stepDetails.intent}
                current={stepDetails.step}
                currentStatus={stepDetails.status}
              /> */}
          {/* </div> */}
          {/* </Popover> */}
          <Text style={{ margin: 8 }}>{i18n.TestInProgress}</Text>
        </Layout.Horizontal>
      )}
      {!testing && (status === 'FAILURE' || data.status?.status === 'FAILURE') ? (
        <Button
          font="small"
          className={css.testBtn}
          text={i18n.TEST_CONNECTION}
          onClick={e => {
            e.stopPropagation()
            setTesting(true)
            executeStepVerify()
          }}
        />
      ) : null}
    </Layout.Horizontal>
  )
}

const RenderColumnMenu: Renderer<CellProps<ConnectorResponse>> = ({ row, column }) => {
  const data = row.original
  const isHarnessManaged = data.harnessManaged
  const [menuOpen, setMenuOpen] = useState(false)
  const { showSuccess, showError } = useToaster()
  const { accountId, orgIdentifier, projectIdentifier } = useParams()

  const { mutate: deleteConnector } = useDeleteConnector({
    queryParams: { accountIdentifier: accountId, orgIdentifier: orgIdentifier, projectIdentifier: projectIdentifier }
  })

  const { openDialog } = useConfirmationDialog({
    contentText: i18n.confirmDelete(data.connector?.name || ''),
    titleText: i18n.confirmDeleteTitle,
    confirmButtonText: i18n.deleteButton,
    cancelButtonText: i18n.cancelButton,
    onCloseDialog: async (isConfirmed: boolean) => {
      if (isConfirmed) {
        try {
          const deleted = await deleteConnector(data.connector?.identifier || '', {
            headers: { 'content-type': 'application/json' }
          })

          if (deleted) showSuccess(`Connector ${data.connector?.name} deleted`)
          ;(column as any).reload?.()
        } catch (err) {
          showError(err?.data?.message || err?.message)
        }
      }
    }
  })

  const handleDelete = (e: React.MouseEvent<HTMLElement, MouseEvent>): void => {
    e.stopPropagation()
    setMenuOpen(false)
    if (!data?.connector?.identifier) return
    openDialog()
  }

  return (
    !isHarnessManaged && (
      <Layout.Horizontal className={css.layout}>
        <Popover
          isOpen={menuOpen}
          onInteraction={nextOpenState => {
            setMenuOpen(nextOpenState)
          }}
          className={Classes.DARK}
          position={Position.RIGHT_TOP}
        >
          <Button
            minimal
            icon="Options"
            iconProps={{ size: 20 }}
            onClick={e => {
              e.stopPropagation()
              setMenuOpen(true)
            }}
          />
          <Menu style={{ minWidth: 'unset' }}>
            <Menu.Item icon="edit" text="Edit" />
            <Menu.Item icon="trash" text="Delete" onClick={handleDelete} />
          </Menu>
        </Popover>
      </Layout.Horizontal>
    )
  )
}

const ConnectorsListView: React.FC<ConnectorListViewProps> = props => {
  const { data, reload, gotoPage } = props
  const history = useHistory()
  const listData: ConnectorResponse[] = useMemo(() => data?.content || [], [data?.content])
  const { pathname } = useLocation()
  const columns: CustomColumn<ConnectorResponse>[] = useMemo(
    () => [
      {
        Header: i18n.connector.toUpperCase(),
        accessor: row => row.connector?.name,
        id: 'name',
        width: '25%',
        Cell: RenderColumnConnector
      },
      {
        Header: i18n.details.toUpperCase(),
        accessor: row => row.connector?.description,
        id: 'details',
        width: '25%',
        Cell: RenderColumnDetails
      },
      {
        Header: i18n.lastActivity.toUpperCase(),
        accessor: 'lastModifiedAt',
        id: 'activity',
        width: '20%',
        Cell: RenderColumnActivity
      },
      {
        Header: i18n.status.toUpperCase(),
        accessor: 'status',
        id: 'status',
        width: '25%',
        Cell: RenderColumnStatus
      },
      {
        Header: '',
        accessor: row => row.connector?.identifier,
        width: '5%',
        id: 'action',
        Cell: RenderColumnMenu,
        reload: reload,
        disableSortBy: true
      }
    ],
    [reload]
  )
  return (
    <Table<ConnectorResponse>
      className={css.table}
      columns={columns}
      data={listData}
      onRowClick={connector => {
        history.push(`${pathname}/${connector.connector?.identifier}`)
      }}
      pagination={{
        itemCount: data?.totalItems || 0,
        pageSize: data?.pageSize || 10,
        pageCount: data?.totalPages || -1,
        pageIndex: data?.pageIndex || 0,
        gotoPage
      }}
    />
  )
}

export default ConnectorsListView
