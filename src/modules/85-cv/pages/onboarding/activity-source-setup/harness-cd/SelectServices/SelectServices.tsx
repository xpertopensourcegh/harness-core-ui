import React, { useEffect, useMemo, useState } from 'react'
import { Container, Formik, FormikForm, Text, Layout, Icon, Color, SelectOption } from '@wings-software/uicore'
import type { CellProps, Renderer } from 'react-table'
import { useParams } from 'react-router-dom'
import { useHistory } from 'react-router-dom'
import Table from '@common/components/Table/Table'
import { SubmitAndPreviousButtons } from '@cv/pages/onboarding/SubmitAndPreviousButtons/SubmitAndPreviousButtons'
import {
  GetListServicesQueryParams,
  RestResponsePageResponseApplication,
  Service,
  useGetListServices
} from 'services/portal'
import { PageSpinner, useToaster } from '@common/components'
import { PageError } from '@common/components/Page/PageError'
import { NoDataCard } from '@common/components/Page/NoDataCard'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { getErrorMessage } from '@cv/utils/CommonUtils'
import { useStrings } from 'framework/exports'
import { ServiceSelectOrCreate } from '@cv/components/ServiceSelectOrCreate/ServiceSelectOrCreate'
import {
  useGetServiceListForProject,
  ResponsePageServiceResponseDTO,
  ServiceResponseDTO,
  GetServiceListForProjectQueryParams
} from 'services/cd-ng'
import type { UseGetMockData } from '@common/utils/testUtils'
import { TableColumnWithFilter } from '@cv/components/TableColumnWithFilter/TableColumnWithFilter'
import { useRegisterActivitySource, ActivitySourceDTO } from 'services/cv'
import routes from '@common/RouteDefinitions'
import { ONBOARDING_ENTITIES } from '@cv/pages/admin/setup/SetupUtils'
import css from './SelectServices.module.scss'

export interface SelectServicesProps {
  initialValues?: any
  onSubmit?: (data: any) => void
  onPrevious: () => void
  mockData?: UseGetMockData<RestResponsePageResponseApplication>
  mockGetServices?: UseGetMockData<ResponsePageServiceResponseDTO>
}

export interface Options {
  name: string
  value: string
}

interface TableData {
  name: string
  id: string
  appName: string
  appId: string
  selected: boolean
  service?: SelectOption
}

export interface CDActivitySourceDTO extends ActivitySourceDTO {
  envMappings?: Array<{
    envId: string
    appId: string
    envIdentifier: string
  }>
  serviceMappings?: Array<{
    serviceId: string
    appId: string
    serviceIdentifier: string
  }>
}

const RenderColumnApplication: Renderer<CellProps<TableData>> = ({ row }) => {
  const data = row.original
  return (
    <Text lineClamp={1} width="95%">
      {data.appName}
    </Text>
  )
}

export function transformToSavePayload(data: any): CDActivitySourceDTO {
  const envMappings = Object.values(data.environments || {}).map((val: any) => ({
    envId: val.id,
    appId: val.appId,
    envIdentifier: val.environment?.value
  }))
  const serviceMappings = Object.values(data.services || {}).map((val: any) => ({
    serviceId: val.id,
    appId: val.appId,
    serviceIdentifier: val.service?.value
  }))

  return {
    identifier: data.identifier,
    name: data.name,
    uuid: data.uuid,
    type: 'HARNESS_CD10',
    envMappings,
    serviceMappings
  }
}

