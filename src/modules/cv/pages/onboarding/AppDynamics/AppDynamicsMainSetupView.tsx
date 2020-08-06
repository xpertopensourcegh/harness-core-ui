import React, { useState, useCallback, useEffect } from 'react'
import {
  Container,
  FormInput,
  SelectOption,
  CollapseList,
  FormikForm,
  Select,
  Link,
  MultiSelectOption
} from '@wings-software/uikit'
import xhr from '@wings-software/xhr-async'
import { FieldArray, FormikProps, Formik } from 'formik'
import type { MetricPack, DSConfig } from '@wings-software/swagger-ts/definitions'
import type { IDBPDatabase } from 'idb'
import type { IconProps } from '@wings-software/uikit/dist/icons/Icon'
import { AppDynamicsService } from 'modules/cv/services'
import { CustomizeMetricPackDrawer } from 'modules/cv/components/CustomizeMetricPackDrawer/CustomizeMetricPackDrawer'
import { useMetricPackHook, fetchMetricPacks } from 'modules/cv/hooks/ConfigureMetricPackHook/ConfigureMetricPackHook'
import DataSourceConfigPanel from 'modules/cv/components/DataSourceConfigPanel/DataSourceConfigPanel'
import { routeParams } from 'framework/exports'
import OnBoardingConfigSetupHeader from 'modules/cv/components/OnBoardingConfigSetupHeader/OnBoardingConfigSetupHeader'
import { CVObjectStoreNames } from 'modules/cv/hooks/IndexedDBHook/IndexedDBHook'
import {
  DSConfigTableData,
  transformAppDynamicsApplications,
  createDefaultConfigObject,
  transformToSaveConfig
} from './AppDynamicsOnboardingUtils'
import TierAndServiceTable from './TierAndServiceTable/TierAndServiceTable'
import i18n from './AppDynamicsMainSetupView.i18n'
import css from './AppDynamicsMainSetupView.module.scss'

const XHR_METRIC_PACK_GROUP = 'XHR_METRIC_PACK_GROUP'
const SelectHTMLInputProps = { placeholder: 'Select an Application' }
const OnBoardingHeaderIconProps: IconProps = {
  name: 'service-appdynamics'
}

type PageData = { products: string[]; selectedEntities?: SelectOption[]; dataSourceId: string; isEdit?: boolean }

interface AppDynamicsDataSourceFormProps {
  configList: DSConfigTableData[]
  serviceOptions: SelectOption[]
  pageData: PageData
  dbInstance?: IDBPDatabase
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
  locationContext: PageData
  indexedDB?: IDBPDatabase
}

interface SaveToIndexedDBProps {
  pageData: PageData
  dbInstance?: IDBPDatabase
  configs: DSConfigTableData[]
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

async function loadAppDApplications(
  accountId: string,
  dataSourceId: string,
  dbInstance?: IDBPDatabase
): Promise<Map<string, SelectOption>> {
  let appDApplicationsOptions: SelectOption[] = await dbInstance?.get(CVObjectStoreNames.LIST_ENTITIES, dataSourceId)
  if (!appDApplicationsOptions?.length) {
    appDApplicationsOptions = await fetchAppDApps(accountId, dataSourceId)
  }

  const appNameToId = new Map<string, SelectOption>()

  if (appDApplicationsOptions?.length) {
    appDApplicationsOptions.forEach(option => {
      appNameToId.set(option.label, option)
    })
  }

  return appNameToId
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
          <Link
            withoutHref
            disabled={!config?.metricPacks?.length}
            onClick={() => setDisplayMetricPackDrawer(true)}
            className={css.customizePack}
          >
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

function SaveToIndexedDB(props: SaveToIndexedDBProps): JSX.Element {
  const { pageData, dbInstance, configs } = props
  useEffect(() => {
    window.onbeforeunload = () => {
      dbInstance?.put(CVObjectStoreNames.ONBOARDING_JOURNEY, {
        ...pageData,
        savedConfigs: configs
      })
    }
  }, [dbInstance?.put, configs, pageData])
  return <span />
}

function AppDynamicsDataSourceForm(props: AppDynamicsDataSourceFormProps): JSX.Element {
  const { configList, serviceOptions, appDApplications, metricPackMap, pageData, dbInstance } = props
  const productName = pageData?.products?.[0]
  const [applicationsToAdd, setApplicationsToAdd] = useState<SelectOption[]>([{ label: 'Loading...', value: '' }])
  const {
    params: { accountId }
  } = routeParams()
  const dataSourceId = pageData.dataSourceId

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
                  <Container className={css.applicationSelectContainer}>
                    <OnBoardingConfigSetupHeader iconProps={OnBoardingHeaderIconProps} pageHeading={i18n.pageHeading} />
                    <Select
                      items={applicationsToAdd}
                      className={css.applicationSelect}
                      inputProps={SelectHTMLInputProps}
                      onChange={(selectedApp: SelectOption) => {
                        setApplicationsToAdd(updateApplicationList(selectedApp, applicationsToAdd, true))
                        arrayHelpers.unshift(
                          createDefaultConfigObject(dataSourceId, accountId, selectedApp.label, productName)
                        )
                      }}
                    />
                  </Container>
                  <SaveToIndexedDB
                    pageData={pageData}
                    dbInstance={dbInstance}
                    configs={formikProps.values?.dsConfigs}
                  />
                  <CollapseList defaultOpenIndex={0}>
                    {formikProps.values.dsConfigs?.map((configData: DSConfigTableData, index: number) => (
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
                        validateConfig={validateConfig}
                        touched={formikProps.touched}
                        values={formikProps.values}
                        setFieldError={formikProps.setFieldError}
                        setFieldTouched={formikProps.setFieldTouched}
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
                    ))}
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
  const { configs, serviceOptions, locationContext, indexedDB } = props
  const {
    params: { accountId },
    query: { routeDataSourceId }
  } = routeParams()
  const dataSourceId = (routeDataSourceId as string) || locationContext.dataSourceId

  useEffect(() => {
    loadAppDApplications(accountId, dataSourceId, indexedDB).then(appToId => {
      setAppDApplications(appToId)
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
  }, [dataSourceId, accountId, indexedDB])

  return (
    <AppDynamicsDataSourceForm
      configList={configs}
      serviceOptions={serviceOptions}
      metricPackMap={metricPackMap}
      dbInstance={indexedDB}
      pageData={locationContext}
      appDApplications={appDApplications}
    />
  )
}
