import React, { useState, useCallback, useEffect } from 'react'
import {
  Container,
  FormInput,
  SelectOption,
  CollapseList,
  FormikForm,
  Select,
  Link,
  ListPanelInterface,
  MultiSelectOption
} from '@wings-software/uikit'
import TierAndServiceTable from './TierAndServiceTable/TierAndServiceTable'
import css from './AppDynamicsMainSetupView.module.scss'
import xhr from '@wings-software/xhr-async'
import {
  DSConfigTableData,
  transformAppDynamicsApplications,
  createDefaultConfigObject,
  transformToSaveConfig
} from './AppDynamicsOnboardingUtils'
import { FieldArray, FormikProps, Formik } from 'formik'
import { AppDynamicsService } from 'modules/cv/services'
import { CustomizeMetricPackDrawer } from 'modules/cv/components/CustomizeMetricPackDrawer/CustomizeMetricPackDrawer'
import { useMetricPackHook, fetchMetricPacks } from 'modules/cv/hooks/ConfigureMetricPackHook/ConfigureMetricPackHook'
import type { MetricPack, DSConfig } from '@wings-software/swagger-ts/definitions'
import DataSourceConfigPanel from 'modules/cv/components/DataSourceConfigPanel/DataSourceConfigPanel'
import { routeParams } from 'framework/exports'

const XHR_METRIC_PACK_GROUP = 'XHR_METRIC_PACK_GROUP'
const SelectHTMLInputProps = { placeholder: 'Select an Application' }

interface AppDynamicsDataSourceFormProps {
  configList: DSConfigTableData[]
  serviceOptions: SelectOption[]
  dataSourceId: string
  productName: string
  accountId: string
  metricPackMap: Map<string, MetricPack>
  appDApplications: Map<string, SelectOption>
}

interface AppDynamicsConfigProps {
  config: DSConfigTableData
  serviceOptions: SelectOption[]
  dataSourceId: string
  appdApplicationId: number
  index: number
  accountId: string
  metricPackMap: Map<string, MetricPack>
  formikProps: FormikProps<{ dsConfigs: DSConfigTableData[] }>
}

interface AppDynamicsMainSetupViewProps {
  serviceOptions: SelectOption[]
  configs: DSConfigTableData[]
  locationContext: { products: string[]; selectedEntities: SelectOption[]; dataSourceId: string; isEdit: boolean }
}

function validateConfig(configData: DSConfig): { [fieldName: string]: string } | {} {
  const castConfigData = configData as DSConfigTableData
  const errors: { envIdentifier?: string; metricPackList?: string; tableData?: string } = {}
  if (!castConfigData.envIdentifier) {
    errors.envIdentifier = 'Environment is required.'
  }
  if (!castConfigData.metricPackList?.length) {
    errors.metricPackList = 'At least one metric pack is required.'
  }

  const totalUnsuccessfulValidations =
    castConfigData.tableData?.filter(({ validation }) => validation === false).length || 0
  if (totalUnsuccessfulValidations > 0) {
    errors.tableData = 'Some validations returned unsuccessfully.'
  } else if (!castConfigData.tableData?.some(({ selected }) => selected)) {
    errors.tableData = 'At least one tier to service mapping is required.'
  }

  return errors
}

function validateAppDConfigs(appdConfigs: {
  dsConfigs: DSConfigTableData[]
}): { dsConfigs: [{ [fieldName: string]: string }] | {} } {
  return { dsConfigs: appdConfigs.dsConfigs?.map(config => validateConfig(config)) || [] }
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
  configs: DSConfigTableData[],
  appDApplications: Map<string, SelectOption>
): SelectOption[] | undefined {
  const alreadySelectedApplications = new Set<string>()
  for (const appdApps of configs) {
    if (appdApps.applicationName) {
      alreadySelectedApplications.add(appdApps.applicationName)
    }
  }
  if (alreadySelectedApplications.size && appDApplications.size) {
    return Array.from(appDApplications.values()).filter(({ label }) => !alreadySelectedApplications.has(label))
  }
}

