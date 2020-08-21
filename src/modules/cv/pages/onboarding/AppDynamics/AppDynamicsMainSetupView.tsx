import React, { useState, useCallback, useEffect } from 'react'
import {
  Container,
  FormInput,
  SelectOption,
  CollapseList,
  FormikForm,
  Select,
  Link,
  MultiSelectOption,
  SelectWithSubview,
  SelectProps
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
import TierAndServiceTable, { TierAndServiceRow, DEFAULT_ROW_OBJ } from './TierAndServiceTable/TierAndServiceTable'
import i18n from './AppDynamicsMainSetupView.i18n'
import CreateNewEntitySubform from '../CreateNewEntitySubform/CreateNewEntitySubform'
import { PageData, SaveConfigToIndexedDB } from '../SaveConfigToIndexedDB/SaveConfigToIndexedDB'
import css from './AppDynamicsMainSetupView.module.scss'

const XHR_METRIC_PACK_GROUP = 'XHR_METRIC_PACK_GROUP'
const SelectHTMLInputProps = { placeholder: i18n.addApplicationSelectPlaceholder }
const OnBoardingHeaderIconProps: IconProps = {
  name: 'service-appdynamics'
}

interface AppDynamicsDataSourceFormProps {
  configList: DSConfigTableData[]
  serviceOptions: SelectOption[]
  envOptions: SelectOption[]
  pageData: PageData
  projectId: string
  orgId: string
  dbInstance?: IDBPDatabase
  metricPackMap: Map<string, MetricPack>
  appDApplications: Map<string, SelectOption>
}

interface AppDynamicsConfigProps {
  config: DSConfigTableData
  serviceOptions: SelectOption[]
  envOptions: SelectOption[]
  dataSourceId: string
  appdApplicationId: number
  index: number
  projectId: string
  orgId: string
  accountId: string
  metricPackMap: Map<string, MetricPack>
  formikProps: FormikProps<{ dsConfigs: DSConfigTableData[] }>
}

interface AppDynamicsMainSetupViewProps {
  serviceOptions: SelectOption[]
  envOptions: SelectOption[]
  configs: DSConfigTableData[]
  locationContext: PageData
  indexedDB?: IDBPDatabase
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
  } else if (!castConfigData.tableData?.some(({ tierOption }) => Boolean(tierOption))) {
    errors.tableData = 'At least one tier to service mapping is required.'
  } else if (
    !castConfigData.tableData?.every(({ serviceName, tierOption }) =>
      !serviceName ? true : Boolean(tierOption?.value && tierOption?.label)
    )
  ) {
    errors.tableData = 'Please match each selected service to a tier.'
  }
  return errors
}

function validateAppDConfigs(appdConfigs: {
  dsConfigs: DSConfigTableData[]
}): { dsConfigs: [{ [fieldName: string]: string }] | {} } {
  return { dsConfigs: appdConfigs.dsConfigs?.map(config => validateConfig(config)) || [] }
}

