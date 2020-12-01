import React, { FunctionComponent, useEffect, useState, useMemo, useCallback } from 'react'
import {
  Container,
  Table,
  Collapse,
  Color,
  Link as WingsLink,
  useModalHook,
  IconName,
  Text,
  Button
} from '@wings-software/uikit'
import type { Cell } from 'react-table'
import { Link, useParams } from 'react-router-dom'
import type { IDBPDatabase } from 'idb'
import { Dialog } from '@blueprintjs/core'
import { useHistory } from 'react-router-dom'
import type * as H from 'history'
import { Page, useConfirmationDialog } from '@common/exports'
import CVProductCard from '@cv/components/CVProductCard/CVProductCard'
import routes from '@common/RouteDefinitions'
import { CVProviders, VerificationTypeToRouteVerificationType } from '@cv/constants'
import { useQueryParams } from '@common/hooks'
import { loggerFor, ModuleName } from 'framework/exports'
import { useIndexedDBHook, CVObjectStoreNames, CVIndexedDBPrimaryKeys } from '@cv/hooks/IndexedDBHook/IndexedDBHook'
import { CreateConnectorWizard } from '@connectors/components/CreateConnectorWizard/CreateConnectorWizard'
import { useDeleteConnector, useGetConnectorList, ConnectorConfigDTO, ConnectorInfoDTO } from 'services/cd-ng'
import type { DSConfig } from 'services/cv'
import i18n from './DataSources.i18n'
import css from './DataSources.module.scss'

type DataSourceTableRow = {
  name: string
  identifier: string
  createdAt: string
  lastModifiedAt: string
  dataSourceRoute: string
}

type DeleteDataSourceInfo = {
  dataSourceName: string
  dataSourceId: string
}

interface RenderContentProps {
  existingDataSources: Map<string, Array<DataSourceTableRow>>
  dbInstance: IDBPDatabase
  fetchConnectors: () => void
}

interface CVConnectorListTableProps {
  accountId: string
  projectId: string
  orgId: string
  fetchConnectors: () => void
  existingDataSources: RenderContentProps['existingDataSources']
  dbInstance: IDBPDatabase
}

interface ProvidersProps {
  accountId: string
  projectId: string
  orgId: string
  dbInstance: IDBPDatabase
}

const SimpleTableColumns = [
  {
    Header: i18n.tableColumns.name,
    accessor: 'name',
    Cell: function DataSourceName(cell: Cell) {
      return (
        <Text width={100} lineClamp={1} color={Color.BLACK}>
          {cell.value}
        </Text>
      )
    }
  },
  {
    Header: i18n.tableColumns.dateCreated,
    accessor: 'createdAt',
    Cell: function DataSourceCreatedAt(cell: Cell) {
      return (
        <Text width={150} lineClamp={1} color={Color.BLACK}>
          {cell.value}
        </Text>
      )
    }
  },
  {
    Header: i18n.tableColumns.dateModified,
    accessor: 'lastModifiedAt',
    Cell: function DataSourceCreatedAt(cell: Cell) {
      return (
        <Text width={150} lineClamp={1} color={Color.BLACK}>
          {cell.value}
        </Text>
      )
    }
  }
]

const logger = loggerFor(ModuleName.CV)

const DIALOG_PROPS = {
  isOpen: true,
  usePortal: true,
  autoFocus: true,
  canEscapeKeyClose: true,
  canOutsideClickClose: true,
  enforceFocus: true,
  className: css.connectorDialog
}

function mapType(type: string): string {
  switch (type) {
    case CVProviders.APP_DYNAMICS.label:
      return CVProviders.APP_DYNAMICS.value
    case CVProviders.SPLUNK.label:
      return CVProviders.SPLUNK.value
    default:
      return type
  }
}

function createMapOfExistingDataSources(dataSources: any[]): RenderContentProps['existingDataSources'] {
  const mapOfExistingDataSources = new Map()
  dataSources
    ?.filter(
      val => val.connector?.type === CVProviders.APP_DYNAMICS.label || val.connector.type === CVProviders.SPLUNK.label
    )
    .forEach(({ createdAt, lastModifiedAt, connector }) => {
      const { name, identifier, type: connType } = connector
      const type = mapType(connType)
      if (!mapOfExistingDataSources.has(type)) {
        mapOfExistingDataSources.set(type, [])
      }

      mapOfExistingDataSources.get(type)?.push({
        name: name || '',
        identifier,
        dataSourceRoute: VerificationTypeToRouteVerificationType[type || ''],
        createdAt: createdAt ? new Date(createdAt).toLocaleString() : '',
        lastModifiedAt: lastModifiedAt ? new Date(lastModifiedAt).toLocaleString() : ''
      })
    })
  return mapOfExistingDataSources
}