function AppDynamicsConfig(props: AppDynamicsConfigProps): JSX.Element {
  const {
    config,
    serviceOptions,
    dataSourceId,
    index,
    formikProps,
    metricPackMap,
    appdApplicationId,
    accountId
  } = props
  const { metricList, setSelectedPacks } = useMetricPackHook(config.metricPacks || [], metricPackMap)
  const [displayMetricPackDrawer, setDisplayMetricPackDrawer] = useState(false)

  const onMetricPackChangeCallback = useCallback(
    (selectedPacks: MultiSelectOption[]) => {
      const thing = setSelectedPacks(selectedPacks?.map(({ value }) => value) as string[])
      formikProps.setFieldValue(`dsConfigs[${index}].metricPacks`, thing)
      formikProps.setFieldTouched(`dsConfigs[${index}].metricPacks`, true)
    },
    [index, formikProps, setSelectedPacks]
  )

  const onCloseMetricPackCallback = useCallback(
    (updatedPacks?: MetricPack[]) => {
      setDisplayMetricPackDrawer(false)
      if (updatedPacks) {
        formikProps.setFieldValue(`dsConfigs[${index}].metricPacks`, updatedPacks)
        formikProps.setFieldTouched(`dsConfigs[${index}].metricPacks`, true)
      }
    },
    [formikProps, index]
  )

  return (
    <Container className={css.formContainer}>
      <Container className={css.inputFields}>
        <FormInput.Select
          name={`dsConfigs[${index}].envIdentifier`}
          label="Environment"
          items={[
            { label: 'Production', value: 'production' },
            { label: 'Non-Production', value: 'nonProduction' }
          ]}
        />
        <Container className={css.metricPackContainer}>
          <Link withoutHref onClick={() => setDisplayMetricPackDrawer(true)} className={css.customizePack}>
            Customize
          </Link>
          <FormInput.MultiSelect
            name={`dsConfigs[${index}].metricPackList`}
            label="Metric Packs"
            items={metricList}
            key={JSON.stringify(metricList?.[0])}
            placeholder="Add a Metric Pack"
            onChange={onMetricPackChangeCallback}
          />
        </Container>
      </Container>
      <Container className={css.tableContainer}>
        <FormInput.CustomRender
          name={`dsConfigs[${index}].tableData`}
          render={() => (
            <TierAndServiceTable
              appId={appdApplicationId}
              metricPacks={config.metricPacks}
              index={index}
              data={config.tableData}
              setFieldTouched={formikProps.setFieldTouched}
              setFieldValue={formikProps.setFieldValue}
              accountId={accountId}
              serviceOptions={serviceOptions}
              dataSourceId={dataSourceId}
            />
          )}
        />
      </Container>
      {displayMetricPackDrawer ? (
        <CustomizeMetricPackDrawer
          isOpen={displayMetricPackDrawer}
          onClose={onCloseMetricPackCallback}
          selectedMetricPackObjects={config.metricPacks}
        />
      ) : undefined}
    </Container>
  )
}

