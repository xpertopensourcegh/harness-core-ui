import React, { FunctionComponent, useState, useEffect } from 'react'
import css from './SplunkOnboarding.module.scss'
import * as SplunkOnboardingUtils from './SplunkOnboardingUtils'
import { FieldArray } from 'formik'
import {
  Button,
  Formik,
  FormikForm,
  FormInput,
  Heading,
  Icon,
  Color,
  Select,
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
// import Utils from '../Utils/Utils'`

const sha = Yup.object().shape({
  queryName: Yup.string().required('Query Name is required'),
  service: Yup.string().required('Service is required'),
  environment: Yup.string().required('environment is required'),
  queryString: Yup.string().required('Query String is required'),
  eventType: Yup.string().required('Event Type is required')
})

const validationSchema = Yup.object().shape({
  // query: sha
  queries: Yup.array().of(sha)
})

const options = {
  chart: {
    type: 'column',
    height: 100
  },
  title: {
    text: ''
  },
  yAxis: {
    title: {
      text: ''
    }
  },
  xAxis: {
    labels: {
      enabled: false
    }
  },
  series: [
    {
      name: '',
      data: [],
      showInLegend: false
    }
  ],
  credits: {
    enabled: false
  },
  Error: false
}

const initialValues = {
  uuid: new Date().getTime(),
  queryName: '',
  service: '',
  environment: '',
  serviceInstance: '',
  queryString: '',
  eventType: 'Quality',
  graphOptions: { ...options },
  stackTrace: [],
  isOpen: true,
  isAlreadySaved: false
}

const eventTypesOptions = [
  { label: 'Quality', value: 'Quality' },
  { label: 'Error', value: 'Error' },
  { label: 'Performance', value: 'Performance' }
]

const SplunkOnboarding: FunctionComponent<any> = props => {
  const [queries, setQueries] = useState([{ ...initialValues }])
  const [serviceOptions, setServiceOptions] = useState([])

  const [environmentOptions, setEnvironmentOptions] = useState([])

  const [splunkQueriesOptions, setSplunkQueriesOptions] = useState([])

  const [inProgress, setInProgress] = useState(false)

  const accountId = 'zEaak-FLS425IEO7OLzMUg'
  const connectorId = 'g8eLKgBSQ368GWA5FuS7og'
  const appId = 'qJ_sRGAjRTyD9oXHBRkxKQ'

  const Logo = HarnessIcons['harness-logo-black']

  useEffect(() => {
    if (!props.queries) {
      fetchSplunkQueriesSavedinHarness({
        accId: accountId,
        xhrGroup: 'cv-nextgen/splunk/saved-searches',
        queryParams: '&connectorId=' + connectorId
      })
    } else {
      setQueries(props.queries)
    }
    fetchQueriesFromSplunk({
      accId: accountId,
      xhrGroup: 'cv-nextgen/splunk/saved-searches',
      queryParams: '&connectorId=' + connectorId
    })
    fetchServices({ accId: accountId, xhrGroup: 'services', queryParams: '&appId=' + appId })
    fetchEnvironments({ accId: accountId, xhrGroup: 'environments', queryParams: '&appId=' + appId })
  }, [])

  async function fetchSplunkQueriesSavedinHarness({ accId, queryParams = '', xhrGroup }: any) {
    const url = `https://localhost:9090/api/cv-nextgen/cv-config/list?accountId=${accId}${queryParams}`
    setInProgress(true)
    const { response, error }: any = await xhr.get(url, { group: xhrGroup })
    if (response) {
      setQueries(mapRespnseToUiQueries(response.resource))
      setInProgress(false)
    }
    if (error) {
      setInProgress(false)
    }
  }

  const mapRespnseToUiQueries = (response: any) => {
    return response.map((query: any) => {
      return {
        uuid: query.uuid,
        queryName: query.name,
        service: query.serviceId,
        environment: query.envId,
        serviceInstance: '',
        queryString: query.query,
        eventType: 'Quality',
        graphOptions: { ...options },
        stackTrace: [],
        isOpen: false,
        baselineTime: query.baseline,
        isAlreadySaved: true
      }
    })
  }

  async function fetchQueriesFromSplunk({ accId, queryParams = '', xhrGroup }: any) {
    setInProgress(true)
    const url = `https://localhost:9090/api/cv-nextgen/splunk/saved-searches?accountId=${accId}${queryParams}`
    const { response, error }: any = await xhr.get(url, { group: xhrGroup })
    if (response) {
      setSplunkQueriesOptions(SplunkOnboardingUtils.transformQueriesFromSplunk(response.resource) as never[])
    }
    if (error) {
      setInProgress(false)
    }
  }

  async function fetchServices({ accId, queryParams = '', xhrGroup }: any) {
    setInProgress(true)
    const url = `https://localhost:9090/api/services?accountId=${accId}${queryParams}`
    const { response, error }: any = await xhr.get(url, { group: xhrGroup })
    if (response) {
      setInProgress(false)
      setServiceOptions(
        response.resource.response.map((service: any) => {
          return {
            label: service.name,
            value: service.uuid
          }
        })
      )
    }
    if (error) {
      setInProgress(false)
    }
  }

  async function fetchEnvironments({ accId, queryParams = '', xhrGroup }: any) {
    setInProgress(true)
    const url = `https://localhost:9090/api/environments?accountId=${accId}${queryParams}`
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
    const url = `https://localhost:9090/api/cv-nextgen/splunk/histogram?accountId=${accId}${queryParams}`
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
    const url = `https://localhost:9090/api/cv-nextgen/splunk/samples?accountId=${accId}${queryParams}`
    const { response }: any = await xhr.get(url, { group: xhrGroup })
    if (response) {
      formikProps.setFieldValue(`queries[${index}].stackTrace`, [response.resource.join()])
    }
  }

  const renderHeader = () => {
    return (
      <div>
        <Icon name="service-splunk" size={24} />
        <Heading level={2} color={Color.BLACK} className={css.headingText}>
          Map your Query to a Harness service and environment
        </Heading>
      </div>
    )
  }

  const addQuery = (parentFormikProps: any) => {
    const iValues = { ...initialValues }
    iValues.uuid = new Date().getTime()
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

  // const removeQuery = (uuid, parentFormikProps, index) => {
  //   console.log('all queries ', parentFormikProps.values.queries)
  //   const filteredQueries = parentFormikProps.values.queries.filter((query, i) => {
  //     return query.uuid !== uuid
  //   })
  //   console.log(filteredQueries)
  //   parentFormikProps.setFieldValue('queries', filteredQueries)
  // }

  async function removeQuery(query: any, _index: number, _parentFormikProps: any) {
    setInProgress(true)
    const xhrGroup = 'cv-nextgen/cv-config'
    const url = `https://localhost:9090/api/cv-nextgen/cv-config/${query.uuid}?accountId=${accountId}`
    const { response, error } = await xhr.delete(url, { group: xhrGroup })
    setInProgress(false)
    if (response) {
      setInProgress(false)
      return true
    }
    if (error) {
      setInProgress(false)
    }
  }

  const renderOnboardingSection = (parentFormikProps: any, index: number) => {
    return (
      <div key={parentFormikProps.values.queries[index].uuid}>
        <div className={css.queryDropDown}>
          <Select
            onChange={value => {
              addSplunkQuery(parentFormikProps, value, index)
            }}
            items={splunkQueriesOptions}
          />
        </div>
        <div className={css.onBoardingSection}>
          <div className={css.leftSection}>
            <Icon name={'service-splunk'} className={css.logo} size={24} />
            <FormInput.TextArea
              name={`queries[${index}].queryString`}
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
            {!parentFormikProps.values.queries[index].graphOptions.Error ? (
              <HighchartsReact highcharts={Highcharts} options={parentFormikProps.values.queries[index].graphOptions} />
            ) : (
              <GraphError
                linkText={'View in Splunk'}
                onLinkClick={() => {
                  alert('clicked')
                }}
                secondLinkText={'View call logs'}
                onSecondLinkClick={() => {
                  alert('clicked')
                }}
              />
            )}
            <div className={css.stackTrace}>
              <StackTraceList stackTraceList={parentFormikProps.values.queries[index].stackTrace} />
            </div>
          </div>

          <div className={css.rightSection}>
            <Logo height="24" className={css.logo} />
            <FormInput.Text name={`queries[${index}].queryName`} label="Query Name" />
            <FormInput.Select name={`queries[${index}].service`} label="Service Name" items={serviceOptions} />
            <FormInput.Select name={`queries[${index}].environment`} label="Environment" items={environmentOptions} />
            <FormInput.Text name={`queries[${index}].serviceInstance`} label="Service instance field name" />
            {/* Select baseline time range */}
            {/* <SubViewDatePickerAndOptions parentFormikProps={parentFormikProps} index={index} /> */}
          </div>
        </div>
      </div>
    )
  }

  async function saveQuery(query: any, index: number, parentFormikProps: any) {
    setInProgress(true)
    const xhrGroup = 'cv-nextgen/cv-config'
    const payload = {
      name: query.queryName,
      accountId: accountId,
      connectorId: connectorId,
      serviceId: query.service,
      envId: query.environment,
      query: query.queryString,
      type: 'SPLUNK',
      uuid: ''
      // baseline: {
      //   startTime: today(new Date().getTime() - 120000) + ' ' + timeNow(new Date().getTime() - 120000),
      //   endTime: today(new Date().getTime() - 120000) + ' ' + timeNow(new Date().getTime() - 120000)
      // }
    }
    if (query.isAlreadySaved) {
      payload['uuid'] = query.uuid
      const url = `https://localhost:9090/api/cv-nextgen/cv-config/${query.uuid}?accountId=${accountId}`
      const { response, error }: any = await xhr.put(url, { data: payload, group: xhrGroup })
      if (response) {
        setInProgress(false)
        parentFormikProps.setFieldValue(`queries[${index}].isOpen`, false)
      }
      if (error) {
        setInProgress(false)
      }
    } else {
      delete payload.uuid
      const url = `https://localhost:9090/api/cv-nextgen/cv-config?accountId=${accountId}`
      const { response, error }: any = await xhr.post(url, { data: payload, group: xhrGroup })
      if (response) {
        setInProgress(false)
        parentFormikProps.setFieldValue(`queries[${index}].isOpen`, false)
        parentFormikProps.setFieldValue(`queries[${index}].uuid`, response.resource.uuid)
        parentFormikProps.setFieldValue(`queries[${index}].isAlreadySaved`, true)
      }
      if (error) {
        setInProgress(false)
      }
    }
  }

  // function timeNow(timeStamp: any) {
  //   const date = new Date(timeStamp)
  //   return (
  //     (date.getHours() < 10 ? '0' : '') +
  //     date.getHours() +
  //     ':' +
  //     (date.getMinutes() < 10 ? '0' : '') +
  //     date.getMinutes() +
  //     ':' +
  //     (date.getSeconds() < 10 ? '0' : '') +
  //     date.getSeconds()
  //   )
  // }

  // function today(timeStamp: any) {
  //   const date = new Date(timeStamp)
  //   return (
  //     date.getFullYear() +
  //     '-' +
  //     (date.getDate() < 10 ? '0' : '') +
  //     date.getDate() +
  //     '-' +
  //     (date.getMonth() + 1 < 10 ? '0' : '') +
  //     (date.getMonth() + 1)
  //   )
  // }

  const renderMainSection = () => {
    // const q = props.queries || queries
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
                              onToggleOpen={() => {
                                return
                              }}
                              key={index}
                              isOpen={parentFormikProps.values.queries[index].isOpen}
                              isRemovable={true}
                              heading={
                                <DataSourcePanelStatusHeaderProps
                                  message={
                                    parentFormikProps.values.queries[index].isAlreadySaved
                                      ? 'Saved Query'
                                      : 'Unsaved Query'
                                  }
                                  isError={!parentFormikProps.values.queries[index].isAlreadySaved}
                                  panelName={'Query name : ' + parentFormikProps.values.queries[index].queryName}
                                />
                              }
                              onRemove={() => {
                                if (window.confirm('Do you want to delete the item?')) {
                                  if (parentFormikProps.values.queries[index].isAlreadySaved) {
                                    if (removeQuery(parentFormikProps.values.queries[index], index, parentFormikProps))
                                      arrayHelpers.remove(index)
                                  } else arrayHelpers.remove(index)
                                  // removeQuery(formikProps.values.queries[index].uuid, parentFormikProps, index)
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

  return (
    <OverlaySpinner show={inProgress}>
      <div className={css.main}>
        {renderHeader()}
        {renderMainSection()}
      </div>
    </OverlaySpinner>
  )
}

export default SplunkOnboarding
