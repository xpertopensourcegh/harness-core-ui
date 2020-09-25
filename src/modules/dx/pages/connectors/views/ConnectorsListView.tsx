import React, { useState, useMemo, useEffect } from 'react'
import { Text, Layout, Color, Icon, Button, Popover, StepsProgress } from '@wings-software/uikit'
import type { CellProps, Renderer, Column } from 'react-table'
import { Menu, Classes, Position, PopoverInteractionKind, Intent } from '@blueprintjs/core'
import { useParams, useHistory, useLocation } from 'react-router-dom'
import ReactTimeago from 'react-timeago'
import {
  ConnectorSummaryDTO,
  useDeleteConnector,
  NGPageResponseConnectorSummaryDTO,
  useGetTestConnectionResult,
  ResponseDTOConnectorValidationResult,
  ConnectorConnectivityDetails
} from 'services/cd-ng'
import Table from 'modules/common/components/Table/Table'
import { useConfirmationDialog } from 'modules/common/exports'
import { useToaster } from 'modules/common/components/Toaster/useToaster'
import TagsPopover from 'modules/common/components/TagsPopover/TagsPopover'
import { StepIndex, STEP } from 'modules/dx/common/VerifyOutOfClusterDelegate/VerifyOutOfClusterDelegate'
import { getStepOneForExistingDelegate } from 'modules/dx/common/VerifyExistingDelegate/VerifyExistingDelegate'
import { useGetDelegatesStatus, RestResponseDelegateStatus, DelegateInner } from 'services/portal'
import type { StepDetails } from 'modules/dx/interfaces/ConnectorInterface'
import { ConnectorStatus } from 'modules/dx/constants'
import { getIconByType } from '../utils/ConnectorUtils'
import i18n from './ConnectorsListView.i18n'
import css from './ConnectorsListView.module.scss'

interface ConnectorListViewProps {
  data?: NGPageResponseConnectorSummaryDTO
  reload?: () => Promise<void>
  gotoPage: (pageNumber: number) => void
}

type CustomColumn<T extends object> = Column<T> & {
  reload?: () => Promise<void>
}

const RenderColumnConnector: Renderer<CellProps<ConnectorSummaryDTO>> = ({ row }) => {
  const data = row.original
  return (
    <Layout.Horizontal spacing="small">
      <Icon name={getIconByType(data.type)} size={30}></Icon>
      <div className={css.wrapper}>
        <Layout.Horizontal spacing="small">
          <div className={css.name} title={data.name}>
            {data.name}
          </div>
          {data.tags?.length ? <TagsPopover tags={data.tags} /> : null}
        </Layout.Horizontal>
        <div className={css.identifier} title={data.identifier}>
          {data.identifier}
        </div>
      </div>
    </Layout.Horizontal>
  )
}
const RenderColumnDetails: Renderer<CellProps<ConnectorSummaryDTO>> = ({ row }) => {
  const data = row.original
  return (
    <div>
      {data.connectorDetails ? <Text color={Color.BLACK}>{data.connectorDetails.masterURL}</Text> : null}
      <Text color={Color.GREY_400}>{data.description}</Text>
    </div>
  )
}

