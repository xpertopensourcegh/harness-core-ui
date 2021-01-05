import React, { useState, useEffect } from 'react'
import { Container, Formik, FormikForm, Text, Layout, Icon, Color } from '@wings-software/uicore'
import type { CellProps, Renderer } from 'react-table'
import { useParams } from 'react-router-dom'
import type { FormikProps } from 'formik'
import Table from '@common/components/Table/Table'

import { SubmitAndPreviousButtons } from '@cv/pages/onboarding/SubmitAndPreviousButtons/SubmitAndPreviousButtons'

import {
  useGetListApplications,
  Application,
  RestResponsePageResponseApplication,
  GetListApplicationsQueryParams
} from 'services/portal'
import { PageSpinner } from '@common/components'
import { PageError } from '@common/components/Page/PageError'
import { NoDataCard } from '@common/components/Page/NoDataCard'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { useStrings } from 'framework/exports'
import type { UseGetMockData } from '@common/utils/testUtils'
import { TableColumnWithFilter } from '@cv/components/TableColumnWithFilter/TableColumnWithFilter'
import css from './SelectApplication.module.scss'

export interface HarnessCDActivitySourceDetailsProps {
  stepData: any
  onSubmit?: (data: any) => void
  onPrevious: () => void
  mockData?: UseGetMockData<RestResponsePageResponseApplication>
}
interface TableData {
  id: string
  name: string
  serviceCount: number
  selected: boolean
}

const RenderColumnServicesCount: Renderer<CellProps<TableData>> = ({ row }) => {
  const data = row.original
  return <Container className={css.serviceCol}>{data.serviceCount}</Container>
}
const SelectApplication: React.FC<HarnessCDActivitySourceDetailsProps> = props => {
  const { getString } = useStrings()
  const { accountId } = useParams<ProjectPathProps>()
  const [page, setPage] = useState(0)
  const [offset, setOffset] = useState(0)
  const [filter, setFilter] = useState<string | undefined>()
  const [disable, setDisable] = useState<boolean>(true)
  const [tableData, setTableData] = useState<Array<TableData>>()
  const { data, loading, error, refetch } = useGetListApplications({
    queryParams: {
      accountId,
      offset: String(offset),
      limit: '9',
      search: filter ? [{ field: 'keywords', op: 'CONTAINS', value: filter }] : undefined
    } as GetListApplicationsQueryParams,
    mock: props.mockData
  })

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
  useEffect(() => {
    if ((data?.resource as any)?.response) {
      const apps = props.stepData.applications ?? {}

      const formatData = (data?.resource as any)?.response?.map((item: Application) => {
        return {
          name: item.name,
          id: item.uuid,

          selected: !!apps[String(item.uuid)],
          serviceCount: item.services?.length
        }
      })

      setTableData(formatData)
    }
  }, [(data?.resource as any)?.response])

  useEffect(() => {
    let visited = false
    tableData?.forEach(item => {
      if (!visited && item.selected) {
        visited = true
        setDisable(false)
      }
    })
    if (!visited) setDisable(true)
  }, [tableData])

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
          message={getString('cv.activitySources.harnessCD.application.noData')}
          buttonText={getString('retry')}
          onClick={() => refetch()}
        />
      </Container>
    )
  }

  const onNext = () => {
    const applications = tableData.reduce((acc: any, curr) => {
      if (curr.selected) {
        acc[curr.id] = {
          id: curr.id,
          name: curr.name,
          serviceCount: curr.serviceCount
        }
      }
      return acc
    }, {})
    if (Object.keys(applications).length) {
      props.onSubmit?.({ applications })
    }
  }

  const totalpages = Math.ceil((data?.resource as any)?.total / 10)

  return (
    <Container className={css.main}>
      <Text margin={{ top: 'large', bottom: 'large' }} color={Color.BLACK}>
        {getString('cv.activitySources.harnessCD.application.infoText')}
      </Text>
      <Formik
        initialValues={{
          selectedApplications: props.stepData.applications || []
        }}
        onSubmit={onNext}
      >
        {(formik: FormikProps<{ selectedApplications: Array<Application> }>) => {
          return (
            <FormikForm>
              <Table<TableData>
                onRowClick={(rowData, index) => onUpdateData(index, { selected: !rowData.selected })}
                columns={[
                  {
                    Header: getString('cv.activitySources.harnessCD.harnessApps') || '',
                    accessor: 'selected',

                    width: '40%',
                    Cell: function RenderApplications(tableProps) {
                      const rowData: TableData = tableProps.row?.original

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
                          <Text color={Color.BLACK} lineClamp={1} width="80%">
                            {rowData.name}
                          </Text>
                        </Layout.Horizontal>
                      )
                    },

                    disableSortBy: true
                  },
                  {
                    Header: (
                      <TableColumnWithFilter
                        columnName={getString('cv.activitySources.harnessCD.application.servicesToBeImported')}
                        onFilter={filterValue => setFilter(filterValue)}
                        appliedFilter={filter}
                      />
                    ),
                    id: 'serviceCount',
                    width: '60%',
                    Cell: RenderColumnServicesCount,

                    disableSortBy: true
                  }
                ]}
                data={tableData}
                pagination={{
                  itemCount: (data?.resource as any)?.total || 0,
                  pageSize: (data?.resource as any)?.pageSize || 10,
                  pageCount: totalpages || -1,
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
                nextButtonProps={{ disabled: disable }}
                onPreviousClick={props.onPrevious}
                onNextClick={() => {
                  formik.submitForm()
                }}
              />
            </FormikForm>
          )
        }}
      </Formik>
    </Container>
  )
}

export default SelectApplication
