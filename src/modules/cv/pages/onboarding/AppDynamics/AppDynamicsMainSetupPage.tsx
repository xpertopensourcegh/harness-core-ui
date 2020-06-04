import React, { useState, useCallback, useMemo, useContext, useEffect } from 'react'
import {
  Container,
  Layout,
  Formik,
  FormikForm,
  FormInput,
  SelectOption,
  CollapseList,
  CollapseListPanel
} from '@wings-software/uikit'
import TierAndServiceTable from './TierAndServiceTable/TierAndServiceTable'
import DataSourcePageHeader from '../../../components/DataSourcePageHeader/DataSourcePageHeader'
import css from './AppDynamicsDataSourcePage.module.scss'
import {
  ConfigureMetricPackProvider,
  ConfigureMetricPackContext
} from '../../../context/ConfigureMetricPackContext/ConfigureMetricPackContext'
import xhr from '@wings-software/xhr-async'
import { transformGetConfigs, saveAppDConfig } from './AppDynamicsOnboardingUtils'
import { FieldArray } from 'formik'
import { SettingsService } from '../../services'
import DataSourcePanelStatusHeader from '../../../components/DataSourcePanelStatusHeader/DataSourcePanelStatusHeader'
import type { Service } from '@wings-software/swagger-ts/definitions'
import { VerificationTypes } from '../../../constants'

const XHR_SERVICES_GROUP = 'XHR_SERVICES_GROUP'

const connectorId = 'sugDKfxVSc--pkp6GcLFBA'
const appId = '3ugZPVJ_SBCHb9sl5llxFQ'
const accountId = 'kmpySmUISimoRrJL6NL73w'
// const connectorId = 'kP-xxUWrRhuhuFlKYNyMrQ'
// const appId = 'ogVkjRvETFOG4-2e_kYPQA'

async function fetchServices(localAppId: string): Promise<SelectOption[] | undefined> {
  const { status, error, services = [] } = await SettingsService.fetchServices(localAppId, XHR_SERVICES_GROUP)
  if (status === xhr.ABORTED || error) {
    return
  }
  if (services?.length) {
    return services.map((service: Service) => ({ label: service.name, value: service.uuid }))
  }
  return []
}

function AppDynamicsConfig(props): JSX.Element {
  const { config, serviceOptions, dataSourceId, index, setFieldValue } = props
  const { getMetricObject, metricList, isLoading: isLoadingMetricPacks } = useContext(ConfigureMetricPackContext)
  const [selectedMetricPacks, setSelectedPacks] = useState(config.metricPackList || [])
  const tagInputProps = useMemo(
    () => ({
      fill: true,
      placeholder: 'Add a metric pack',
      allowNewTag: false,
      selectedItems: isLoadingMetricPacks ? ['Loading...'] : selectedMetricPacks,
      showClearAllButton: true
    }),
    [isLoadingMetricPacks, selectedMetricPacks]
  )
  const metricPackObjs = useMemo(() => selectedMetricPacks.map(pack => getMetricObject(pack)), [
    getMetricObject,
    selectedMetricPacks
  ])
  const onMetricPackChangeCallback = useCallback(
    selectedPacks => {
      setSelectedPacks(selectedPacks as string[])
      setFieldValue(`appDConfigs[${index}].metricPacks`, selectedPacks?.map(pack => getMetricObject(pack)) || [])
    },
    [getMetricObject, index, setFieldValue]
  )

  return (
    <Layout.Horizontal>
      <Container className={css.inputFields}>
        <FormInput.Select name={`appDConfigs[${index}].environmentType`} label="Environment Type" items={[]} />
        <FormInput.TagInput
          name={`appDConfigs[${index}].metricPackList`}
          label="Metric Packs"
          items={metricList}
          labelFor={name => name}
          tagInputProps={tagInputProps}
          onChange={onMetricPackChangeCallback}
        />
      </Container>
      <Container className={css.tableContainer}>
        <FormInput.CustomRender
          name={`appDConfigs[${index}].tableData`}
          label=""
          render={formik => (
            <TierAndServiceTable
              appId={config?.applicationId}
              metricPacks={metricPackObjs}
              index={index}
              data={formik.values?.appDConfigs?.[index]?.tableData}
              onChange={formik.setFieldValue}
              accountId={accountId}
              serviceOptions={serviceOptions}
              dataSourceId={dataSourceId}
            />
          )}
        />
      </Container>
    </Layout.Horizontal>
  )
}

