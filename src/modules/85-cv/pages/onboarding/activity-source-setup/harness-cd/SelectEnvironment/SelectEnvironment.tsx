import React, { useEffect, useState } from 'react'
import { Container, Formik, FormikForm, Text, Layout, Icon, Color, SelectOption } from '@wings-software/uikit'
import type { CellProps, Renderer } from 'react-table'
import { useParams } from 'react-router-dom'
import type { FormikProps } from 'formik'
import Table from '@common/components/Table/Table'

import { SubmitAndPreviousButtons } from '@cv/pages/onboarding/SubmitAndPreviousButtons/SubmitAndPreviousButtons'

import { Environment, useGetListEnvironments } from 'services/portal'
import { PageSpinner } from '@common/components'
import { PageError } from '@common/components/Page/PageError'
import { NoDataCard } from '@common/components/Page/NoDataCard'
import { useStrings } from 'framework/exports'
import EnvironmentSelect from '@cv/pages/monitoring-source/app-dynamics/SelectApplications/EnvironmentSelect'
import { useGetEnvironmentListForProject, EnvironmentResponseDTO } from 'services/cd-ng'

import css from '../SelectApplication/SelectApplication.module.scss'

export interface SelectEnvironmentProps {
  initialValues?: any
  onSubmit?: (data: any) => void
  onPrevious: () => void
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
  environment?: SelectOption
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
  const { data, loading, error, refetch: refetchEnvironments } = useGetListEnvironments({
    lazy: true
  })

  const { data: environmentsResponse } = useGetEnvironmentListForProject({
    queryParams: {
      accountId,
      orgIdentifier: orgIdentifier as string,
      projectIdentifier: projectIdentifier as string
    }
  })

  useEffect(() => {
    if (environmentsResponse?.data?.content?.length) {
      setEnvironmentOptions(
        environmentsResponse?.data?.content?.map(env => ({
          label: env.name,
          value: env.identifier
        }))
      )
    }
  }, [environmentsResponse])

  useEffect(() => {
    const appIds = Object.keys(props.initialValues.applications || {})

    refetchEnvironments({
      queryParams: { appId: appIds },
      queryParamStringifyOptions: { arrayFormat: 'repeat' }
    })
  }, [props.initialValues.selectedApplications])

  useEffect(() => {
    if ((data?.resource as any)?.response) {
      const env = props.initialValues.environments ?? {}

      const formatData = (data?.resource as any)?.response?.map((item: Environment) => {
        return {
          name: item.name,
          id: item.uuid,
          appName: props.initialValues.applications[String(item.appId)].name,
          appId: item.appId,
          selected: !!env[String(item.uuid)],
          environment: env[String(item.uuid)]?.environment ?? {}
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
        <PageError message={error.message} onClick={() => refetchEnvironments()} />
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
          onClick={() => refetchEnvironments()}
        />
      </Container>
    )
  }

  const onNext = () => {
    const environments = tableData.reduce((acc: any, curr) => {
      if (curr.selected && curr.environment) {
        acc[curr.id] = {
          id: curr.id,
          name: curr.name,
          appId: curr.appId,
          appName: curr.appName,
          environment: curr.environment
        }
      }
      return acc
    }, {})
    if (Object.keys(environments).length) {
      props.onSubmit?.({ environments })
    }
  }

  return (
    <Container>
      <Formik
        initialValues={{ selectedEnvironments: props.initialValues.selectedEnvironments || [] }}
        onSubmit={onNext}
      >
        {(formik: FormikProps<{ selectedEnvironments: Array<TableData> }>) => {
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
                            <Text color={Color.BLACK}>{rowData.name}</Text>
                          </Layout.Horizontal>
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
                                setEnvironmentOptions([
                                  { label: val.name, value: val.identifier },
                                  ...environmentOptions
                                ])
                                onUpdateData(row.index, { environment: { label: val.name, value: val.identifier } })
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
