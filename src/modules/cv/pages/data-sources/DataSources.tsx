import React, { FunctionComponent, useEffect, useState, useMemo, useCallback } from 'react'
import { Container, Table, Collapse, Color, Link as WingsLink, IconName, Text, Button } from '@wings-software/uikit'
import type { SettingAttribute, CVConfig } from '@wings-software/swagger-ts/definitions'
import type { Cell } from 'react-table'
import { Link } from 'react-router-dom'
import type { IDBPDatabase } from 'idb'
import { Page } from 'modules/common/exports'
import { SettingsService } from 'modules/cv/services'
import CVProductCard from 'modules/cv/components/CVProductCard/CVProductCard'
import { routeCVDataSourcesProductPage } from 'modules/cv/routes'
import { VerificationTypeToRouteVerificationType } from 'modules/cv/constants'
import { routeParams } from 'framework/exports'
import { useIndexedDBHook, CVObjectStoreNames } from 'modules/cv/hooks/IndexedDBHook/IndexedDBHook'
import i18n from './DataSources.i18n'
import css from './DataSources.module.scss'

type DataSourceTableRow = {
  name: string
  createdAt: string
  lastUpdatedAt: string
  uuid: string
  dataSourceRoute: string
}

interface RenderContentProps {
  existingDataSources: Map<string, Array<DataSourceTableRow>>
  dbInstance?: IDBPDatabase
  accountId: string
}

function createMapOfExistingDataSources(dataSources: SettingAttribute[]): RenderContentProps['existingDataSources'] {
  const mapOfExistingDataSources = new Map()
  dataSources
    ?.filter(({ value }) => value?.type === 'APP_DYNAMICS' || value?.type === 'SPLUNK')
    .forEach(({ name, createdAt, lastUpdatedAt, value, uuid }) => {
      if (!mapOfExistingDataSources.has(value?.type)) {
        mapOfExistingDataSources.set(value?.type, [])
      }

      mapOfExistingDataSources.get(value?.type)?.push({
        name: name ?? '',
        uuid,
        dataSourceRoute: VerificationTypeToRouteVerificationType[value?.type || ''],
        createdAt: createdAt ? new Date(createdAt).toLocaleString() : '',
        lastUpdatedAt: lastUpdatedAt ? new Date(lastUpdatedAt).toLocaleString() : ''
      })
    })

  return mapOfExistingDataSources
}

function typeToIconName(type: CVConfig['type']): IconName | undefined {
  switch (type) {
    case 'APP_DYNAMICS':
      return 'service-appdynamics'
    case 'SPLUNK':
      return 'service-splunk-with-name'
  }
}

function typeToName(type: CVConfig['type']): string | undefined {
  switch (type) {
    case 'APP_DYNAMICS':
      return 'App Dynamics'
    case 'SPLUNK':
      return 'Splunk'
  }
}

const renderSources = () => {
  return i18n.dataSources.map((source: any, index: number) => {
    return <CVProductCard item={source.item} onClick={source.onClick} key={index} />
  })
}

function RenderContent(props: RenderContentProps): JSX.Element {
  const { existingDataSources, dbInstance } = props
  const [isNewDataSourceView, setToggleView] = useState(true)
  const existingDataSourceTableColumns = useMemo(
    () => [
      {
        Header: 'Name',
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
        accessor: 'lastUpdatedAt',
        Cell: function DataSourceCreatedAt(cell: Cell) {
          return (
            <Text width={150} lineClamp={1} color={Color.BLACK}>
              {cell.value}
            </Text>
          )
        }
      },
      {
        Header: '',
        accessor: 'actions',
        Cell: function EditDataSourceActions(cell: Cell) {
          const { row } = cell
          const originalData = row.original as DataSourceTableRow
          const toObj = {
            pathname: routeCVDataSourcesProductPage.url({
              dataSourceType: originalData.dataSourceRoute
            }),
            search: `?dataSourceId=${originalData.uuid}`,
            state: { dataSourceId: originalData.uuid, isEdit: true }
          }
          const onEditCallback = useCallback(() => {
            dbInstance?.add(CVObjectStoreNames.ONBOARDING_JOURNEY, {
              dataSourceId: originalData.uuid,
              isEdit: true
            })
          }, [originalData.uuid])
          return (
            <Container className={css.actionLinks}>
              <Link to={toObj} onClick={onEditCallback}>
                Edit
              </Link>
              <Container className={css.divider}>|</Container>
              <Link to={toObj} onClick={onEditCallback}>
                View
              </Link>
              <Container className={css.divider}>|</Container>
              <WingsLink withoutHref>Delete</WingsLink>
            </Container>
          )
        }
      }
    ],
    [dbInstance?.add]
  )

  if (!existingDataSources?.size || !isNewDataSourceView) {
    return (
      <Container className={css.contentContainer}>
        {existingDataSources?.size ? (
          <Container className={css.searchAndAdd}>
            <Button intent="primary" onClick={() => setToggleView(true)}>
              Edit Data Source
            </Button>
          </Container>
        ) : undefined}
        <div className={css.sourcesGrid}> {renderSources()} </div>
      </Container>
    )
  }

  return (
    <Container className={css.contentContainer}>
      <Container className={css.searchAndAdd}>
        <Button icon="plus" minimal intent="primary" onClick={() => setToggleView(false)}>
          New Data Source
        </Button>
      </Container>
      {Array.from(existingDataSources.keys()).map(type => {
        return (
          <Collapse
            isOpen={true}
            className={css.dataSourceCollapse}
            key={type}
            heading={
              <Container>
                <Text
                  icon={typeToIconName(type as CVConfig['type'])}
                  className={css.headingText}
                  iconProps={{ size: 20 }}
                >
                  {typeToName(type as CVConfig['type'])}
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
    </Container>
  )
}

const DataSources: FunctionComponent<{}> = _ => {
  const [isLoading, setLoading] = useState(true)
  const [existingDataSources, setDataSources] = useState(new Map())
  const {
    params: { accountId }
  } = routeParams()
  const { isInitializingDB, dbInstance } = useIndexedDBHook()
  useEffect(() => {
    SettingsService.fetchConnectors(accountId).then(({ response }) => {
      if (response?.resource) {
        const resp: any = response.resource
        setDataSources(createMapOfExistingDataSources(resp.response))
      }
      setLoading(false)
    })
  }, [accountId])
  useEffect(() => {
    if (dbInstance) dbInstance.clear(CVObjectStoreNames.ONBOARDING_JOURNEY)
  }, [dbInstance])
  return (
    <>
      <Page.Header title={i18n[existingDataSources?.size ? 'editDataSourceTitle' : 'addDataSourceTitle']} />
      <Page.Body loading={isLoading || isInitializingDB}>
        <Container className={css.main}>
          <RenderContent existingDataSources={existingDataSources} accountId={accountId} dbInstance={dbInstance} />
        </Container>
      </Page.Body>
    </>
  )
}

export default DataSources
