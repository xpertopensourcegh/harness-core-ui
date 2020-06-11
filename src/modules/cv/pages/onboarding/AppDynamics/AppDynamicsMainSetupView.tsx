import React, { useState, useCallback, useMemo, useEffect } from 'react'
import {
  Container,
  FormInput,
  SelectOption,
  CollapseList,
  CollapseListPanel,
  FormikForm,
  Select,
  Link
} from '@wings-software/uikit'
import TierAndServiceTable from './TierAndServiceTable/TierAndServiceTable'
import css from './AppDynamicsMainSetupView.module.scss'
import xhr from '@wings-software/xhr-async'
import {
  saveAppDConfig,
  CVConfigTableData,
  transformAppDynamicsApplications,
  createDefaultConfigObject,
  removeAppdConfig
} from './AppDynamicsOnboardingUtils'
import { FieldArray, FormikProps, Formik } from 'formik'
import { AppDynamicsService } from 'modules/cv/services'
import DataSourcePanelStatusHeader from 'modules/cv/components/DataSourcePanelStatusHeader/DataSourcePanelStatusHeader'
import { Page } from 'modules/common/exports'
import { CustomizeMetricPackDrawer } from 'modules/cv/components/CustomizeMetricPackDrawer/CustomizeMetricPackDrawer'
import { useMetricPackHook, fetchMetricPacks } from 'modules/cv/hooks/ConfigureMetricPackHook/ConfigureMetricPackHook'
import type { MetricPack } from '@wings-software/swagger-ts/definitions'
import { accountId, connectorId } from 'modules/cv/constants'

const XHR_METRIC_PACK_GROUP = 'XHR_METRIC_PACK_GROUP'

interface AppDynamicsDataSourceFormProps {
  configList: CVConfigTableData[]
  serviceOptions: SelectOption[]
  dataSourceId: string
  productName: string
  metricPackMap: Map<string, MetricPack>
  appDApplications: Map<string, SelectOption>
}

interface AppDynamicsConfigProps {
  config: CVConfigTableData
  serviceOptions: SelectOption[]
  dataSourceId: string
  index: number
  metricPackMap: Map<string, MetricPack>
  formikProps: FormikProps<{ appDConfigs: CVConfigTableData[] }>
}

interface AppDynamicsMainSetupViewProps {
  serviceOptions: SelectOption[]
  configs: CVConfigTableData[]
  locationContext: { products: string[]; selectedEntities: SelectOption[]; dataSourceId: string; isEdit: boolean }
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
    }
  }
  if (alreadySelectedApplications.size && appDApplications.size) {
    return Array.from(appDApplications.values()).filter(({ label }) => !alreadySelectedApplications.has(label))
  }
}

function AppDynamicsConfig(props: AppDynamicsConfigProps): JSX.Element {
  const { config, serviceOptions, dataSourceId, index, formikProps, metricPackMap } = props
  const { metricList, setSelectedPacks } = useMetricPackHook(config.metricPacks || [], metricPackMap)
  const [displayMetricPackDrawer, setDisplayMetricPackDrawer] = useState(false)
  const tagInputProps = useMemo(
    () => ({
      fill: true,
      placeholder: 'Add a metric pack',
      allowNewTag: false,
      showClearAllButton: true
    }),
    []
  )

  const onMetricPackChangeCallback = useCallback(
    selectedPacks => {
      const thing = setSelectedPacks(selectedPacks as string[])
      formikProps.setFieldValue(`appDConfigs[${index}].metricPacks`, thing)
    },
    [index, formikProps, setSelectedPacks]
  )

  const onCloseMetricPackCallback = useCallback(
    (updatedPacks?: MetricPack[]) => {
      setDisplayMetricPackDrawer(false)
      if (updatedPacks) {
        formikProps.setFieldValue(`appDConfigs[${index}].metricPacks`, updatedPacks)
      }
    },
    [formikProps, index]
  )

  return (
    <Container className={css.formContainer}>
      <Container className={css.inputFields}>
        <FormInput.Select
          name={`appDConfigs[${index}].envIdentifier`}
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
          <FormInput.TagInput
            name={`appDConfigs[${index}].metricPackList`}
            label="Metric Packs"
            items={metricList}
            key={JSON.stringify(metricList?.[0])}
            itemFromNewTag={newTag => newTag}
            labelFor={name => name as string}
            tagInputProps={tagInputProps}
            onChange={onMetricPackChangeCallback}
          />
        </Container>
      </Container>
      <Container className={css.tableContainer}>
        <TierAndServiceTable
          appId={config?.applicationId || ''}
          metricPacks={formikProps.values?.appDConfigs?.[index]?.metricPacks as any}
          index={index}
          data={formikProps.values?.appDConfigs?.[index]?.tableData}
          onChange={formikProps.setFieldValue}
          accountId={accountId}
          serviceOptions={serviceOptions}
          dataSourceId={dataSourceId}
        />
      </Container>
      {displayMetricPackDrawer ? (
        <CustomizeMetricPackDrawer
          isOpen={displayMetricPackDrawer}
          onClose={onCloseMetricPackCallback}
          selectedMetricPackObjects={formikProps.values?.appDConfigs?.[index]?.metricPacks as any}
        />
      ) : undefined}
    </Container>
  )
}

