import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Color, Container, Intent, Layout, SelectOption, Text } from '@wings-software/uicore'
import type { CellProps } from 'react-table'
import { useParams } from 'react-router-dom'
import { SetupSourceMappingList } from '@cv/components/CVSetupSourcesView/SetupSourceMappingList/SetupSourceMappingList'
import { SetupSourceTabsContext } from '@cv/components/CVSetupSourcesView/SetupSourceTabs/SetupSourceTabs'
import { useStrings } from 'framework/exports'
import { MetricPackDTO, useGetNewRelicApplications } from 'services/cv'
import { useConfirmationDialog } from '@common/exports'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import type { StepLabelProps } from '@cv/components/CVSetupSourcesView/StepLabel/StepLabel'
import { SelectMetricPack } from '@cv/pages/monitoring-source/SelectMetricPack/SelectMetricPack'
import { getErrorMessage } from '@cv/utils/CommonUtils'
import { SetupSourceLayout } from '@cv/components/CVSetupSourcesView/SetupSourceLayout/SetupSourceLayout'
import {
  useGetHarnessServices,
  HarnessService,
  HarnessEnvironment,
  useGetHarnessEnvironments
} from '@cv/components/HarnessServiceAndEnvironment/HarnessServiceAndEnvironment'
import type { NewRelicSetupSource, NewRelicServiceEnvMapping } from '../NewRelicMonitoringSourceUtils'
import { SelectedAppsSideNav } from './SelectedAppsSideNav/SelectedAppsSideNav'
import type { ValidationMappingCellProps } from '../../ValidateMappingCell/ValidateMappingCell'
import css from './MapNewRelicAppsToServiceAndEnvs.module.scss'

const MetricPackStep: StepLabelProps = {
  stepNumber: 1,
  totalSteps: 2
}

const MappingApplicationsStep: StepLabelProps = {
  stepNumber: 2,
  totalSteps: 2
}

type TableData = {
  environment?: SelectOption
  service?: SelectOption
  applicationName: string
  applicationId: number
  validationResult?: ValidationMappingCellProps['validationStatus']
}

interface ValidationCellProps extends CellProps<TableData> {
  connectorRef: NewRelicSetupSource['connectorRef']
  onValidationComplete: (validationResult: ValidationMappingCellProps['validationStatus']) => void
}

function ValidationCell(_: ValidationCellProps): JSX.Element {
  // const { environment, service, applicationId } = props.row.original || {}
  // const { projectIdentifier, orgIdentifier, accountId } = useParams<ProjectPathProps>()
  // const [isLoading, setLoading] = useState(false)
  // const [response, setResponse] = useState<AppdynamicsValidationResponse[]>([])
  // const { cancel, mutate, error } = useGetAppDynamicsMetricData({
  //   queryParams: {
  //     projectIdentifier,
  //     orgIdentifier,
  //     accountId,
  //     appName: applicationId.toString(),
  //     tierName: '',
  //     requestGuid: Utils.randomId(),
  //     connectorIdentifier: ''
  //   }
  // })

  // useEffect(() => {
  //   if (!service?.value) {
  //     return
  //   }
  //   setLoading(true)
  //   cancel()
  //   mutate({}).then(res => {
  //     setLoading(false)
  //     if (res?.data?.length) {
  //       setResponse(res.data)
  //       props.onValidationComplete(res.data[0].overallStatus)
  //     }
  //   })
  // }, [service?.value, environment?.value])

  // return (
  //   <ValidateMappingCell
  //     validationStatus={
  //       isLoading
  //         ? 'LOADING'
  //         : (response[0]?.overallStatus as ValidationMappingCellProps['validationStatus']) || 'NO_STATUS'
  //     }
  //     apiError={getErrorMessage(error)}
  //   />
  // )

  return <Container />
}