const SelectServices: React.FC<SelectServicesProps> = props => {
  const { getString } = useStrings()
  const [tableData, setTableData] = useState<Array<TableData>>()
  const [serviceOptions, setServiceOptions] = useState<any>([])
  const { accountId, orgIdentifier, projectIdentifier } = useParams<ProjectPathProps>()
  const { showError, clear } = useToaster()
  const [page, setPage] = useState(0)
  const [filter, setFilter] = useState<string | undefined>()
  const [offset, setOffset] = useState(0)
  const history = useHistory()
  const appIds = useMemo(() => Object.keys(props.initialValues.applications), [props.initialValues.applications])
  const { data, loading, error, refetch } = useGetListServices({
    queryParams: {
      appId: appIds,
      offset: String(offset),
      limit: '7',
      'search[0]': filter ? [{ field: 'keywords' }, { op: 'CONTAINS' }, { value: filter }] : undefined
    } as GetListServicesQueryParams,
    queryParamStringifyOptions: { arrayFormat: 'repeat' }
  })

  const { data: serviceResponse } = useGetServiceListForProject({
    queryParams: {
      accountId,
      orgIdentifier,
      projectIdentifier
    } as GetServiceListForProjectQueryParams,
    mock: props.mockGetServices
  })

  const { mutate } = useRegisterActivitySource({
    queryParams: {
      accountId,
      orgIdentifier,
      projectIdentifier
    }
  })

  useEffect(() => {
    if (serviceResponse?.data?.content?.length) {
      setServiceOptions(
        serviceResponse?.data?.content?.map(service => ({
          label: service.name,
          value: service.identifier
        }))
      )
    }
  }, [serviceResponse])

  useEffect(() => {
    if ((data?.resource as any)?.response) {
      const services = props.initialValues.services ?? {}
      const formatData = (data?.resource as any)?.response?.map((item: Service) => {
        return {
          name: item.name,
          id: item.uuid,
          appName: props.initialValues.applications[String(item.appId)].name,
          appId: item.appId,
          selected: !!services[String(item.uuid)],
          service: services[String(item.uuid)]?.service ?? ''
        }
      })

      setTableData(formatData)
    }
  }, [(data?.resource as any)?.response])

  const onUpdateData = (index: number, value: object) => {
    setTableData(old =>
      old?.map((row, i) => {
        if (index === i) {
          return {
            ...row,
            ...value
          }
        } else {
          return row
        }
      })
    )
  }

  if (loading) {
    return (
      <Container className={css.loadingErrorNoData}>
        <PageSpinner />
      </Container>
    )
  }

  if (error?.message) {
    return (
      <Container className={css.loadingErrorNoData}>
        <PageError message={error.message} onClick={() => refetch()} />
      </Container>
    )
  }

  if (!tableData?.length) {
    return (
      <Container className={css.loadingErrorNoData}>
        <NoDataCard
          icon="warning-sign"
          message={getString('cv.activitySources.harnessCD.service.noData')}
          buttonText={getString('retry')}
          onClick={() => refetch()}
        />
      </Container>
    )
  }
  const onNext = async () => {
    const services = tableData.reduce((acc: any, curr) => {
      if (curr.selected && curr.service) {
        acc[curr.id] = {
          id: curr.id,
          name: curr.name,
          appId: curr.appId,
          appName: curr.appName,
          service: curr.service
        }
      }
      return acc
    }, {})

    if (Object.keys(services).length) {
      props.onSubmit?.({ services, type: 'HarnessCD_1.0', sourceType: ONBOARDING_ENTITIES.CHANGE_SOURCE })

      const savePayload = transformToSavePayload({ ...props.initialValues, services })
      try {
        await mutate(savePayload)
        history.push(
          `${routes.toCVAdminSetup({
            accountId,
            projectIdentifier,
            orgIdentifier
          })}?step=1`
        )
      } catch (e) {
        if (e?.data) {
          clear()
          showError(getErrorMessage(e))
        }
      }
    }
  }

  return (
    <Container className={css.main}>
      <Text margin={{ top: 'large', bottom: 'large' }} color={Color.BLACK}>
        {getString('cv.activitySources.harnessCD.service.infoText')}
      </Text>
      <Formik<{ selectedServices: any[] }>
        initialValues={{ selectedServices: props.initialValues.selectedServices || [] }}
        onSubmit={() => {
          onNext()
        }}
      >
        {() => {
          return (
            <FormikForm>
              <Table<TableData>
                onRowClick={(rowData, index) => onUpdateData(index, { selected: !rowData.selected })}
                columns={[
                  {
                    Header: getString('cv.activitySources.harnessCD.service.harnessServices'),
                    accessor: 'name',

                    width: '28%',
                    Cell: function RenderApplications(tableProps) {
                      const rowData: TableData = tableProps?.row?.original as TableData

                      return (
                        <Layout.Horizontal spacing="small">
                          <input
                            style={{ cursor: 'pointer' }}
                            type="checkbox"
                            checked={rowData.selected}
                            onChange={e => {
                              onUpdateData(tableProps.row.index, { selected: e.target.checked })
                            }}
                          />
                          <Icon name="cd-main" />
                          <Text color={Color.BLACK} lineClamp={1} width="95%">
                            {rowData.name}
                          </Text>
                        </Layout.Horizontal>
                      )
                    },
                    disableSortBy: true
                  },
                  {
                    Header: getString('cv.activitySources.harnessCD.harnessApps'),
                    accessor: 'appName',

                    width: '28%',
                    Cell: RenderColumnApplication,

                    disableSortBy: true
                  },
                  {
                    Header: (
                      <TableColumnWithFilter
                        columnName={getString('cv.activitySources.harnessCD.service.services')}
                        onFilter={filterValue => setFilter(filterValue)}
                        appliedFilter={filter}
                      />
                    ),
                    accessor: 'service',
                    width: '44%',
                    Cell: function ServiceCell({ row, value }) {
                      return (
                        <Layout.Horizontal className={css.serviceContent}>
                          <Icon name="harness" margin={{ right: 'small', top: 'small' }} size={20} />
                          <ServiceSelectOrCreate
                            item={value}
                            options={serviceOptions}
                            onSelect={val => onUpdateData(row.index, { service: val })}
                            onNewCreated={(val: ServiceResponseDTO) => {
                              setServiceOptions([{ label: val.name, value: val.identifier }, ...serviceOptions])
                              onUpdateData(row.index, { service: { label: val.name, value: val.identifier } })
                            }}
                          />
                        </Layout.Horizontal>
                      )
                    },

                    disableSortBy: true
                  }
                ]}
                data={tableData || []}
                pagination={{
                  itemCount: (data?.resource as any)?.total || 0,
                  pageSize: (data?.resource as any)?.pageSize || 10,
                  pageCount: Math.ceil((data?.resource as any)?.total / 10) || -1,
                  pageIndex: page || 0,
                  gotoPage: pageNumber => {
                    setPage(pageNumber)
                    if (pageNumber) {
                      setOffset(pageNumber * 10 + 1)
                    } else {
                      setOffset(0)
                    }
                  }
                }}
              />
              <SubmitAndPreviousButtons
                onPreviousClick={props.onPrevious}
                nextButtonProps={{ text: getString('submit') }}
              />
            </FormikForm>
          )
        }}
      </Formik>
    </Container>
  )
}

export default SelectServices
