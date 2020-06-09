import React, { FunctionComponent, useEffect, useState, useMemo } from 'react'
import css from './DataSources.module.scss'
import {
  Container,
  OverlaySpinner,
  Table,
  Collapse,
  Link as WingsLink,
  IconName,
  Text,
  Button
} from '@wings-software/uikit'
import CVProductCard from 'modules/cv/components/CVProductCard/CVProductCard'
import i18n from './DataSources.i18n'
import { SettingsService } from 'modules/cv/services'
import { Page } from 'modules/common/exports'
import type { SettingAttribute, CVConfig } from '@wings-software/swagger-ts/definitions'
import type { Cell } from 'react-table'
import { Link } from 'react-router-dom'
import { routeCVDataSourcesProductPage } from 'modules/cv/routes'
import { VerificationTypeToRouteVerificationType, accountId } from 'modules/cv/constants'

type DataSourceTableRow = {
  name: string
  createdAt: string
  lastUpdatedAt: string
  uuid: string
  dataSourceRoute: string
}

interface RenderContentProps {
  existingDataSources: Map<string, Array<DataSourceTableRow>>
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
      return 'service-splunk'
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
  const { existingDataSources } = props
  const [isNewDataSourceView, setToggleView] = useState(true)
  const existingDataSourceTableColumns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
        Cell: function DataSourceName(cell: Cell) {
          return (
            <Text width={100} lineClamp={1}>
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
            <Text width={150} lineClamp={1}>
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
            <Text width={150} lineClamp={1}>
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
            pathname: routeCVDataSourcesProductPage.url({ dataSourceType: originalData.dataSourceRoute }),
            state: { dataSourceId: originalData.uuid, isEdit: true }
          }
          return (
            <Container className={css.actionLinks}>
              <Link to={toObj}>Edit</Link>
              <Container className={css.divider}>|</Container>
              <Link to={toObj}>View</Link>
              <Container className={css.divider}>|</Container>
              <WingsLink withoutHref>Delete</WingsLink>
            </Container>
          )
        }
      }
    ],
    []
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
  useEffect(() => {
    SettingsService.fetchConnectors(accountId).then(({ response }) => {
      if (response?.resource) {
        const resp: any = response.resource
        setDataSources(createMapOfExistingDataSources(resp.response))
      }
      setLoading(false)
    })
  }, [])
  return (
    <Container className={css.main}>
      <Page.Header title={i18n[existingDataSources?.size ? 'editDataSourceTitle' : 'addDataSourceTitle']} />
      <OverlaySpinner show={isLoading}>
        {isLoading ? <span /> : <RenderContent existingDataSources={existingDataSources} />}
      </OverlaySpinner>
    </Container>
  )
}

export default DataSources
