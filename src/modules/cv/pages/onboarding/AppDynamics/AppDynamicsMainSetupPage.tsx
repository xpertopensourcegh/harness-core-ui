import React, { useState, useCallback, useMemo, useContext, useEffect } from 'react'
import {
  Container,
  FormInput,
  SelectOption,
  CollapseList,
  CollapseListPanel,
  FormikForm,
  SelectWithSubview
} from '@wings-software/uikit'
import TierAndServiceTable from './TierAndServiceTable/TierAndServiceTable'
import OnBoardingConfigSetupHeader from '../../../components/OnBoardingConfigSetupHeader/OnBoardingConfigSetupHeader'
import css from './AppDynamicsMainSetupPage.module.scss'
import {
  ConfigureMetricPackProvider,
  ConfigureMetricPackContext
} from '../../../context/ConfigureMetricPackContext/ConfigureMetricPackContext'
import xhr from '@wings-software/xhr-async'
import {
  transformGetConfigs,
  saveAppDConfig,
  CVConfigTableData,
  transformAppDynamicsApplications,
  AppDynamicsCVConfig
} from './AppDynamicsOnboardingUtils'
import { FieldArray, FormikProps, Formik } from 'formik'
import { SettingsService, AppDynamicsService } from '../../../services'
import DataSourcePanelStatusHeader from '../../../components/DataSourcePanelStatusHeader/DataSourcePanelStatusHeader'
import type { Service } from '@wings-software/swagger-ts/definitions'
import { VerificationTypes } from '../../../constants'
import { CVNextGenCVConfigService } from '../../../services'

const XHR_SERVICES_GROUP = 'XHR_SERVICES_GROUP'

const connectorId = 'sugDKfxVSc--pkp6GcLFBA'
const appId = '3ugZPVJ_SBCHb9sl5llxFQ'
const accountId = 'kmpySmUISimoRrJL6NL73w'
// const connectorId = 'kP-xxUWrRhuhuFlKYNyMrQ'
// const appId = 'ogVkjRvETFOG4-2e_kYPQA'

interface AppDynamicsDataSourceFormProps {
  configList: CVConfigTableData[]
  serviceOptions: SelectOption[]
  dataSourceId: string
  appDApplications: Map<string, SelectOption>
}

interface AppDynamicsConfigProps {
  config: CVConfigTableData
  serviceOptions: SelectOption[]
  dataSourceId: string
  index: number
  formikProps: FormikProps<{ appDConfigs: CVConfigTableData[] }>
}

async function fetchServices(localAppId: string): Promise<SelectOption[] | undefined> {
  const { status, error, response } = await SettingsService.fetchServices(localAppId, XHR_SERVICES_GROUP)
  if (status === xhr.ABORTED || error) {
    return
  }
  if (response?.resource) {
    return response.resource.response.map((service: Service) => ({ label: service.name || '', value: service.uuid }))
  }
  return []
}

export async function fetchAppDApps(accountId: string, settingId: string): Promise<SelectOption[]> {
  const { status, error, response } = await AppDynamicsService.fetchAppDynamicsApplications({
    accountId,
    dataSourceId: settingId,
    xhrGroup: 'XHR_APPD_APPS_GROUP'
  })
  if (status === xhr.ABORTED || error) {
    return []
  }

  return transformAppDynamicsApplications(response?.resource || [])
}

function AppDynamicsConfig(props: AppDynamicsConfigProps): JSX.Element {
  const { config, serviceOptions, dataSourceId, index, formikProps } = props
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
      formikProps.setFieldValue(
        `appDConfigs[${index}].metricPacks`,
        selectedPacks?.map((pack: string) => getMetricObject(pack)) || []
      )
    },
    [getMetricObject, index, formikProps]
  )

  return (
    <Container className={css.formContainer}>
      <Container className={css.inputFields}>
        <FormInput.Select name={`appDConfigs[${index}].environmentType`} label="Environment Type" items={[]} />
        <FormInput.TagInput
          name={`appDConfigs[${index}].metricPackList`}
          label="Metric Packs"
          items={metricList}
          itemFromNewTag={() => null}
          labelFor={name => name as string}
          tagInputProps={tagInputProps}
          onChange={onMetricPackChangeCallback}
        />
      </Container>
      <Container className={css.tableContainer}>
        <TierAndServiceTable
          appId={config?.applicationId}
          metricPacks={metricPackObjs}
          index={index}
          data={formikProps.values?.appDConfigs?.[index]?.tableData}
          onChange={formikProps.setFieldValue}
          accountId={accountId}
          serviceOptions={serviceOptions}
          dataSourceId={dataSourceId}
        />
      </Container>
    </Container>
  )
}