const RenderColumnActivity: Renderer<CellProps<ConnectorSummaryDTO>> = ({ row }) => {
  const data = row.original
  return (
    <Layout.Horizontal spacing="small">
      <Icon name="activity" />
      {data.lastModifiedAt ? <ReactTimeago date={data.lastModifiedAt} /> : null}
    </Layout.Horizontal>
  )
}
const RenderColumnStatus: Renderer<CellProps<ConnectorSummaryDTO>> = ({ row }) => {
  const data = row.original
  const { accountId, orgIdentifier, projectIdentifier } = useParams()
  const [testing, setTesting] = useState(false)
  const [lastTestedAt, setLastTestedAt] = useState<number>()
  const [status, setStatus] = useState<ConnectorConnectivityDetails['status']>(data.status?.status)
  const [errorMessage, setErrorMessage] = useState('')

  const [stepDetails, setStepDetails] = useState<StepDetails>({
    step: 1,
    intent: Intent.WARNING,
    status: 'PROCESS' // Replace when enum is added in uikit
  })

  const { data: delegateStatus, error, refetch: refetchDelegateStatus } = useGetDelegatesStatus({
    queryParams: { accountId: accountId },
    lazy: true
  })
  const { mutate: reloadTestConnection } = useGetTestConnectionResult({
    accountIdentifier: accountId,
    connectorIdentifier: data.identifier || '',
    queryParams: { orgIdentifier: orgIdentifier, projectIdentifier: projectIdentifier },
    requestOptions: {
      headers: {
        'content-type': 'application/json'
      }
    }
  })

  const getStepOne = () => {
    if (data?.connectorDetails?.delegateName) {
      return getStepOneForExistingDelegate(stepDetails, data?.connectorDetails?.delegateName)
    } else {
      const count = delegateStatus?.resource?.delegates?.length
      if (stepDetails.step !== StepIndex.get(STEP.CHECK_DELEGATE)) {
        return i18n.delegateFound(count)
      } else {
        return i18n.STEPS.ONE.PROGRESS
      }
    }
  }

  const isSelectedDelegateActive = (delegateStatusResponse: RestResponseDelegateStatus) => {
    const delegateList = delegateStatusResponse?.resource?.delegates
    return delegateList?.filter(function (item: DelegateInner) {
      return item.delegateName && item.delegateName === data?.connectorDetails?.delegateName
    })?.length
  }

  const executeStepVerify = async (): Promise<void> => {
    if (stepDetails.step === StepIndex.get(STEP.ESTABLISH_CONNECTION)) {
      let testConnectionResponse: ResponseDTOConnectorValidationResult
      if (stepDetails.status === 'PROCESS') {
        try {
          testConnectionResponse = await reloadTestConnection()
          if (testConnectionResponse?.data?.valid) {
            setStepDetails({
              step: 2,
              intent: Intent.SUCCESS,
              status: 'DONE'
            })
          } else {
            setStepDetails({
              step: 2,
              intent: Intent.DANGER,
              status: 'ERROR'
            })
          }
        } catch (err) {
          setStepDetails({
            step: 2,
            intent: Intent.DANGER,
            status: 'ERROR'
          })
        }
      }
    }
  }

  useEffect(() => {
    if (testing) {
      if (stepDetails.step === StepIndex.get(STEP.CHECK_DELEGATE) && stepDetails.status === 'PROCESS') {
        if (delegateStatus) {
          if (
            data?.connectorDetails?.delegateName
              ? isSelectedDelegateActive(delegateStatus)
              : delegateStatus.resource?.delegates?.length
          ) {
            setStepDetails({
              step: 1,
              intent: Intent.SUCCESS,
              status: 'DONE'
            })
          } else {
            setStepDetails({
              step: 1,
              intent: Intent.DANGER,
              status: 'ERROR'
            })
          }
        } else if (!delegateStatus && error) {
          setStepDetails({
            step: 1,
            intent: Intent.DANGER,
            status: 'ERROR'
          })
        }
      }
      executeStepVerify()

      if (stepDetails.step === StepIndex.get(STEP.CHECK_DELEGATE) && stepDetails.status === 'DONE') {
        setStepDetails({
          step: 2,
          intent: Intent.SUCCESS,
          status: 'PROCESS'
        })
      }

      if (stepDetails.step === StepIndex.get(STEP.ESTABLISH_CONNECTION) && stepDetails.status === 'DONE') {
        setStepDetails({
          step: 3,
          intent: Intent.SUCCESS,
          status: 'PROCESS'
        })
      }
      if (stepDetails.step === StepIndex.get(STEP.VERIFY) && stepDetails.status === 'PROCESS') {
        const interval = setInterval(() => {
          setStepDetails({
            step: 3,
            intent: Intent.SUCCESS,
            status: 'DONE'
          })
          setTesting(false)
          setStatus(ConnectorStatus.SUCCESS)
          setLastTestedAt(new Date().getTime())
        }, 2000)

        return () => {
          clearInterval(interval)
        }
      }

      if (stepDetails.status === 'ERROR') {
        setTesting(false)
        setStatus(ConnectorStatus.FAILURE)
        setLastTestedAt(new Date().getTime())
        setStepDetails({
          step: 1,
          intent: Intent.WARNING,
          status: 'PROCESS'
        })
      }
    }
  }, [delegateStatus, error, stepDetails])

  useEffect(() => {
    if (data.status?.status) {
      setStatus(data.status?.status)
    }
    if (data.status?.errorMessage) {
      setErrorMessage(data.status?.errorMessage)
    }
  }, [data.status?.status])
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
                tooltip={errorMessage}
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
          <Popover interactionKind={PopoverInteractionKind.HOVER} position={Position.LEFT_TOP}>
            <Button intent="primary" minimal loading />
            <div className={css.testConnectionPop}>
              <StepsProgress
                steps={[getStepOne() || '', i18n.STEPS.TWO, i18n.STEPS.THREE]}
                intent={stepDetails.intent}
                current={stepDetails.step}
                currentStatus={stepDetails.status}
              />
            </div>
          </Popover>
          <Text style={{ margin: 8 }}>{i18n.TestInProgress}</Text>
        </Layout.Horizontal>
      )}
      {!testing && data.status?.status === 'FAILURE' ? (
        <Button
          font="small"
          className={css.testBtn}
          text={i18n.TEST_CONNECTION}
          onClick={e => {
            e.stopPropagation()
            setTesting(true)
            refetchDelegateStatus()
          }}
        />
      ) : null}
    </Layout.Horizontal>
  )
}