function AppDynamicsDataSourceForm(props: AppDynamicsDataSourceFormProps): JSX.Element {
  const { configList, serviceOptions, dataSourceId, appDApplications, metricPackMap, productName } = props
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
                            accountId,
                            selectedApp.label,
                            selectedApp.value as number,
                            productName
                          )
                        )
                      }}
                    />
                  </Container>
                  <CollapseList defaultOpenIndex={0}>
                    {formikProps.values.appDConfigs?.map((configData: CVConfigTableData, index: number) => (
                      <CollapseListPanel
                        key={configData.applicationName || index}
                        className={css.listPanelBody}
                        nextButtonText="Save"
                        heading={
                          <DataSourcePanelStatusHeader
                            panelName={configData.applicationName || ''}
                            isError={panelHeaderMsg.get(configData.applicationName || '')?.isError}
                            message={panelHeaderMsg.get(configData.applicationName || '')?.msg}
                          />
                        }
                        onToggleOpen={() => null}
                        isRemovable={true}
                        onRemove={async () => {
                          const error = await removeAppdConfig(accountId, configData.uuid)
                          const appName = configData.applicationName || ''
                          const newPanelHeaders = new Map(panelHeaderMsg)
                          if (!error) {
                            arrayHelpers.remove(index)
                            newPanelHeaders.delete(appName)
                            setPanelHeaderMsg(newPanelHeaders)
                            setApplicationsToAdd(
                              updateApplicationList({ label: appName, value: appName }, applicationsToAdd, false)
                            )
                          } else {
                            newPanelHeaders.set(appName, { isError: true, msg: error })
                            setPanelHeaderMsg(newPanelHeaders)
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
                            newPanelHeaders.set(configData.applicationName || '', { msg: 'Success', isError: false })
                            if (error) {
                              newPanelHeaders.set(configData.applicationName || '', { msg: error, isError: true })
                            }
                            setPanelHeaderMsg(newPanelHeaders)
                          }
                        }}
                      >
                        <AppDynamicsConfig
                          key={configData.applicationName}
                          config={configData}
                          index={index}
                          formikProps={formikProps}
                          serviceOptions={serviceOptions}
                          dataSourceId={dataSourceId}
                          metricPackMap={metricPackMap}
                        />
                      </CollapseListPanel>
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
  const { configs, serviceOptions, locationContext } = props

  useEffect(() => {
    fetchAppDApps(accountId, connectorId).then((appDApplicationsOptions: SelectOption[]) => {
      if (appDApplicationsOptions?.length) {
        const appNameToId = new Map<string, SelectOption>()
        appDApplicationsOptions.forEach(option => {
          appNameToId.set(option.label as string, option)
        })
        setAppDApplications(appNameToId)
      }
    })
    fetchMetricPacks({
      accountId,
      projectId: 12345,
      dataSourceType: 'APP_DYNAMICS',
      excludeDetails: false,
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
  }, [])

  return (
    <Page.Body>
      <AppDynamicsDataSourceForm
        configList={configs}
        serviceOptions={serviceOptions}
        dataSourceId={connectorId}
        metricPackMap={metricPackMap}
        productName={locationContext.products?.[0]}
        appDApplications={appDApplications}
      />
    </Page.Body>
  )
}