function AppDynamicsDataSourceForm(props: AppDynamicsDataSourceFormProps): JSX.Element {
  const { configList, serviceOptions, dataSourceId, appDApplications } = props
  const [panelHeaderMsg, setPanelHeaderMsg] = useState<Array<{ isError: boolean; msg: string }>>([])
  return (
    <Container className={css.main}>
      <OnBoardingConfigSetupHeader
        iconName="service-appdynamics"
        iconSubText="App Dynamics"
        pageHeading="Map your app and tiers to a Harness service and environment"
      />
      <ConfigureMetricPackProvider dataSourceType={VerificationTypes.APP_DYNAMICS}>
        <Formik initialValues={{ appDConfigs: configList }} enableReinitialize={true} onSubmit={() => undefined}>
          {(formikProps: FormikProps<{ appDConfigs: CVConfigTableData[] }>) => (
            <FormikForm>
              <FieldArray
                name="appDConfigs"
                render={arrayHelpers => (
                  <CollapseList defaultOpenIndex={0}>
                    {formikProps.values.appDConfigs?.map((configData: CVConfigTableData, index: number) => (
                      <CollapseListPanel
                        key={configData.uuid || index}
                        heading={
                          <DataSourcePanelStatusHeader
                            panelName={appDApplications.get(configData.applicationId)?.label || ''}
                            isError={panelHeaderMsg[index]?.isError}
                            message={panelHeaderMsg[index]?.msg}
                          />
                        }
                        onToggleOpen={() => null}
                        isRemovable={true}
                        openNext={async () => {
                          const errors = await formikProps.validateForm?.(configData)
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
                          formikProps={formikProps}
                          serviceOptions={serviceOptions}
                          dataSourceId={dataSourceId}
                        />
                      </CollapseListPanel>
                    ))}
                  </CollapseList>
                )}
              />
            </FormikForm>
          )}
        </Formik>
      </ConfigureMetricPackProvider>
    </Container>
  )
}

export default function AppDynamicsDataSourcePage(): JSX.Element {
  const [data, setData] = useState<CVConfigTableData[]>([])
  const [appDApplications, setAppDApplications] = useState<Map<string, SelectOption>>(new Map())
  const [serviceOptions, setServices] = useState<SelectOption[]>([{ value: '', label: 'Loading...' }])

  useEffect(() => {
    Promise.all([
      CVNextGenCVConfigService.fetchConfigs({
        accountId,
        dataSourceConnectorId: connectorId
      }),
      fetchAppDApps(accountId, connectorId)
    ]).then(results => {
      if (results[0].status === xhr.ABORTED) {
        return
      } else if (results[0].error) {
        return // TODO
      } else if (results?.[0]?.response?.resource) {
        const transformedConfigs = transformGetConfigs(results[0].response.resource as AppDynamicsCVConfig[])
        if (transformedConfigs) {
          setData(transformedConfigs)
        }
      }

      if (results[1]?.length) {
        const appIdToAppOption = new Map<string, SelectOption>()
        results[1].forEach(option => {
          appIdToAppOption.set(option.value as string, option)
        })
        setAppDApplications(appIdToAppOption)
        // if (!results[0]?.configs?.length) {
        //   setData([createDefaultConfigObject(connectorId, item.value as string, params.accountId, item.label)])
        // }
      }
    })
  }, [])
  useEffect(() => {
    fetchServices(appId).then(services => {
      setServices(services?.length ? services : [])
    })
  }, [])

  return (
    <AppDynamicsDataSourceForm
      configList={data}
      serviceOptions={serviceOptions}
      dataSourceId={connectorId}
      appDApplications={appDApplications}
    />
  )
}