export async function fetchAppDApps(
  appAccountId: string,
  settingId: string,
  orgId: string,
  projectId: string
): Promise<SelectOption[]> {
  const { status, error, response } = await AppDynamicsService.fetchAppDynamicsApplications({
    accountId: appAccountId,
    dataSourceId: settingId,
    orgId,
    projectId,
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
  orgId: string,
  projectId: string,
  dbInstance?: IDBPDatabase
): Promise<Map<string, SelectOption>> {
  const cachedEntities: { entityOptions: SelectOption[] } = await dbInstance?.get(
    CVObjectStoreNames.LIST_ENTITIES,
    dataSourceId
  )
  let appDApplicationsOptions: SelectOption[] = cachedEntities.entityOptions
  if (!appDApplicationsOptions?.length) {
    appDApplicationsOptions = await fetchAppDApps(accountId, dataSourceId, orgId, projectId)
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
    envOptions,
    dataSourceId,
    index,
    formikProps,
    metricPackMap,
    appdApplicationId,
    accountId,
    projectId,
    orgId
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
        <FormInput.CustomRender
          name={`dsConfigs[${index}].envIdentifier`}
          label="Environment"
          render={() => (
            <SelectWithSubview
              changeViewButtonLabel={i18n.createNew}
              items={envOptions}
              value={envOptions?.find(envOption => envOption?.value === config.envIdentifier)}
              key={envOptions[0]?.value as string}
              subview={<CreateNewEntitySubform entityType="environment" />}
              onChange={newEnv => {
                formikProps.setFieldValue(`dsConfigs[${index}].envIdentifier`, newEnv.value)
                formikProps.setFieldTouched(`dsConfigs[${index}].envIdentifier`, true)
              }}
            />
          )}
        />
        <FormInput.MultiSelect
          name={`dsConfigs[${index}].services`}
          label="Services"
          items={serviceOptions}
          key={serviceOptions[0]?.value as string}
          placeholder="Select a service"
          onChange={(items: MultiSelectOption[]) => {
            const newTableData: TierAndServiceRow[] = []
            for (const item of items) {
              const existingTableData = config.tableData?.find(td => td.serviceName === item.label)
              if (!existingTableData) {
                newTableData.push({ ...DEFAULT_ROW_OBJ, serviceName: item.label })
              } else {
                newTableData.push(existingTableData)
              }
            }
            formikProps.setFieldValue(`dsConfigs[${index}].tableData`, !items.length ? [] : newTableData)
          }}
        />
        <Container className={css.metricPackContainer}>
          <Link
            withoutHref
            disabled={!config.metricPacks?.length}
            onClick={() => setDisplayMetricPackDrawer(true)}
            className={css.customizePack}
          >
            {i18n.customizeMetricPacksButtonText}
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
              projectId={projectId}
              orgId={orgId}
              data={config.tableData}
              setFieldTouched={formikProps.setFieldTouched}
              setFieldValue={formikProps.setFieldValue}
              accountId={accountId}
              isLoadingServices={serviceOptions?.[0]?.label === i18n.loadingText}
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
  const {
    configList,
    serviceOptions,
    envOptions,
    appDApplications,
    metricPackMap,
    projectId,
    orgId,
    pageData,
    dbInstance
  } = props
  const productName = pageData?.products?.[0]
  const [applicationsToAdd, setApplicationsToAdd] = useState<SelectOption[]>([{ label: i18n.loadingText, value: '' }])
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
                      size={'small' as SelectProps['size']}
                      className={css.applicationSelect}
                      inputProps={SelectHTMLInputProps}
                      onChange={(selectedApp: SelectOption) => {
                        setApplicationsToAdd(updateApplicationList(selectedApp, applicationsToAdd, true))
                        arrayHelpers.unshift(
                          createDefaultConfigObject(dataSourceId, accountId, selectedApp.label, productName, projectId)
                        )
                      }}
                    />
                  </Container>
                  <SaveConfigToIndexedDB
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
                        orgId={orgId}
                        values={formikProps.values}
                        setFieldError={formikProps.setFieldError}
                        setFieldTouched={formikProps.setFieldTouched}
                      >
                        <AppDynamicsConfig
                          config={configData || {}}
                          accountId={accountId}
                          index={index}
                          appdApplicationId={
                            (appDApplications.get(configData.applicationName || '')?.value as number) || -1
                          }
                          projectId={projectId}
                          orgId={orgId}
                          formikProps={formikProps}
                          serviceOptions={serviceOptions}
                          envOptions={envOptions}
                          dataSourceId={dataSourceId}
                          metricPackMap={metricPackMap}
                        />
                      </DataSourceConfigPanel>
                    ))}
                  </CollapseList>
                </>
              )}
            />
            {/* <Container className={css.actionButtons}>
              <Button large intent="primary" text={i18n.nextButtonText} width={100} type="button" />
            </Container> */}
          </FormikForm>
        )}
      </Formik>
    </Container>
  )
}

export default function AppDynamicsMainSetupView(props: AppDynamicsMainSetupViewProps): JSX.Element {
  const [appDApplications, setAppDApplications] = useState<Map<string, SelectOption>>(new Map())
  const [metricPackMap, setMetricPackMap] = useState<Map<string, MetricPack>>(new Map())
  const { configs, serviceOptions, envOptions, locationContext, indexedDB } = props
  const {
    params: { accountId, projectIdentifier: routeProjectId, orgId: routeOrgId },
    query: { dataSourceId: routeDataSourceId }
  } = routeParams()
  const dataSourceId = (routeDataSourceId as string) || locationContext.dataSourceId
  const projectId = routeProjectId as string
  const orgId = routeOrgId as string

  useEffect(() => {
    loadAppDApplications(accountId, dataSourceId, orgId, projectId, indexedDB).then(appToId => {
      setAppDApplications(appToId)
    })

    fetchMetricPacks({
      accountId,
      projectId,
      orgId,
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
  }, [dataSourceId, accountId, indexedDB, projectId, orgId])

  return (
    <AppDynamicsDataSourceForm
      configList={configs}
      serviceOptions={serviceOptions}
      envOptions={envOptions}
      metricPackMap={metricPackMap}
      dbInstance={indexedDB}
      pageData={locationContext}
      projectId={projectId}
      orgId={orgId}
      appDApplications={appDApplications}
    />
  )
}