function typeToIconName(type: DSConfig['type']): IconName | undefined {
  switch (type) {
    case 'APP_DYNAMICS':
      return 'service-appdynamics'
    case 'SPLUNK':
      return 'service-splunk-with-name'
  }
}

function typeToName(type: DSConfig['type']): string | undefined {
  switch (type) {
    case 'APP_DYNAMICS':
      return 'App Dynamics'
    case 'SPLUNK':
      return 'Splunk'
  }
}

function moveToDataSourceProductPage(
  history: H.History,
  projectId: string,
  orgId: string,
  dataSourceId: string,
  type: string,
  accountId: string
): { dataSourceId: string; isEdit: boolean } {
  const contextualData = { dataSourceId, isEdit: false }
  history.push({
    pathname: routes.toCVDataSourcesProductPage({
      dataSourceType: VerificationTypeToRouteVerificationType[mapType(type)],
      projectIdentifier: projectId,
      orgIdentifier: orgId,
      accountId
    }),
    search: `?dataSourceId=${dataSourceId}`,
    state: contextualData
  })
  return contextualData
}

function Providers(props: ProvidersProps): JSX.Element {
  const { accountId, projectId, orgId, dbInstance } = props
  const [connectorType, setConnectorType] = useState<ConnectorInfoDTO['type']>('AppDynamics')
  const history = useHistory()

  const [showConnectorModal, hideConnectorModal] = useModalHook(
    () => (
      <Dialog {...DIALOG_PROPS}>
        <CreateConnectorWizard
          accountId={accountId}
          orgIdentifier={orgId}
          projectIdentifier={projectId}
          type={connectorType}
          isCreate={true}
          onSuccess={async (conn?: ConnectorConfigDTO) => {
            const { identifier, type } = conn?.connector || {}
            if (identifier && type) {
              await dbInstance?.put(CVObjectStoreNames.ONBOARDING_JOURNEY, {
                [CVIndexedDBPrimaryKeys.DATASOURCE_ID]: identifier,
                isEdit: false
              })
              moveToDataSourceProductPage(history, projectId, orgId, identifier, type, accountId)
            } else {
              logger.error('No identifier or type present on connector creation!', conn)
            }
            hideConnectorModal()
          }}
          hideLightModal={hideConnectorModal}
        />
        <Button
          minimal
          icon="cross"
          className={css.crossButton}
          iconProps={{ size: 18 }}
          onClick={hideConnectorModal}
        />
      </Dialog>
    ),
    [connectorType, projectId, orgId, dbInstance]
  )

  return (
    <Container className={css.sourcesGrid}>
      {Object.keys(i18n.connectors).map(key => (
        <CVProductCard
          key={key}
          item={(i18n.connectors as any)[key]}
          onClick={() => {
            setConnectorType(key as ConnectorInfoDTO['type']) // Remove after adding proper types to connector array
            showConnectorModal()
          }}
        />
      ))}
    </Container>
  )
}

function CVConnectorListTable(props: CVConnectorListTableProps): JSX.Element {
  const { dbInstance, projectId = '', orgId = '', accountId, fetchConnectors, existingDataSources } = props
  const [deletedDSInfo, setSelectedDataSourceName] = useState<DeleteDataSourceInfo | undefined>(undefined)
  const { mutate: deleteConnector } = useDeleteConnector({
    queryParams: { accountIdentifier: accountId, orgIdentifier: orgId, projectIdentifier: projectId }
  })

  const { openDialog } = useConfirmationDialog({
    titleText: `${i18n.confirmationModalText.titleText} ${deletedDSInfo?.dataSourceName}`,
    contentText: i18n.confirmationModalText.contentText,
    cancelButtonText: i18n.confirmationModalText.cancelButtonText,
    confirmButtonText: i18n.confirmationModalText.confirmButtonText,
    onCloseDialog: (isConfirmed: boolean) => {
      if (deletedDSInfo && isConfirmed) {
        deleteConnector(deletedDSInfo?.dataSourceId, {
          headers: { 'content-type': 'application/json' }
        }).then(val => {
          if (val.data) {
            fetchConnectors()
          }
        })
      }
    }
  })

  const existingDataSourceTableColumns = useMemo(
    () => [
      ...SimpleTableColumns,
      {
        Header: '',
        accessor: 'actions',
        Cell: function EditDataSourceActions(cell: Cell) {
          const { row } = cell
          const originalData = row.original as DataSourceTableRow
          const toObj = {
            pathname: routes.toCVDataSourcesProductPage({
              dataSourceType: originalData.dataSourceRoute,
              projectIdentifier: projectId,
              orgIdentifier: orgId,
              accountId
            }),
            search: `?dataSourceId=${originalData.identifier}`,
            state: { dataSourceId: originalData.identifier, isEdit: true }
          }
          const onEditCallback = useCallback(() => {
            dbInstance?.add(CVObjectStoreNames.ONBOARDING_JOURNEY, {
              [CVIndexedDBPrimaryKeys.DATASOURCE_ID]: originalData.identifier,
              isEdit: true
            })
          }, [originalData.identifier])
          return (
            <Container className={css.actionLinks}>
              <Link to={toObj} onClick={onEditCallback}>
                {i18n.tableActionButtonText.edit}
              </Link>
              <Container className={css.divider}>|</Container>
              <Link to={toObj} onClick={onEditCallback}>
                {i18n.tableActionButtonText.view}
              </Link>
              <Container className={css.divider}>|</Container>
              <WingsLink
                withoutHref
                onClick={() => {
                  setSelectedDataSourceName({
                    dataSourceName: originalData.name,
                    dataSourceId: originalData.identifier
                  })
                  openDialog()
                }}
              >
                {i18n.tableActionButtonText.delete}
              </WingsLink>
            </Container>
          )
        }
      }
    ],
    [dbInstance?.add, projectId, orgId, openDialog]
  )

  return (
    <>
      {Array.from(existingDataSources.keys()).map(type => {
        return (
          <Collapse
            isOpen={true}
            className={css.dataSourceCollapse}
            key={type}
            heading={
              <Container>
                <Text
                  icon={typeToIconName(type as DSConfig['type'])}
                  className={css.headingText}
                  iconProps={{ size: 20 }}
                >
                  {typeToName(type as DSConfig['type'])}
                </Text>
              </Container>
            }
          >
            <Table
              columns={existingDataSourceTableColumns as any}
              bpTableProps={{}}
              data={existingDataSources.get(type) || []}
              className={css.dataSourceTable}
            />
          </Collapse>
        )
      })}
    </>
  )
}

