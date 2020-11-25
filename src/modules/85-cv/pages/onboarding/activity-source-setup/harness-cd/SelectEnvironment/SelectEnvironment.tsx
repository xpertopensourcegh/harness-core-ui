import React, { useEffect, useState } from 'react'
import { Container, Formik, FormikForm, Text, Layout, Icon, Color, SelectOption } from '@wings-software/uikit'
import type { CellProps, Renderer } from 'react-table'
import { useParams } from 'react-router-dom'
import type { FormikProps } from 'formik'
import Table from '@common/components/Table/Table'

import { SubmitAndPreviousButtons } from '@cv/pages/onboarding/SubmitAndPreviousButtons/SubmitAndPreviousButtons'

import { useList, Application, Environment, RestResponsePageResponseApplication } from 'services/portal'
import { PageSpinner } from '@common/components'
import { PageError } from '@common/components/Page/PageError'
import { NoDataCard } from '@common/components/Page/NoDataCard'
import { useStrings } from 'framework/exports'
import EnvironmentSelect from '@cv/pages/monitoring-source/app-dynamics/SelectApplications/EnvironmentSelect'
import {
  useGetEnvironmentListForProject,
  EnvironmentResponseDTO,
  ResponsePageEnvironmentResponseDTO
} from 'services/cd-ng'
import type { UseGetMockData } from '@common/utils/testUtils'
import css from '../SelectApplication/SelectApplication.module.scss'

export interface SelectEnvironmentProps {
  initialValues?: any
  onSubmit?: (data: any) => void
  onPrevious: () => void
  mockData?: UseGetMockData<RestResponsePageResponseApplication>
  mockGetEnvironments?: UseGetMockData<ResponsePageEnvironmentResponseDTO>
}

export interface Options {
  name: string
  value: string
}

interface RenderColumnApplicationsProps {
  tableProps: CellProps<object>
  selectedEnvironments: Set<TableData>
  setFieldValue: (fieldName: string, value: Set<TableData>) => void
}

interface TableData {
  name: string
  uuid: string
  appName: string
  appId: string
  selected: boolean
  environment?: SelectOption
}

const RenderColumnHarnessEnvironment: React.FC<RenderColumnApplicationsProps> = props => {
  const data: TableData = props.tableProps?.row?.original as TableData

  const isApplicationSelected = props.selectedEnvironments.has(data as TableData)

  return (
    <Layout.Horizontal spacing="small">
      <input
        type="checkbox"
        checked={isApplicationSelected}
        onClick={e => {
          if (!e.currentTarget.checked) {
            props.selectedEnvironments?.delete(data)
          } else {
            props.selectedEnvironments?.add(data)
          }
          props.setFieldValue('selectedEnvironments', new Set(props.selectedEnvironments))
        }}
      />
      <Icon name="cd-main" />
      <Text color={Color.BLACK}>{data.name}</Text>
    </Layout.Horizontal>
  )
}
const RenderColumnApplication: Renderer<CellProps<TableData>> = ({ row }) => {
  const data = row.original
  return <Text>{data.appName}</Text>
}

const SelectEnvironment: React.FC<SelectEnvironmentProps> = props => {
  const { getString } = useStrings()
  const [tableData, setTableData] = useState<Array<TableData>>()
  const [environmentOptions, setEnvironmentOptions] = useState<any>([])
  const { accountId, orgIdentifier, projectIdentifier } = useParams()
  const { data, loading, error, refetch } = useList({
    lazy: true,
    mock: props.mockData
  })

  const { data: environmentsResponse } = useGetEnvironmentListForProject({
    queryParams: {
      accountId,
      orgIdentifier: orgIdentifier as string,
      projectIdentifier: projectIdentifier as string
    },
    mock: props.mockGetEnvironments
  })

  useEffect(() => {
    if (environmentsResponse?.data?.content?.length) {
      setEnvironmentOptions(
        environmentsResponse?.data?.content?.map(env => ({
          label: env.name,
          value: env.name
        }))
      )
    }
  }, [environmentsResponse])

  useEffect(() => {
    const appIds = props.initialValues.selectedApplications?.map((item: Application) => item.uuid)
    refetch({ queryParams: { accountId, appIds } })
  }, [props.initialValues.selectedApplications])

  useEffect(() => {
    if ((data?.resource as any)?.response) {
      const formatData = (data?.resource as any)?.response?.map((item: Application) => {
        const appName = item.name

        return item?.environments?.map((envItem: Environment) => {
          return {
            name: envItem.name,
            uuid: envItem.uuid,
            appName: appName,
            appId: item.appId
          }
        })
      })

      setTableData(formatData.flat())
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
          message={getString('cv.activitySources.harnessCD.environment.noData')}
          buttonText={getString('retry')}
          onClick={() => refetch()}
        />
      </Container>
    )
  }

  return (
    <Container>
      <Formik
        initialValues={{ selectedEnvironments: new Set<TableData>() }}
        onSubmit={values => {
          props.onSubmit?.({ selectedEnvironments: Array.from(values.selectedEnvironments.keys()) })
        }}
      >
        {(formik: FormikProps<{ selectedEnvironments: Set<TableData> }>) => {
          const { selectedEnvironments } = formik.values

          return (
            <FormikForm>
              <Container width={'60%'} style={{ margin: 'auto' }} padding={{ top: 'xxxlarge' }}>
                <Text margin={{ top: 'large', bottom: 'large' }}>
                  {getString('cv.activitySources.harnessCD.environment.infoText')}
                </Text>

                <Table<TableData>
                  columns={[
                    {
                      Header: getString('cv.activitySources.harnessCD.environment.harnessEnv'),
                      accessor: 'name',

                      width: '33%',
                      Cell: function RenderApplications(tableProps: CellProps<object>) {
                        return (
                          <RenderColumnHarnessEnvironment
                            tableProps={tableProps}
                            selectedEnvironments={selectedEnvironments}
                            setFieldValue={formik.setFieldValue}
                          />
                        )
                      },
                      disableSortBy: true
                    },
                    {
                      Header: getString('cv.activitySources.harnessCD.harnessApps'),
                      accessor: 'appName',

                      width: '33%',
                      Cell: RenderColumnApplication,

                      disableSortBy: true
                    },
                    {
                      Header: getString('cv.activitySources.harnessCD.environment.env'),
                      accessor: 'environment',

                      width: '33%',
                      Cell: function EnvironmentCell({ row, value }) {
                        return (
                          <Layout.Horizontal>
                            <Icon name="harness" margin={{ right: 'small', top: 'small' }} size={20} />
                            <EnvironmentSelect
                              item={value}
                              options={environmentOptions}
                              onSelect={val => onUpdateData(row.index, { environment: val })}
                              onNewCreated={(val: EnvironmentResponseDTO) => {
                                setEnvironmentOptions([{ label: val.name, value: val.name }, ...environmentOptions])
                                onUpdateData(row.index, { environment: val.name })
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
                    pageCount: (data?.resource as any)?.total || -1,
                    pageIndex: (data?.resource as any)?.offset || 0,
                    gotoPage: () => undefined
                  }}
                />
              </Container>
              <SubmitAndPreviousButtons
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

export default SelectEnvironment
