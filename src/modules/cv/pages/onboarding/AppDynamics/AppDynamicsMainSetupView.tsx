import React, { useState, useCallback, useMemo, useContext, useEffect } from 'react'
import {
  Container,
  FormInput,
  SelectOption,
  CollapseList,
  CollapseListPanel,
  FormikForm,
  SelectWithSubview,
  Select,
  ListPanelInterface
} from '@wings-software/uikit'
import TierAndServiceTable from './TierAndServiceTable/TierAndServiceTable'
import css from './AppDynamicsMainSetupView.module.scss'
import {
  ConfigureMetricPackProvider,
  ConfigureMetricPackContext
} from '../../../context/ConfigureMetricPackContext/ConfigureMetricPackContext'
import xhr from '@wings-software/xhr-async'
import {
  saveAppDConfig,
  CVConfigTableData,
  transformAppDynamicsApplications,
  createDefaultConfigObject,
  removeAppdConfig
} from './AppDynamicsOnboardingUtils'
import { FieldArray, FormikProps, Formik } from 'formik'
import { AppDynamicsService } from '../../../services'
import DataSourcePanelStatusHeader from '../../../components/DataSourcePanelStatusHeader/DataSourcePanelStatusHeader'
import { EnvironmentTypeSubForm } from 'modules/cv/components/EnvironmentSubForm/EnvironmentSubForm'
import { Page } from 'modules/common/exports'

// const connectorId = 'sugDKfxVSc--pkp6GcLFBA'
// const appId = '3ugZPVJ_SBCHb9sl5llxFQ'
const accountId = 'kmpySmUISimoRrJL6NL73w'
const connectorId = 'kP-xxUWrRhuhuFlKYNyMrQ'
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

interface AppDynamicsMainSetupViewProps {
  serviceOptions: SelectOption[]
  configs: CVConfigTableData[]
  selectedEntities: SelectOption[]
}

export async function fetchAppDApps(appAccountId: string, settingId: string): Promise<SelectOption[]> {
  const { status, error, response } = await AppDynamicsService.fetchAppDynamicsApplications({
    accountId: appAccountId,
    dataSourceId: settingId,
    xhrGroup: 'XHR_APPD_APPS_GROUP'
  })
  if (status === xhr.ABORTED || error) {
    return []
  }

  return transformAppDynamicsApplications(response?.resource || [])
}

function updateApplicationList(application: SelectOption, appList: SelectOption[], isRemove: boolean): SelectOption[] {
  if (!appList) {
    return []
  }

  const newList = [...appList]
  if (isRemove) {
    return newList.filter(({ label }) => label !== application.label)
  }
  newList.push(application)
  return newList.sort((a, b) => (a.label && b.label && a.label > b.label ? 1 : -1))
}