function AppDynamicsDataSourceForm(props: AppDynamicsDataSourceFormProps): JSX.Element {
  const { configList, serviceOptions, dataSourceId, appDApplications, metricPackMap, productName, accountId } = props
  const [applicationsToAdd, setApplicationsToAdd] = useState<SelectOption[]>([{ label: 'Loading...', value: '' }])

  useEffect(() => {
    const appList = generateAppDynamicsApplicationsToAdd(configList, appDApplications)
    if (appList?.length) {
      setApplicationsToAdd(appList)
    }
  }, [appDApplications, configList])

  return (
    <Container className={css.main}>
      <Formik
        initialValues={{ dsConfigs: configList }}
        enableReinitialize={true}
        validateOnBlur={true}
        validate={validateAppDConfigs}
        onSubmit={() => undefined}
      >
        {(formikProps: FormikProps<{ dsConfigs: DSConfigTableData[] }>) => (
          <FormikForm>
            <FieldArray
              name="dsConfigs"
              render={arrayHelpers => (
                <>
                  <Container width={200} className={css.applicationSelect}>
                    <Select
                      items={applicationsToAdd}
                      inputProps={SelectHTMLInputProps}
                      onChange={(selectedApp: SelectOption) => {
                        setApplicationsToAdd(updateApplicationList(selectedApp, applicationsToAdd, true))
                        arrayHelpers.unshift(
                          createDefaultConfigObject(dataSourceId, accountId, selectedApp.label, productName)
                        )
                      }}
                    />
                  </Container>
                  <CollapseList defaultOpenIndex={0}>
                    {
                      formikProps.values.dsConfigs?.map((configData: DSConfigTableData, index: number) => (
                        <DataSourceConfigPanel
                          key={configData.applicationName}
                          entityName={configData.applicationName || ''}
                          onRemove={(configIndex: number) => {
                            arrayHelpers.remove(configIndex)
                            const newOption = appDApplications.get(configData.applicationName || '')
                            if (newOption) {
                              const updatedAppList = [...applicationsToAdd, newOption]
                              updatedAppList.sort((a, b) => (a?.label && b?.label && a.label > b.label ? 1 : -1))
                              setApplicationsToAdd(updatedAppList)
                            }
                          }}
                          index={index}
                          transformToSavePayload={transformToSaveConfig}
                          validate={validateConfig}
                        >
                          <AppDynamicsConfig
                            config={configData}
                            accountId={accountId}
                            index={index}
                            appdApplicationId={
                              (appDApplications.get(configData.applicationName || '')?.value as number) || -1
                            }
                            formikProps={formikProps}
                            serviceOptions={serviceOptions}
                            dataSourceId={dataSourceId}
                            metricPackMap={metricPackMap}
                          />
                        </DataSourceConfigPanel>
                      )) as ListPanelInterface[]
                    }
                  </CollapseList>
                </>
              )}
            />
          </FormikForm>
        )}
      </Formik>
    </Container>
  )
}

export default function AppDynamicsMainSetupView(props: AppDynamicsMainSetupViewProps): JSX.Element {
  const [appDApplications, setAppDApplications] = useState<Map<string, SelectOption>>(new Map())
  const [metricPackMap, setMetricPackMap] = useState<Map<string, MetricPack>>(new Map())
  const { configs, serviceOptions, locationContext } = props
  const {
    params: { accountId }
  } = routeParams()

  useEffect(() => {
    fetchAppDApps(accountId, locationContext.dataSourceId).then((appDApplicationsOptions: SelectOption[]) => {
      if (appDApplicationsOptions?.length) {
        const appNameToId = new Map<string, SelectOption>()
        appDApplicationsOptions.forEach(option => {
          appNameToId.set(option.label, option)
        })
        setAppDApplications(appNameToId)
      }
    })
    fetchMetricPacks({
      accountId,
      projectId: '12345',
      dataSourceType: 'APP_DYNAMICS',
      group: XHR_METRIC_PACK_GROUP
    }).then(({ error, metricPackMap: metricPacks }) => {
      if (error) {
        return
      } else if (metricPacks) {
        setMetricPackMap(metricPacks)
      }
    })
    return () => {
      xhr.abort(XHR_METRIC_PACK_GROUP)
    }
  }, [locationContext.dataSourceId, accountId])

  return (
    <AppDynamicsDataSourceForm
      configList={configs}
      serviceOptions={serviceOptions}
      dataSourceId={locationContext.dataSourceId}
      accountId={accountId}
      metricPackMap={metricPackMap}
      productName={locationContext.products?.[0]}
      appDApplications={appDApplications}
    />
  )
}