export function MapNewRelicAppsToServicesAndEnvs(): JSX.Element {
  const { onPrevious, onNext, sourceData } = useContext(SetupSourceTabsContext)
  const { getString } = useStrings()
  const { projectIdentifier, orgIdentifier, accountId } = useParams<ProjectPathProps>()
  const { serviceOptions, setServiceOptions } = useGetHarnessServices()
  const { environmentOptions, setEnvironmentOptions } = useGetHarnessEnvironments()
  const [tableData, setTableData] = useState<TableData[]>([])
  const [validationText, setValidationText] = useState({ titleText: '', contentText: '' })
  const [selectedMetricPacks, setSelectedMetricPacks] = useState<MetricPackDTO[]>(sourceData.selectedMetricPacks || [])
  const { openDialog } = useConfirmationDialog({
    ...validationText,
    cancelButtonText: getString('cv.monitoringSources.backToMapping'),
    intent: Intent.WARNING,
    buttonIntent: Intent.PRIMARY
  })
  const [selectedApps, setSelectedApps] = useState<Map<number, NewRelicServiceEnvMapping>>(
    sourceData?.mappedServicesAndEnvs || new Map()
  )
  const { data, error, loading, refetch } = useGetNewRelicApplications({
    queryParams: {
      projectIdentifier,
      orgIdentifier,
      accountId,
      connectorIdentifier: sourceData.connectorRef?.value,
      offset: 0,
      pageSize: 1000
    }
  })

  useEffect(() => {
    if (!data?.data?.length) {
      return
    }

    const applicationData: TableData[] = []
    for (const application of data?.data) {
      if (application.applicationId && application.applicationName) {
        const selectedDetails = selectedApps.get(application.applicationId)
        applicationData.push({
          applicationId: application.applicationId,
          applicationName: application.applicationName,
          service: selectedDetails?.service,
          environment: selectedDetails?.environment
        })
      }
    }

    setTableData(applicationData)
  }, [data])

  const updateSelectedApps = (
    applicationId: number,
    applicationName: string,
    service?: SelectOption,
    environment?: SelectOption
  ) => {
    setSelectedApps(oldApps => {
      const exisitingApp = oldApps.get(applicationId)
      if (service && environment) {
        oldApps.set(applicationId, { applicationId, service, environment, applicationName: applicationName })
      } else if (exisitingApp && (!service || !environment)) {
        oldApps.delete(applicationId)
      }

      return new Map(oldApps)
    })
  }

  const selectedApplicationNames = useMemo(() => {
    const appNames = []
    for (const selectedApp of selectedApps) {
      appNames.push(selectedApp[1].applicationName)
    }
    return appNames
  }, [selectedApps])

  return (
    <SetupSourceLayout
      leftPanelContent={<SelectedAppsSideNav selectedApps={selectedApplicationNames} loading={loading} />}
      content={
        <Container>
          <Layout.Vertical spacing="medium">
            <SelectMetricPack
              dataSourceType="NEW_RELIC"
              onSelectMetricPack={metricPacks => setSelectedMetricPacks(metricPacks)}
              stepProps={MetricPackStep}
            />
            <SetupSourceMappingList<TableData>
              loading={loading}
              error={{
                onClick: () => refetch(),
                message: getErrorMessage(error)
              }}
              noData={{
                onClick: () => refetch(),
                buttonText: getString('retry'),
                message: getString('cv.monitoringSources.appD.noAppsMsg')
              }}
              tableFilterProps={{
                placeholder: getString('cv.monitoringSources.appD.searchPlaceholderApplications'),
                isItemInFilter: (filterString: string, rowObject: TableData) => {
                  return rowObject.applicationName.toLocaleLowerCase().includes(filterString.toLocaleLowerCase())
                }
              }}
              mappingListHeaderProps={{
                mainHeading: getString('cv.monitoringSources.newRelic.mapNewRelicAppsToServicesAndEnvs'),
                subHeading: getString('cv.monitoringSources.newRelic.mappingServiceAndEnvSubheading'),
                stepLabelProps: MappingApplicationsStep
              }}
              tableProps={{
                data: tableData,
                columns: [
                  {
                    Header: getString('cv.monitoringSources.newRelic.newRelicAppColumn'),
                    accessor: 'applicationName',
                    width: '20%',
                    disableSortBy: true,
                    Cell: function AppName(tableProps: CellProps<TableData>) {
                      return (
                        <Text lineClamp={1} color={Color.BLACK}>
                          {tableProps.row.original?.applicationName}
                        </Text>
                      )
                    }
                  },
                  {
                    Header: getString('cv.monitoringSources.appD.mapToHarnessEnvironment'),
                    accessor: 'environment',
                    width: '30%',
                    disableSortBy: true,
                    Cell: function Environment(cellProps: CellProps<TableData>) {
                      const { environment, applicationId, service, applicationName } = cellProps.row.original || {}
                      return (
                        <HarnessEnvironment
                          className={css.dropDown}
                          item={environment}
                          onSelect={env => {
                            tableData[cellProps.row.index].environment = env
                            setTableData([...tableData])
                            updateSelectedApps(applicationId, applicationName, service, env)
                          }}
                          options={environmentOptions}
                          onNewCreated={newOption => {
                            if (newOption?.identifier && newOption.name) {
                              const newEnvOption = { label: newOption.name, value: newOption.identifier }
                              setEnvironmentOptions([newEnvOption, ...environmentOptions])
                              tableData[cellProps.row.index].environment = newEnvOption
                              setTableData([...tableData])
                              updateSelectedApps(applicationId, applicationName, service, newEnvOption)
                            }
                          }}
                        />
                      )
                    }
                  },
                  {
                    Header: getString('cv.monitoringSources.appD.mappingToHarnessService'),
                    accessor: 'service',
                    width: '30%',
                    disableSortBy: true,
                    Cell: function Service(cellProps: CellProps<TableData>) {
                      const { service: rowService, applicationId, environment, applicationName } =
                        cellProps.row.original || {}
                      return (
                        <HarnessService
                          className={css.dropDown}
                          item={rowService}
                          onSelect={(service: SelectOption) => {
                            tableData[cellProps.row.index].service = service
                            setTableData([...tableData])
                            updateSelectedApps(applicationId, applicationName, service, environment)
                          }}
                          options={serviceOptions}
                          onNewCreated={newOption => {
                            if (newOption?.identifier && newOption.name) {
                              const newServiceOption = { label: newOption.name, value: newOption.identifier }
                              setServiceOptions([newServiceOption, ...serviceOptions])
                              tableData[cellProps.row.index].service = newServiceOption
                              setTableData([...tableData])
                              updateSelectedApps(applicationId, applicationName, rowService, newServiceOption)
                            }
                          }}
                        />
                      )
                    }
                  },
                  {
                    Header: getString('cv.monitoringSources.appD.validation'),
                    accessor: 'validationResult',
                    width: '20%',
                    disableSortBy: true,
                    Cell: function ValCell(cellProps: CellProps<TableData>) {
                      return (
                        <ValidationCell
                          {...cellProps}
                          connectorRef={sourceData.connectorRef}
                          onValidationComplete={() => undefined}
                        />
                      )
                      // const { applicationId, environment, service } = tableProps.row.original || {}
                      // return (
                      //   <ValidationCell
                      //     onValidationComplete={(validationResult: ValidationMappingCellProps['validationStatus']) => {
                      //       if (
                      //         (validationResult === 'SUCCESS' || validationResult === 'NO_DATA') &&
                      //         service &&
                      //         environment
                      //       ) {
                      //         selectedApps.set(applicationId, { service, environment, applicationId })
                      //         setSelectedApps(new Map(selectedApps))
                      //       }
                      //       tableData[tableProps.row.index].validationResult = validationResult
                      //       setTableData([...tableData])
                      //     }}
                      //     connectorRef={sourceData.connectorRef}
                      //     {...tableProps}
                      //   />
                      // )
                    }
                  }
                ]
              }}
            />
          </Layout.Vertical>
        </Container>
      }
      footerCTAProps={{
        onNext: async () => {
          if (!selectedApps.size) {
            setValidationText({
              titleText: getString('cv.monitoringSources.oneMetricMappingValidation'),
              contentText: getString('cv.monitoringSources.newRelic.oneMetricMappingValidationSubtext')
            })
            openDialog()
          } else if (!selectedMetricPacks.length) {
            setValidationText({
              titleText: getString('cv.monitoringSources.oneMetricPackValidation'),
              contentText: getString('cv.monitoringSources.oneMetricMappingValidationSubtext')
            })
            openDialog()
          } else {
            onNext({ ...sourceData, mappedServicesAndEnvs: selectedApps, selectedMetricPacks })
          }
        },
        onPrevious: () => onPrevious({ ...sourceData, mappedServicesAndEnvs: selectedApps, selectedMetricPacks })
      }}
    />
  )
}