function generateAppDynamicsApplicationsToAdd(
  configs: CVConfigTableData[],
  appDApplications: Map<string, SelectOption>
): SelectOption[] | undefined {
  const alreadySelectedApplications = new Set<string>()
  for (const appdApps of configs) {
    if (appdApps.applicationName) {
      alreadySelectedApplications.add(appdApps.applicationName)
    } else if (appDApplications.has(appdApps.applicationId)) {
      alreadySelectedApplications.add(appDApplications.get(appdApps.applicationId)?.label || '')
    }
  }
  if (alreadySelectedApplications.size && appDApplications.size) {
    return Array.from(appDApplications.values()).filter(({ label }) => !alreadySelectedApplications.has(label))
  }
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
        <FormInput.CustomRender
          name={`appDConfigs[${index}].environmentType`}
          label="Environment Type"
          render={() => {
            const val = formikProps.values?.appDConfigs?.[index]?.envId
            return (
              <SelectWithSubview
                value={{ label: val, value: val }}
                changeViewButtonLabel="Environment +"
                items={[
                  { value: 'Production', label: 'prod' },
                  { value: 'Non-production', label: 'non-prod' }
                ]}
                subview={
                  <EnvironmentTypeSubForm
                    onSubmit={({ envType }) =>
                      formikProps.setFieldValue(`appDConfigs[${index}].environmentType`, envType)
                    }
                  />
                }
              />
            )
          }}
        />
        <FormInput.TagInput
          name={`appDConfigs[${index}].metricPackList`}
          label="Metric Packs"
          items={metricList}
          key={metricList?.[0]}
          itemFromNewTag={newTag => newTag}
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
  const [applicationsToAdd, setApplicationsToAdd] = useState<SelectOption[]>([{ label: 'Loading...', value: '' }])
  const [panelHeaderMsg, setPanelHeaderMsg] = useState<Map<string, { isError: boolean; msg: string }>>(new Map())

  useEffect(() => {
    const appList = generateAppDynamicsApplicationsToAdd(configList, appDApplications)
    if (appList?.length) {
      setApplicationsToAdd(appList)
    }
  }, [appDApplications, configList])

  return (
    <Container className={css.main}>
      <ConfigureMetricPackProvider dataSourceType="APP_DYNAMICS">
        <Formik initialValues={{ appDConfigs: configList }} enableReinitialize={true} onSubmit={() => undefined}>
          {(formikProps: FormikProps<{ appDConfigs: CVConfigTableData[] }>) => (
            <FormikForm>
              <FieldArray
                name="appDConfigs"
                render={arrayHelpers => (
                  <>
                    <Container width={200} className={css.applicationSelect}>
                      <Select
                        items={applicationsToAdd}
                        onChange={(selectedApp: SelectOption) => {
                          setApplicationsToAdd(updateApplicationList(selectedApp, applicationsToAdd, true))
                          arrayHelpers.unshift(
                            createDefaultConfigObject(
                              dataSourceId,
                              selectedApp.value as string,
                              accountId,
                              selectedApp.label
                            )
                          )
                        }}
                      />
                    </Container>
                    <CollapseList defaultOpenIndex={0}>
                      {
                        formikProps.values.appDConfigs?.map((configData: CVConfigTableData, index: number) => (
                          <CollapseListPanel
                            key={configData.uuid || index}
                            className={css.listPanelBody}
                            nextButtonText="Save"
                            onToggleOpen={() => {
                              return
                            }}
                            collapseHeaderProps={{
                              heading: (
                                <DataSourcePanelStatusHeader
                                  panelName={
                                    appDApplications.get(configData.applicationId)?.label ||
                                    configData.applicationName ||
                                    ''
                                  }
                                  isError={panelHeaderMsg.get(configData.applicationId)?.isError}
                                  message={panelHeaderMsg.get(configData.applicationId)?.msg}
                                />
                              ),
                              isRemovable: true,
                              onRemove: async () => {
                                const error = await removeAppdConfig(accountId, configData.uuid)
                                const newPanelHeaders = new Map(panelHeaderMsg)
                                if (!error) {
                                  arrayHelpers.remove(index)
                                  newPanelHeaders.delete(configData.applicationId)
                                  setPanelHeaderMsg(newPanelHeaders)
                                  setApplicationsToAdd(
                                    updateApplicationList(
                                      {
                                        label:
                                          configData.applicationName ||
                                          appDApplications.get(configData.applicationId)?.label ||
                                          '',
                                        value: configData.applicationId
                                      },
                                      applicationsToAdd,
                                      false
                                    )
                                  )
                                } else {
                                  newPanelHeaders.set(configData.applicationId, { isError: true, msg: error })
                                  setPanelHeaderMsg(newPanelHeaders)
                                }
                              }
                            }}
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
                                const newPanelHeaders = new Map(panelHeaderMsg)
                                newPanelHeaders.set(configData.applicationId, { msg: 'Success', isError: false })
                                if (error) {
                                  newPanelHeaders.set(configData.applicationId, { msg: error, isError: true })
                                }
                                setPanelHeaderMsg(newPanelHeaders)
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
                        )) as ListPanelInterface[]
                      }
                    </CollapseList>
                  </>
                )}
              />
            </FormikForm>
          )}
        </Formik>
      </ConfigureMetricPackProvider>
    </Container>
  )
}

export default function AppDynamicsMainSetupView(props: AppDynamicsMainSetupViewProps): JSX.Element {
  const [appDApplications, setAppDApplications] = useState<Map<string, SelectOption>>(new Map())
  const { configs, serviceOptions } = props

  useEffect(() => {
    fetchAppDApps(accountId, connectorId).then((appDApplicationsOptions: SelectOption[]) => {
      if (appDApplicationsOptions?.length) {
        const appIdToAppOption = new Map<string, SelectOption>()
        appDApplicationsOptions.forEach(option => {
          appIdToAppOption.set(option.value as string, option)
        })
        setAppDApplications(appIdToAppOption)
      }
    })
  }, [])

  return (
    <Page.Body>
      <AppDynamicsDataSourceForm
        configList={configs}
        serviceOptions={serviceOptions}
        dataSourceId={connectorId}
        appDApplications={appDApplications}
      />
    </Page.Body>
  )
}