function AppDynamicsDataSourceForm(props) {
  const { configList, serviceOptions, dataSourceId, appDApplications } = props
  const [panelHeaderMsg, setPanelHeaderMsg] = useState<Array<{ isError: boolean; msg: string }>>([])
  return (
    <Container>
      <DataSourcePageHeader
        iconName="service-appdynamics"
        iconSubText="App Dynamics"
        pageHeading="Map your app and tiers to a Harness service and environment"
      />
      <ConfigureMetricPackProvider dataSourceType={VerificationTypes.APP_DYNAMICS}>
        <Formik
          initialValues={{ appDConfigs: configList }}
          enableReinitialize={true}
          onSubmit={function () {}}
          render={formikProps => {
            return (
              <FormikForm>
                <FieldArray
                  name="appDConfigs"
                  render={arrayHelpers => (
                    <CollapseList defaultOpenIndex={0}>
                      {formikProps.values.appDConfigs?.map((configData, index) => (
                        <CollapseListPanel
                          key={configData.uuid || index}
                          heading={
                            <DataSourcePanelStatusHeader
                              panelName={appDApplications.get(configData.applicationId)?.label}
                              isError={panelHeaderMsg[index]?.isError}
                              message={panelHeaderMsg[index]?.msg}
                            />
                          }
                          onToggleOpen={NO_OP}
                          isRemovable={true}
                          openNext={async () => {
                            const errors = await formikProps.validate?.(configData)
                            if (!Object.keys(errors || {}).length) {
                              const { error, configsToShow } = await saveAppDConfig(configData, configData.accountId)
                              const configs = [...formikProps.values.appDConfigs]
                              if (!configsToShow) {
                                arrayHelpers.remove(index)
                                return
                              }
                              configs[index] = configsToShow
                              formikProps.setFieldValue('appDConfigs', configs)
                              const panelMessages = [...panelHeaderMsg]
                              panelMessages[index] = { msg: 'Success', isError: false }
                              if (error) {
                                panelMessages[index].msg = error
                                panelMessages[index].isError = true
                              }
                              setPanelHeaderMsg(panelMessages)
                            }
                          }}
                        >
                          <AppDynamicsConfig
                            key={configData.applicationId}
                            config={configData}
                            index={index}
                            setFieldValue={formikProps.setFieldValue}
                            arrayHelpers={arrayHelpers}
                            serviceOptions={serviceOptions}
                            dataSourceId={dataSourceId}
                          />
                        </CollapseListPanel>
                      ))}
                    </CollapseList>
                  )}
                />
              </FormikForm>
            )
          }}
        />
      </ConfigureMetricPackProvider>
    </Container>
  )
}

export default function AppDynamicsDataSourcePage(): JSX.Element {
  const [data, setData] = useState<any>([])
  const [appDApplications, setAppDApplications] = useState<Map<string, SelectOption>>(new Map())
  const [serviceOptions, setServices] = useState<SelectOption[]>([{ value: '', label: 'Loading...' }])

  // const onAppSelectCallback = useCallback(
  //   (item: SelectOption) => {
  //     Promise.all([
  //       VerificationService.fetchConfigs({
  //         accountId: params.accountId,
  //         dataSourceConnectorId: connectorId
  //       }),
  //       fetchAppDApps(params.accountId, connectorId)
  //     ]).then(results => {
  //       if (results[0].status === xhr.ABORTED) {
  //         return
  //       } else if (results[0].error) {
  //       } else if (results?.[0]?.configs) {
  //         const transformedConfigs = transformGetConfigs(results[0].configs)
  //         if (transformedConfigs) {
  //           setData(transformedConfigs)
  //         }
  //       }

  //       if (results[1]?.length) {
  //         const appIdToAppOption = new Map<string, SelectOption>()
  //         results[1].forEach(option => {
  //           appIdToAppOption.set(option.value as string, option)
  //         })
  //         setAppDApplications(appIdToAppOption)
  //         if (!results[0]?.configs?.length) {
  //           setData([createDefaultConfigObject(connectorId, item.value as string, params.accountId, item.label)])
  //         }
  //       }
  //     })
  //   },
  //   [params.accountId]
  // )
  useEffect(() => {
    fetchServices(appId).then(services => {
      setServices(services?.length ? services : [])
    })
  }, [])

  return (
    <Container>
      <AppDynamicsDataSourceForm
        configList={data}
        serviceOptions={serviceOptions}
        dataSourceId={connectorId}
        appDApplications={appDApplications}
      />
    </Container>
  )
}
