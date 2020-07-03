import React, { FunctionComponent, useState, useEffect } from 'react'
import css from './SplunkOnboarding.module.scss'
import * as SplunkOnboardingUtils from './SplunkOnboardingUtils'
import { FieldArray } from 'formik'
import {
  Button,
  Formik,
  FormikForm,
  FormInput,
  Icon,
  StackTraceList,
  HarnessIcons,
  OverlaySpinner,
  GraphError,
  CollapseList,
  CollapseListPanel
} from '@wings-software/uikit'
import * as Yup from 'yup'

import Highcharts from 'highcharts/highcharts'
import HighchartsReact from 'highcharts-react-official'
import xhr from '@wings-software/xhr-async'
import DataSourcePanelStatusHeaderProps from '../../../components/DataSourcePanelStatusHeader/DataSourcePanelStatusHeader'
import { ThirdPartyCallLogModal } from '../../../components/ThirdPartyCallLogs/ThirdPartyCallLogs'
import { accountId, connectorId, appId, projectIdentifier } from 'modules/cv/constants'
import JsonSelectorFormInput from 'modules/cv/components/JsonSelector/JsonSelectorFormInput'
import cloneDeep from 'lodash/cloneDeep'

const eachQuery = Yup.object().shape({
  queryName: Yup.string().required('Query Name is required'),
  service: Yup.string().required('Service is required'),
  environment: Yup.string().required('Environment is required'),
  queryString: Yup.string().required('Query String is required'),
  eventType: Yup.string().required('Event Type is required'),
  serviceInstanceIdentifier: Yup.string().required('Service Instance Field is required')
})

const validationSchema = Yup.object().shape({
  queries: Yup.array().of(eachQuery)
})

const initialValues = cloneDeep(SplunkOnboardingUtils.splunkInitialQuery)

const eventTypesOptions = [
  { label: 'Quality', value: 'Quality' },
  { label: 'Error', value: 'Error' },
  { label: 'Performance', value: 'Performance' }
]