const RenderColumnMenu: Renderer<CellProps<ConnectorSummaryDTO>> = ({ row, column }) => {
  const data = row.original
  const [menuOpen, setMenuOpen] = useState(false)
  const { showSuccess, showError } = useToaster()
  const { accountId, orgIdentifier, projectIdentifier } = useParams()

  const { mutate: deleteConnector } = useDeleteConnector({
    accountIdentifier: accountId,
    queryParams: { orgIdentifier: orgIdentifier, projectIdentifier: projectIdentifier }
  })

  const { openDialog } = useConfirmationDialog({
    contentText: i18n.confirmDelete(data.name || ''),
    titleText: i18n.confirmDeleteTitle,
    confirmButtonText: i18n.deleteButton,
    cancelButtonText: i18n.cancelButton,
    onCloseDialog: async (isConfirmed: boolean) => {
      if (isConfirmed) {
        try {
          const deleted = await deleteConnector(data.identifier || '', {
            headers: { 'content-type': 'application/json' }
          })

          if (deleted) showSuccess(`Connector ${data.name} deleted`)
          ;(column as any).reload?.()
        } catch (err) {
          showError(err)
        }
      }
    }
  })

  const handleDelete = (e: React.MouseEvent<HTMLElement, MouseEvent>): void => {
    e.stopPropagation()
    setMenuOpen(false)
    if (!data?.identifier) return
    openDialog()
  }

  return (
    <Layout.Horizontal className={css.layout}>
      <Popover
        isOpen={menuOpen}
        onInteraction={nextOpenState => {
          setMenuOpen(nextOpenState)
        }}
        className={Classes.DARK}
        position={Position.BOTTOM_RIGHT}
      >
        <Button
          minimal
          icon="main-more"
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
}

const ConnectorsListView: React.FC<ConnectorListViewProps> = props => {
  const { data, reload, gotoPage } = props
  const history = useHistory()
  const { pathname } = useLocation()
  const columns: CustomColumn<ConnectorSummaryDTO>[] = useMemo(
    () => [
      {
        Header: i18n.connector.toUpperCase(),
        accessor: 'name',
        width: '25%',
        Cell: RenderColumnConnector
      },
      {
        Header: i18n.details.toUpperCase(),
        accessor: 'description',
        width: '25%',
        Cell: RenderColumnDetails
      },
      {
        Header: i18n.lastActivity.toUpperCase(),
        accessor: 'lastModifiedAt',
        width: '20%',
        Cell: RenderColumnActivity
      },
      {
        Header: i18n.status.toUpperCase(),
        accessor: 'status',
        width: '25%',
        Cell: RenderColumnStatus
      },
      {
        Header: '',
        accessor: 'identifier',
        width: '5%',
        Cell: RenderColumnMenu,
        reload: reload,
        disableSortBy: true
      }
    ],
    [reload]
  )
  return (
    <Table<ConnectorSummaryDTO>
      className={css.table}
      columns={columns}
      data={data?.content || []}
      onRowClick={connector => {
        history.push(`${pathname}/${connector.identifier}`)
      }}
      pagination={{
        itemCount: data?.itemCount || 0,
        pageSize: data?.pageSize || 10,
        pageCount: data?.pageCount || -1,
        pageIndex: data?.pageIndex || 0,
        gotoPage
      }}
    />
  )
}

export default ConnectorsListView