function RenderContent(props: RenderContentProps): JSX.Element {
  const { existingDataSources, dbInstance, fetchConnectors } = props
  const { projectIdentifier: projectId, orgIdentifier: orgId, accountId } = useParams()
  const { onBoarding: isOnboardingFlow = false } = useQueryParams()

  const [isNewDataSourceView, setToggleView] = useState(!isOnboardingFlow)
  const history = useHistory()

  return (
    <Container className={css.contentContainer}>
      <Container className={css.searchAndAdd}>
        {!isOnboardingFlow && existingDataSources?.size > 0 && (
          <Button
            icon={isNewDataSourceView ? 'plus' : undefined}
            minimal
            intent="primary"
            onClick={() => {
              if (isNewDataSourceView) {
                history.push({
                  pathname: routes.toCVDataSources({
                    projectIdentifier: projectId as string,
                    orgIdentifier: orgId as string,
                    accountId
                  }),
                  search: `?onBoarding=true`
                })
              }
              setToggleView(!isNewDataSourceView)
            }}
          >
            {isNewDataSourceView ? i18n.createDataSourceText : i18n.editDataSourceButtonText}
          </Button>
        )}
      </Container>
      {!existingDataSources?.size || !isNewDataSourceView ? (
        <Providers
          accountId={accountId}
          projectId={projectId as string}
          orgId={orgId as string}
          dbInstance={dbInstance}
        />
      ) : (
        <CVConnectorListTable
          projectId={projectId as string}
          accountId={accountId}
          orgId={orgId as string}
          fetchConnectors={fetchConnectors}
          dbInstance={dbInstance}
          existingDataSources={existingDataSources}
        />
      )}
    </Container>
  )
}

const DataSources: FunctionComponent<{}> = _ => {
  const [existingDataSources, setDataSources] = useState(new Map())
  const { accountId, projectIdentifier, orgIdentifier } = useParams()
  const { isInitializingDB, dbInstance } = useIndexedDBHook()
  const { data: secretManagersApiResponse, loading, error, refetch } = useGetConnectorList({
    queryParams: {
      accountIdentifier: accountId,
      orgIdentifier: orgIdentifier as string,
      projectIdentifier: projectIdentifier as string
    }
  })

  useEffect(() => {
    if (secretManagersApiResponse?.data?.content) {
      setDataSources(createMapOfExistingDataSources(secretManagersApiResponse?.data?.content))
    }
  }, [secretManagersApiResponse?.data?.content])
  useEffect(() => {
    if (dbInstance) dbInstance.clear(CVObjectStoreNames.ONBOARDING_JOURNEY)
  }, [dbInstance])
  return (
    <>
      <Page.Header title={existingDataSources?.size ? i18n.editDataSourceTitle : i18n.addDataSourceTitle} />
      <Page.Body loading={loading || isInitializingDB} error={error?.message}>
        <Container className={css.main}>
          {dbInstance && (
            <RenderContent
              existingDataSources={existingDataSources}
              dbInstance={dbInstance}
              fetchConnectors={refetch}
            />
          )}
        </Container>
      </Page.Body>
    </>
  )
}

export default DataSources