const SplunkOnboarding: FunctionComponent<any> = props => {
  const { configs: queries, serviceOptions, locationContext } = props

  const [environmentOptions, setEnvironmentOptions] = useState([])

  const [splunkQueriesOptions, setSplunkQueriesOptions] = useState([])

  const [inProgress, setInProgress] = useState(false)

  const [showCallLogs, setShowCallLogs] = useState(false)

  // const connectorId = locationContext.dataSourceId

  // const accountId = 'zEaak-FLS425IEO7OLzMUg'
  // const connectorId = 'g8eLKgBSQ368GWA5FuS7og'
  // const appId = 'qJ_sRGAjRTyD9oXHBRkxKQ'

  const [serviceInstanceConfig, setServiceInstanceConfig] = useState(null)

  const Logo = HarnessIcons['harness-logo-black']

  useEffect(() => {
    fetchQueriesFromSplunk({
      accId: accountId,
      xhrGroup: 'cv-nextgen/splunk/saved-searches',
      queryParams: '&connectorId=' + connectorId
    })
    fetchEnvironments({ accId: accountId, xhrGroup: 'environments', queryParams: '&appId=' + appId })
  }, [])

  async function fetchQueriesFromSplunk({ accId, queryParams = '', xhrGroup }: any) {
    setInProgress(true)
    const url = `/cv-nextgen/splunk/saved-searches?accountId=${accId}${queryParams}`
    const { response, error }: any = await xhr.get(url, { group: xhrGroup })
    if (response) {
      setSplunkQueriesOptions(SplunkOnboardingUtils.transformQueriesFromSplunk(response.resource) as never[])
    }
    if (error) {
      setInProgress(false)
    }
  }

  async function fetchEnvironments({ accId, queryParams = '', xhrGroup }: any) {
    setInProgress(true)
    const url = `api/environments?accountId=${accId}${queryParams}`
    const { response, error }: any = await xhr.get(url, { group: xhrGroup })
    if (response) {
      setInProgress(false)
      setEnvironmentOptions(
        response.resource.response.map((environment: any) => {
          return {
            label: environment.name,
            value: environment.uuid
          }
        })
      )
    }
    if (error) {
      setInProgress(false)
    }
  }

  async function fetchGraphDetails({ formikProps, index, accId, queryParams = '', xhrGroup }: any) {
    const url = `/cv-nextgen/splunk/histogram?accountId=${accId}${queryParams}`
    const { response, error }: any = await xhr.get(url, { group: xhrGroup })
    if (response) {
      formikProps.setFieldValue(`queries[${index}].graphOptions.Error`, false)
      formikProps.setFieldValue(
        `queries[${index}].graphOptions.series[0].data`,
        response.resource.bars.map((bar: any) => {
          return bar.count
        })
      )
    }
    if (error) {
      formikProps.setFieldValue(`queries[${index}].graphOptions.Error`, true)
    }
  }

  async function fetchStackTrace({ formikProps, index, accId, queryParams = '', xhrGroup }: any) {
    const url = `/cv-nextgen/splunk/samples?accountId=${accId}${queryParams}`
    const { response }: any = await xhr.get(url, { group: xhrGroup })
    if (response) {
      formikProps.setFieldValue(`queries[${index}].stackTrace`, [response.resource.rawSampleLogs.join()])
      setServiceInstanceConfig(response.resource.sample)
    }
  }

  const addQuery = (parentFormikProps: any) => {
    const iValues = { ...initialValues }
    parentFormikProps.setFieldValue('queries', [{ ...iValues }, ...parentFormikProps.values.queries])
  }

  const addSplunkQuery = (formikProps: any, value: any, index: number) => {
    formikProps.values.queries[index].queryString = value.value
    formikProps.values.queries[index].queryName = value.label
    formikProps.setFieldValue(`queries[${index}]`, formikProps.values.queries[index])

    fetchGraphDetails({
      formikProps: formikProps,
      index: index,
      accId: accountId,
      xhrGroup: 'cv-nextgen/splunk/histogram',
      queryParams: '&connectorId=' + connectorId + '&query=' + value.value
    })

    fetchStackTrace({
      formikProps: formikProps,
      index: index,
      accId: accountId,
      xhrGroup: 'cv-nextgen/splunk/samples',
      queryParams: '&connectorId=' + connectorId + '&query=' + value.value
    })
  }

  const renderHeaderForMainSection = (formikProps: any) => {
    return (
      <div className={css.mainSectionHeader}>
        <strong className={css.heading}>Existing Queries</strong>
        <span>
          <Button
            className={css.queryBtn}
            large
            intent="primary"
            minimal
            icon="plus"
            text="Query"
            onClick={() => {
              addQuery(formikProps)
            }}
            disabled={!formikProps.isValid}
          />
        </span>
      </div>
    )
  }

  async function removeQuery(query: any, _index: number, _parentFormikProps: any) {
    setInProgress(true)
    const xhrGroup = 'cv-nextgen/ds-config'
    const url = `/cv-nextgen/ds-config?accountId=${accountId}&connectorId=${connectorId}&productName=splunk&identifier=${query.queryName}`
    const { response, error } = await xhr.delete(url, { group: xhrGroup })
    setInProgress(false)
    if (response) {
      setInProgress(false)
    }
    if (error) {
      setInProgress(false)
    }
  }

  const renderOnboardingSection = (parentFormikProps: any, index: number) => {
    return (
      <div key={parentFormikProps.values.queries[index].uuid}>
        <div className={css.queryDropDown}>
          <FormInput.Select
            onChange={value => {
              addSplunkQuery(parentFormikProps, value, index)
            }}
            name={`savedQueries${index}`}
            placeholder={'Select an existing Splunk query'}
            items={splunkQueriesOptions}
          />
        </div>
        <div className={css.onBoardingSection}>
          <div className={css.leftSection}>
            <Logo height="18" className={css.logo} />
            <FormInput.Text name={`queries[${index}].queryName`} label="Query Name" placeholder="Query Name" />
            <FormInput.Select
              name={`queries[${index}].service`}
              key={serviceOptions?.[0]?.value}
              label="Service Name"
              items={serviceOptions}
              placeholder={'Select Service'}
            />
            <FormInput.Select
              name={`queries[${index}].environment`}
              placeholder={'Select Environment'}
              label="Environment"
              items={environmentOptions}
            />
            <JsonSelectorFormInput
              name={`queries[${index}].serviceInstanceIdentifier`}
              label="Service instance field name"
              json={serviceInstanceConfig}
            />
            {/* Select baseline time range */}
            {/* <SubViewDatePickerAndOptions parentFormikProps={parentFormikProps} index={index} /> */}
          </div>

          <div className={css.rightSection}>
            <Icon name={'service-splunk'} className={css.logo} size={18} />
            <FormInput.TextArea
              name={`queries[${index}].queryString`}
              placeholder={'Enter Query'}
              onChange={e => {
                if (e.target.value) {
                  fetchGraphDetails({
                    formikProps: parentFormikProps,
                    index: index,
                    accId: accountId,
                    xhrGroup: 'cv-nextgen/splunk/histogram',
                    queryParams: '&connectorId=' + connectorId + '&query=' + e.target.value
                  })
                  fetchStackTrace({
                    formikProps: parentFormikProps,
                    index: index,
                    accId: accountId,
                    xhrGroup: 'cv-nextgen/splunk/samples',
                    queryParams: '&connectorId=' + connectorId + '&query=' + e.target.value
                  })
                }
              }}
              label="Query"
            />
            <FormInput.Select name={`queries[${index}].eventType`} label="Event type" items={eventTypesOptions} />
            <label> Harness + Splunk validation </label>
            {!parentFormikProps.values.queries[index].graphOptions?.Error ? (
              <HighchartsReact highcharts={Highcharts} options={parentFormikProps.values.queries[index].graphOptions} />
            ) : (
              <GraphError
                linkText={'View in Splunk'}
                link={`https://splunk.dev.harness.io/en-GB/app/search/search?q=search%20${queries[index].queryName}%20%7C%20timechart%20count%20span%3D7h%20%7C%20table%20_time%2C%20count&display.page.search.mode=verbose&dispatch.sample_ratio=1&earliest=-7d%40h&latest=now&display.general.type=visualizations&sid=1592475949.17188&display.page.search.tab=visualizations`}
                secondLinkText={'View call logs'}
                onSecondLinkClick={() => {
                  setShowCallLogs(true)
                }}
              />
            )}
            <div className={css.stackTrace}>
              {parentFormikProps.values.queries[index].stackTrace[0]?.length > 0 ? (
                <label> Sample Events </label>
              ) : null}
              <StackTraceList stackTraceList={parentFormikProps.values.queries[index].stackTrace} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  async function saveQuery(query: any, index: number, parentFormikProps: any) {
    setInProgress(true)
    const xhrGroup = 'cv-nextgen/ds-config'
    const payload = {
      identifier: query.queryName,
      accountId: accountId,
      projectIdentifier: projectIdentifier,
      productName: 'Splunk Enterprise',
      connectorId: locationContext.dataSourceId,
      serviceIdentifier: query.service,
      envIdentifier: query.environment,
      query: query.queryString,
      type: 'SPLUNK',
      eventType: query.eventType,
      serviceInstanceIdentifier: query.serviceInstanceIdentifier
    }

    const url = `/cv-nextgen/ds-config?accountId=${accountId}`
    xhr.put(url, { data: payload, group: xhrGroup }).then(
      () => {
        setInProgress(false)
        parentFormikProps.setFieldValue(`queries[${index}].isAlreadySaved`, true)
      },
      () => {
        setInProgress(false)
      }
    )
  }

  const validate = function (values: any) {
    if (
      values.environment !== '' &&
      values.eventType !== '' &&
      values.queryName !== '' &&
      values.queryString !== '' &&
      values.service !== '' &&
      values.serviceInstanceIdentifier !== ''
    ) {
      return false
    }
    return true
  }

  const renderMainSection = () => {
    return (
      <Formik
        validationSchema={validationSchema}
        initialValues={{ queries: queries }}
        onSubmit={() => {
          return
        }}
        enableReinitialize={true}
        render={(parentFormikProps: any) => {
          return (
            <div>
              <FieldArray
                name="queries"
                render={arrayHelpers => {
                  return (
                    <div className={css.mainSection}>
                      {renderHeaderForMainSection(parentFormikProps)}
                      <CollapseList defaultOpenIndex={0}>
                        {parentFormikProps.values.queries.map((_query: any, index: number) => {
                          return (
                            <CollapseListPanel
                              className={css.listPanelBody}
                              onToggleOpen={() => {
                                return
                              }}
                              key={index}
                              nextButtonText={'Save'}
                              collapseHeaderProps={{
                                isRemovable: true,
                                heading: (
                                  <span className={css.title}>
                                    <DataSourcePanelStatusHeaderProps
                                      message={
                                        parentFormikProps.values.queries[index].isAlreadySaved
                                          ? 'Saved Query'
                                          : 'Unsaved Query'
                                      }
                                      intent={
                                        !parentFormikProps.values.queries[index].isAlreadySaved ? 'danger' : 'success'
                                      }
                                      panelName={parentFormikProps.values.queries[index].queryName}
                                    />
                                    <Button
                                      className={css.saveBtn}
                                      intent="primary"
                                      text="Save"
                                      onClick={() =>
                                        saveQuery(parentFormikProps.values.queries[index], index, parentFormikProps)
                                      }
                                      disabled={validate(parentFormikProps.values.queries[index])}
                                    />
                                  </span>
                                ),
                                onRemove: () => {
                                  if (window.confirm('Do you want to delete the item?')) {
                                    if (parentFormikProps.values.queries[index].isAlreadySaved) {
                                      if (
                                        removeQuery(parentFormikProps.values.queries[index], index, parentFormikProps)
                                      )
                                        arrayHelpers.remove(index)
                                    } else arrayHelpers.remove(index)
                                    // removeQuery(formikProps.values.queries[index].uuid, parentFormikProps, index)
                                  }
                                }
                              }}
                              // disabled={!arrayHelpers.form.isValid}
                              openNext={() => {
                                saveQuery(parentFormikProps.values.queries[index], index, parentFormikProps)
                              }}
                            >
                              <FormikForm key={index}>{renderOnboardingSection(parentFormikProps, index)}</FormikForm>
                            </CollapseListPanel>
                          )
                        })}
                      </CollapseList>
                    </div>
                  )
                }}
              />
              <div className={css.actionButtons}>
                <Button large intent="primary" text="Next" width={120} type="button" />
              </div>
            </div>
          )
        }}
      />
    )
  }

  function renderViewCallLogs() {
    return showCallLogs ? (
      <div>
        <ThirdPartyCallLogModal
          guid={'1'}
          onHide={() => {
            setShowCallLogs(false)
          }}
        />
      </div>
    ) : null
  }

  return (
    <OverlaySpinner show={inProgress}>
      <div className={css.main}>
        {renderMainSection()}
        {renderViewCallLogs()}
      </div>
    </OverlaySpinner>
  )
}

export default SplunkOnboarding
