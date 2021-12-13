import React, { useState, useMemo, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { Container, Accordion, FormInput, SelectOption, Utils, Button } from '@wings-software/uicore'
import { useStrings } from 'framework/strings'
import { useGetMetricPacks, useGetLabelNames, useGetSampleDataForNRQL, useGetParsedTimeseries } from 'services/cv'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { SetupSourceCardHeader } from '@cv/components/CVSetupSourcesView/SetupSourceCardHeader/SetupSourceCardHeader'
import { SetupSourceLayout } from '@cv/components/CVSetupSourcesView/SetupSourceLayout/SetupSourceLayout'
import { MultiItemsSideNav } from '@cv/components/MultiItemsSideNav/MultiItemsSideNav'
import SelectHealthSourceServices from '@cv/pages/health-source/common/SelectHealthSourceServices/SelectHealthSourceServices'
import { HealthSourceQueryType } from '@cv/pages/health-source/common/HealthSourceQueryType/HealthSourceQueryType'
import { QueryViewer } from '@cv/components/QueryViewer/QueryViewer'
import { InputWithDynamicModalForJson } from '@cv/components/InputWithDynamicModalForJson/InputWithDynamicModalForJson'
import { QueryType } from '@cv/pages/health-source/common/HealthSourceQueryType/HealthSourceQueryType.types'
import GroupName from '@cv/components/GroupName/GroupName'
import MetricLineChart from '@cv/pages/health-source/common/MetricLineChart/MetricLineChart'
import { updateSelectedMetricsMap, initializeGroupNames } from '../../NewRelicHealthSourceContainer.util'
import { NewRelicHealthSourceFieldNames } from '../../NewRelicHealthSource.constants'
import { getOptionsForChart } from './NewRelicMappedMetric.utils'
import css from '../../NewrelicMonitoredSource.module.scss'

export default function NewRelicMappedMetric({
  setMappedMetrics,
  selectedMetric,
  formikValues,
  formikSetField,
  connectorIdentifier,
  mappedMetrics,
  createdMetrics,
  isValidInput,
  setCreatedMetrics
}: {
  setMappedMetrics: React.Dispatch<any>
  selectedMetric: string
  formikValues: any
  formikSetField: any
  connectorIdentifier: string
  mappedMetrics: any
  createdMetrics: string[]
  isValidInput: boolean
  setCreatedMetrics: React.Dispatch<any>
}): JSX.Element {
  const { getString } = useStrings()
  const labelNameTracingId = useMemo(() => Utils.randomId(), [])
  const { accountId, orgIdentifier, projectIdentifier } = useParams<ProjectPathProps>()

  const metricPackResponse = useGetMetricPacks({
    queryParams: { projectIdentifier, orgIdentifier, accountId, dataSourceType: 'NEW_RELIC' }
  })
  const labelNamesResponse = useGetLabelNames({
    queryParams: { projectIdentifier, orgIdentifier, accountId, connectorIdentifier, tracingId: labelNameTracingId }
  })

  const [newRelicGroupName, setNewRelicGroupName] = useState<SelectOption[]>(
    initializeGroupNames(mappedMetrics, getString)
  )

  const [isQueryExecuted, setIsQueryExecuted] = useState(false)
  const query = useMemo(() => (formikValues?.query?.length ? formikValues.query : ''), [formikValues])

  const queryParamsForNRQL = useMemo(
    () => ({
      accountId,
      projectIdentifier,
      orgIdentifier,
      requestGuid: Utils.randomId(),
      connectorIdentifier,
      nrql: query
    }),

    [accountId, projectIdentifier, orgIdentifier, connectorIdentifier, query]
  )
  const {
    // Note - this will be uncommented once the api is fixed
    data: nrqlResponse,
    refetch: fetchRecords,
    loading,
    error
  } = useGetSampleDataForNRQL({
    queryParams: queryParamsForNRQL,
    lazy: true
  })

  const sampleRecord = nrqlResponse?.data as Record<string, any>

  const queryParamsForTimeSeriesData = useMemo(
    () => ({
      accountId,
      orgIdentifier,
      projectIdentifier,
      jsonResponse: JSON.stringify(sampleRecord),
      groupName: formikValues?.groupName?.value,
      metricValueJsonPath: formikValues?.metricValue,
      timestampJsonPath: formikValues?.timestamp,
      timestampFormat: formikValues?.timestampFormat
    }),

    [
      accountId,
      orgIdentifier,
      projectIdentifier,
      sampleRecord,
      formikValues?.groupName?.value,
      formikValues?.metricValue,
      formikValues?.timestamp,
      formikValues?.timestampFormat
    ]
  )

  const {
    data: newRelicTimeSeriesData,
    refetch: fetchNewRelicTimeSeriesData,
    loading: timeSeriesDataLoading,
    error: timeseriesDataError
  } = useGetParsedTimeseries({
    queryParams: queryParamsForTimeSeriesData,
    lazy: true
  })

  const fetchNewRelicResponse = useCallback(async () => {
    fetchRecords({ queryParams: queryParamsForNRQL })
    setIsQueryExecuted(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParamsForNRQL])

  const handleBuildChart = useCallback(() => {
    fetchNewRelicTimeSeriesData({ queryParams: queryParamsForTimeSeriesData })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParamsForTimeSeriesData])

  const options = useMemo(() => {
    return getOptionsForChart(newRelicTimeSeriesData)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newRelicTimeSeriesData])

  const isSelectingJsonPathDisabled = !isQueryExecuted || loading || !sampleRecord

  return (
    <SetupSourceLayout
      leftPanelContent={
        <MultiItemsSideNav
          defaultMetricName={'New Relic Metric'}
          tooptipMessage={getString('cv.monitoringSources.gcoLogs.addQueryTooltip')}
          addFieldLabel={getString('cv.monitoringSources.addMetric')}
          createdMetrics={createdMetrics}
          defaultSelectedMetric={selectedMetric}
          renamedMetric={formikValues?.metricName}
          isValidInput={isValidInput}
          onRemoveMetric={(removedMetric, updatedMetric, updatedList, smIndex) => {
            setMappedMetrics((oldState: any) => {
              const { selectedMetric: oldMetric, mappedMetrics: oldMappedMetric } = oldState
              const updatedMap = new Map(oldMappedMetric)

              if (updatedMap.has(removedMetric)) {
                updatedMap.delete(removedMetric)
              } else {
                // handle case where user updates the metric name for current selected metric
                updatedMap.delete(oldMetric)
              }

              // update map with current values
              if (formikValues?.metricName !== removedMetric) {
                updatedMap.set(updatedMetric, { ...formikValues } || { metricName: updatedMetric })
              }

              setCreatedMetrics({ selectedMetricIndex: smIndex, createdMetrics: updatedList })
              return { selectedMetric: updatedMetric, mappedMetrics: updatedMap }
            })
          }}
          onSelectMetric={(newMetric, updatedList, smIndex) => {
            setCreatedMetrics({ selectedMetricIndex: smIndex, createdMetrics: updatedList })
            setMappedMetrics((oldState: any) => {
              return updateSelectedMetricsMap({
                updatedMetric: newMetric,
                oldMetric: oldState.selectedMetric,
                mappedMetrics: oldState.mappedMetrics,
                formikValues
              })
            })
          }}
        />
      }
      content={
        <Container className={css.main}>
          <SetupSourceCardHeader
            mainHeading={getString('cv.monitoringSources.prometheus.querySpecificationsAndMappings')}
            subHeading={getString('cv.monitoringSources.prometheus.customizeQuery')}
          />
          <Container className={css.content}>
            <Accordion activeId="metricToService" className={css.accordian}>
              <Accordion.Panel
                id="metricToService"
                summary={getString('cv.monitoringSources.mapMetricsToServices')}
                details={
                  <>
                    <FormInput.Text label={getString('cv.monitoringSources.metricNameLabel')} name={'metricName'} />
                    <GroupName
                      groupNames={newRelicGroupName}
                      onChange={formikSetField}
                      item={formikValues?.groupName}
                      setGroupNames={setNewRelicGroupName}
                      label={getString('cv.monitoringSources.prometheus.groupName')}
                      title={getString('cv.healthSource.connectors.NewRelic.groupName')}
                      fieldName={'groupName'}
                    />
                  </>
                }
              />
              <Accordion.Panel
                id="querySpecificationsAndMapping"
                summary={getString('cv.healthSource.connectors.NewRelic.queryMapping')}
                details={
                  <>
                    <HealthSourceQueryType />
                    <QueryViewer
                      recordsClassName={css.recordsClassName}
                      queryLabel={getString('cv.healthSource.connectors.NewRelic.nrqlQuery')}
                      isQueryExecuted={isQueryExecuted}
                      queryNotExecutedMessage={getString('cv.healthSource.connectors.NewRelic.submitQueryNoRecords')}
                      records={[sampleRecord] as Record<string, any>[]}
                      fetchRecords={fetchNewRelicResponse}
                      loading={loading}
                      error={error}
                      query={query}
                      fetchEntityName={getString('cv.response')}
                    />
                  </>
                }
              />
              <Accordion.Panel
                id="metricChart"
                summary={getString('cv.healthSource.connectors.NewRelic.metricValueAndCharts')}
                details={
                  <>
                    <InputWithDynamicModalForJson
                      onChange={formikSetField}
                      fieldValue={formikValues?.metricValue}
                      isQueryExecuted={isQueryExecuted}
                      isDisabled={isSelectingJsonPathDisabled}
                      sampleRecord={sampleRecord}
                      inputName={NewRelicHealthSourceFieldNames.METRIC_VALUE}
                      inputLabel={getString(
                        'cv.healthSource.connectors.NewRelic.metricFields.metricValueJsonPath.label'
                      )}
                      noRecordModalHeader={getString(
                        'cv.healthSource.connectors.NewRelic.metricFields.metricValueJsonPath.noRecordModalHeader'
                      )}
                      noRecordInputLabel={getString(
                        'cv.healthSource.connectors.NewRelic.metricFields.metricValueJsonPath.noRecordInputLabel'
                      )}
                      recordsModalHeader={getString(
                        'cv.healthSource.connectors.NewRelic.metricFields.metricValueJsonPath.recordsModalHeader'
                      )}
                      showExactJsonPath={true}
                    />
                    <InputWithDynamicModalForJson
                      onChange={formikSetField}
                      fieldValue={formikValues?.timestamp}
                      isQueryExecuted={isQueryExecuted}
                      isDisabled={isSelectingJsonPathDisabled}
                      sampleRecord={sampleRecord}
                      inputName={NewRelicHealthSourceFieldNames.TIMESTAMP_LOCATOR}
                      inputLabel={'Timestamp Field/Locator Json Path'}
                      noRecordModalHeader={getString(
                        'cv.healthSource.connectors.NewRelic.metricFields.timestampJsonPath.noRecordModalHeader'
                      )}
                      noRecordInputLabel={getString(
                        'cv.healthSource.connectors.NewRelic.metricFields.timestampJsonPath.noRecordInputLabel'
                      )}
                      recordsModalHeader={getString(
                        'cv.healthSource.connectors.NewRelic.metricFields.timestampJsonPath.recordsModalHeader'
                      )}
                      showExactJsonPath={true}
                    />
                    {formikValues?.queryType === QueryType.HOST_BASED ? (
                      <InputWithDynamicModalForJson
                        onChange={formikSetField}
                        fieldValue={formikValues?.serviceInstanceIdentifier}
                        isQueryExecuted={isQueryExecuted}
                        isDisabled={isSelectingJsonPathDisabled}
                        sampleRecord={sampleRecord}
                        inputName={NewRelicHealthSourceFieldNames.SERVICE_INSTANCE}
                        inputLabel={'Service Instance Identifier Json Path'}
                        noRecordModalHeader={getString(
                          'cv.healthSource.connectors.NewRelic.metricFields.serviceIdentifierJsonPath.noRecordModalHeader'
                        )}
                        noRecordInputLabel={getString(
                          'cv.healthSource.connectors.NewRelic.metricFields.serviceIdentifierJsonPath.noRecordInputLabel'
                        )}
                        recordsModalHeader={getString(
                          'cv.healthSource.connectors.NewRelic.metricFields.serviceIdentifierJsonPath.recordsModalHeader'
                        )}
                        showExactJsonPath={true}
                      />
                    ) : null}
                    <Button
                      intent="primary"
                      text={getString('cv.healthSource.connectors.buildChart')}
                      onClick={handleBuildChart}
                    />
                    <Container padding={{ top: 'small' }}>
                      <MetricLineChart loading={timeSeriesDataLoading} error={timeseriesDataError} options={options} />
                    </Container>
                  </>
                }
              />
              <Accordion.Panel
                id="riskProfile"
                summary={getString('cv.monitoringSources.assign')}
                details={
                  <>
                    <SelectHealthSourceServices
                      values={{
                        sli: !!formikValues?.sli,
                        healthScore: !!formikValues?.healthScore,
                        continuousVerification: !!formikValues?.continuousVerification
                      }}
                      metricPackResponse={metricPackResponse}
                      labelNamesResponse={labelNamesResponse}
                      hideServiceIdentifier={true}
                      hideCV={formikValues?.queryType === QueryType.SERVICE_BASED}
                      hideSLIAndHealthScore={formikValues?.queryType === QueryType.HOST_BASED}
                    />
                  </>
                }
              />
            </Accordion>
          </Container>
        </Container>
      }
    />
  )
}
