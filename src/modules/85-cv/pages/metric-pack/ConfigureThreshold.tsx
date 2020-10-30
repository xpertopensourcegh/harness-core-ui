import React, { FunctionComponent, useState, useEffect } from 'react'
import { Tabs, Tab, OverlaySpinner } from '@wings-software/uikit'
import { FieldArray } from 'formik'
import { Formik, FormikForm, FormInput, Button } from '@wings-software/uikit'
import * as Yup from 'yup'
import { useRouteParams } from 'framework/exports'
import { saveMerics, getMerics } from './ConfigureThresholdService'
import { mapCriteriaToRequest, mapCriteriaSignToForm } from './ConfigureThresholdUtils'
import css from './ConfigureThreshold.module.scss'

const criteriaOptions = [
  { label: 'greater than', value: 'GREATER_THAN' },
  { label: 'less than', value: 'LESS_THAN' }
]

const typeOptions: Array<{ label: string; value: string }> = [
  { label: 'Absolute', value: 'absolute-value' },
  { label: 'Delta', value: 'delta' },
  { label: 'Ratio', value: 'ratio' }
]

const failActionOptions: Array<{ label: string; value: string }> = [
  { label: 'Fail Immediately', value: 'fail-immediately' },
  { label: 'Fail After Occurrences', value: 'fail-after-multiple-occurrences' },
  { label: 'Fail After Consecutive Occurrences', value: 'fail-after-consecutive-occurrences' }
]

const ignoreActionOptions = [{ label: 'ignore', value: 'ignore' }]

const dummyMetricOptions = [
  { label: 'Response Time', value: 'Response Time' },
  { label: 'Stalls', value: 'Stalls' },
  { label: 'Throughout', value: 'Throughout' }
]

const failInitialValues = {
  name: '',
  criteria: 0,
  criteriaOptions: '',
  type: '',
  occurrenceCount: 1,
  action: ''
}

const ignoreInitialValues = {
  name: '',
  criteria: 0,
  criteriaOptions: '',
  type: '',
  action: ignoreActionOptions[0].value
}

const fail = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  criteria: Yup.number().required('Required'),
  criteriaOptions: Yup.string().required('Criteria is required'),
  type: Yup.string().required('Type is required'),
  action: Yup.string().required('Action is required'),
  occurrenceCount: Yup.number().required('Occurrence is required')
})

const ignore = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  criteria: Yup.number().required('Required'),
  criteriaOptions: Yup.string().required('Criteria is required'),
  type: Yup.string().required('Type is required'),
  action: Yup.string().required('Action is required')
})

const validationSchema = Yup.object().shape({
  metrics: Yup.object().shape({
    failMetrics: Yup.array().of(fail),
    ignoreMetrics: Yup.array().of(ignore)
  })
})

interface ConfigureThresholdProps {
  metricPack: any
  dataSourceType: any
  onUpdateConfigMetrics?: (values: any) => void
  onCancel?: () => void
  hints?: {
    failFastHints: any[]
    ignoreHints: any[]
  }
}

const ConfigureThreshold: FunctionComponent<any> = (props: ConfigureThresholdProps) => {
  const [failMetrics, setFailMetrics] = useState([])
  const [ignoreMetrics, setIgnoreMetrics] = useState([])
  const [metricOptions, setMetricOptions] = useState(dummyMetricOptions)
  const [metricPackIdentifier, setMetricPackIdentifier] = useState('')
  const [inProgress, setInProgress] = useState(false)
  const {
    params: { projectIdentifier, accountId }
  } = useRouteParams()

  useEffect(() => {
    const { metricPack, dataSourceType, hints } = props
    setMetricPackIdentifier(metricPack.identifier)
    const selectedMetrics: any =
      metricPack.metrics
        .filter((metric: any) => metric.included && metric.name)
        .map((metric: any) => ({ label: metric.name || '', value: metric.name || '' })) || []
    setMetricOptions(selectedMetrics)
    if (hints) {
      setFailMetrics((hints.failFastHints as never[]) || [])
      setIgnoreMetrics((hints.ignoreHints as never[]) || [])
    } else if (metricPack.identifier) {
      fetchExistingMetrics(dataSourceType, metricPack.identifier)
    }
  }, [])

  async function fetchExistingMetrics(dataSourceType: any, metricpackName: string) {
    setInProgress(true)
    const queryParams = `&dataSourceType=${dataSourceType}&projectIdentifier=${projectIdentifier}&metricPackIdentifier=${metricpackName}`
    const { response }: any = await getMerics(accountId, queryParams)

    setIgnoreMetrics(
      response?.resource
        ?.filter((metric: any) => metric.action === 'ignore')
        .map((metric: any) => {
          const ignoreInitialValue = { ...ignoreInitialValues }
          ignoreInitialValue.name = metric.metricName
          ignoreInitialValue.action = metric.action
          ignoreInitialValue.type = metric.criteria.type
          ignoreInitialValue.criteriaOptions = mapCriteriaSignToForm(metric.criteria.criteria)
          ignoreInitialValue.criteria = parseInt(metric.criteria.criteria.split(' ')[1])
          return ignoreInitialValue
        }) || []
    )

    setFailMetrics(
      response?.resource
        ?.filter((metric: any) => metric.action === 'fail')
        .map((metric: any) => {
          if (metric.action === 'fail') {
            const failInitialValue = { ...failInitialValues }
            failInitialValue.name = metric.metricName
            failInitialValue.action = metric.criteria.action
            failInitialValue.type = metric.criteria.type
            failInitialValue.criteriaOptions = mapCriteriaSignToForm(metric.criteria.criteria)
            failInitialValue.criteria = parseInt(metric.criteria.criteria.split(' ')[1])
            failInitialValue.occurrenceCount = metric.criteria.occurrenceCount
            return failInitialValue
          }
        }) || []
    )
    setInProgress(false)
  }

  function addFailMetric(formikProps: any) {
    const iValues = { ...failInitialValues }
    formikProps.setFieldValue('metrics.failMetrics', [...formikProps.values.metrics.failMetrics, { ...iValues }])
  }

  function addIgnoreMetric(formikProps: any) {
    const iValues = { ...ignoreInitialValues }
    formikProps.setFieldValue('metrics.ignoreMetrics', [...formikProps.values.metrics.ignoreMetrics, { ...iValues }])
  }

  async function saveMetrics(values: any) {
    setInProgress(true)
    const payload = mapValuestoPayload(values.metrics.failMetrics, values.metrics.ignoreMetrics)
    const queryParams = `&dataSourceType=${props.dataSourceType}&projectIdentifier=${projectIdentifier}`
    await saveMerics(payload, accountId, queryParams)
    setInProgress(false)
  }

  function mapValuestoPayload(failedMetrics: any, ignoredMetrics: any) {
    const fails = failedMetrics.map((eachMetric: any) => {
      return {
        accountId,
        projectIdentifier: eachMetric.projectIdentifier || projectIdentifier,
        dataSourceType: props.dataSourceType,
        metricPackIdentifier: metricPackIdentifier,
        metricName: eachMetric.name,
        action: 'fail',
        criteria: {
          type: eachMetric.type,
          criteria: mapCriteriaToRequest(eachMetric.criteria, eachMetric.criteriaOptions),
          occurrenceCount: eachMetric.occurrenceCount,
          action: eachMetric.action
        }
      }
    })

    const ignores = ignoredMetrics.map((eachMetric: any) => {
      return {
        accountId,
        projectIdentifier: projectIdentifier,
        dataSourceType: `${props.dataSourceType}`,
        metricPackIdentifier: metricPackIdentifier,
        metricName: eachMetric.name,
        action: 'ignore',
        criteria: {
          type: eachMetric.type,
          criteria: mapCriteriaToRequest(eachMetric.criteria, eachMetric.criteriaOptions)
        }
      }
    })

    return [...fails, ...ignores]
  }

  function setOccurrence(formikProps: any, index: any) {
    const isFailImmediately = formikProps.values.metrics.failMetrics[index].action === 'fail-immediately'
    if (isFailImmediately) {
      formikProps.values.metrics.failMetrics[index].occurrenceCount = 1
    }
    return isFailImmediately
  }

  function renderBody() {
    return (
      <Formik
        validationSchema={validationSchema}
        initialValues={{ metrics: { failMetrics: failMetrics, ignoreMetrics: ignoreMetrics } }}
        onSubmit={(values: any) => {
          if (props.onUpdateConfigMetrics) {
            props.onUpdateConfigMetrics(values)
          } else {
            saveMetrics(values)
          }
        }}
        enableReinitialize={true}
        render={(formikProps: any) => {
          return (
            <FormikForm>
              <Tabs id="tabsId1">
                <Tab
                  id="tabId1"
                  title="Fail Fast Hints"
                  panel={
                    <FieldArray
                      name="metrics.failMetrics"
                      render={arrayHelpers => {
                        return (
                          <div>
                            <div className={css.addBtn}>
                              <Button
                                large
                                intent="primary"
                                minimal
                                icon="plus"
                                text="Add Metric"
                                onClick={() => {
                                  addFailMetric(formikProps)
                                }}
                              />
                            </div>

                            {formikProps.values.metrics.failMetrics.length > 0 ? (
                              <table className={css.mainSection}>
                                <thead>
                                  <tr className={css.row}>
                                    <th>Metric</th>
                                    <th></th>
                                    <th> Criteria </th>
                                    <th> Type </th>
                                    <th> Action </th>
                                    <th> Occurrence</th>
                                    <th></th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {formikProps.values.metrics.failMetrics.map((_query: any, index: number) => {
                                    return (
                                      <tr className={css.row} key={index}>
                                        <td className={css.nameField}>
                                          <FormInput.Select
                                            placeholder={'Select'}
                                            name={`metrics.failMetrics[${index}].name`}
                                            items={metricOptions}
                                          />
                                        </td>
                                        <td className={css.criteriaSign}>
                                          <FormInput.Select
                                            placeholder={'Select'}
                                            name={`metrics.failMetrics[${index}].criteriaOptions`}
                                            items={criteriaOptions}
                                          />
                                        </td>
                                        <td className={css.criteria}>
                                          <FormInput.Text
                                            inputGroup={{ type: 'number' }}
                                            name={`metrics.failMetrics[${index}].criteria`}
                                          />
                                        </td>
                                        <td className={css.type}>
                                          <FormInput.Select
                                            placeholder={'Select'}
                                            name={`metrics.failMetrics[${index}].type`}
                                            items={typeOptions as any}
                                          />
                                        </td>
                                        <td className={css.action}>
                                          <FormInput.Select
                                            placeholder={'Select'}
                                            name={`metrics.failMetrics[${index}].action`}
                                            items={failActionOptions as any}
                                          />
                                        </td>
                                        <td className={css.occurrence}>
                                          <FormInput.Text
                                            disabled={setOccurrence(formikProps, index)}
                                            inputGroup={{ type: 'number' }}
                                            name={`metrics.failMetrics[${index}].occurrenceCount`}
                                          />
                                        </td>
                                        <td className={css.removeBtn}>
                                          <Button
                                            icon="main-close"
                                            minimal
                                            onClick={() => {
                                              arrayHelpers.remove(index)
                                            }}
                                            iconProps={{ size: 12 }}
                                          />
                                        </td>
                                      </tr>
                                    )
                                  })}
                                </tbody>
                              </table>
                            ) : null}
                          </div>
                        )
                      }}
                    />
                  }
                />

                <Tab
                  id="tabId2"
                  title="Ignore Hints"
                  panel={
                    <FieldArray
                      name="metrics.ignoreMetrics"
                      render={(arrayHelpers: any) => {
                        return (
                          <div>
                            <div className={css.addBtn}>
                              <Button
                                large
                                intent="primary"
                                minimal
                                icon="plus"
                                text="Add Metric"
                                onClick={() => {
                                  addIgnoreMetric(formikProps)
                                }}
                              />
                            </div>
                            {formikProps.values.metrics.ignoreMetrics.length > 0 ? (
                              <table className={css.mainSection}>
                                <thead>
                                  <tr className={css.row}>
                                    <th>Metric</th>
                                    <th> </th>
                                    <th> Criteria </th>
                                    <th> Type </th>
                                    <th> Action </th>
                                    <th></th>
                                  </tr>
                                </thead>

                                <tbody>
                                  {formikProps.values.metrics.ignoreMetrics.map((_query: any, index: number) => {
                                    return (
                                      <tr className={css.row} key={index}>
                                        <td className={css.nameField}>
                                          <FormInput.Select
                                            placeholder={'Select'}
                                            name={`metrics.ignoreMetrics[${index}].name`}
                                            items={metricOptions}
                                          />
                                        </td>
                                        <td>
                                          <FormInput.Select
                                            placeholder={'Select'}
                                            name={`metrics.ignoreMetrics[${index}].criteriaOptions`}
                                            items={criteriaOptions}
                                          />
                                        </td>
                                        <td>
                                          <FormInput.Text
                                            inputGroup={{ type: 'number' }}
                                            name={`metrics.ignoreMetrics[${index}].criteria`}
                                          />
                                        </td>
                                        <td>
                                          <FormInput.Select
                                            placeholder={'Select'}
                                            name={`metrics.ignoreMetrics[${index}].type`}
                                            items={typeOptions as any}
                                          />
                                        </td>
                                        <td className={css.ignoreAction}> {_query.action} </td>
                                        <td className={css.removeBtn}>
                                          <Button
                                            icon="main-close"
                                            minimal
                                            onClick={() => {
                                              arrayHelpers.remove(index)
                                            }}
                                            iconProps={{ size: 12 }}
                                          />
                                        </td>
                                      </tr>
                                    )
                                  })}
                                </tbody>
                              </table>
                            ) : null}
                          </div>
                        )
                      }}
                    />
                  }
                />
              </Tabs>
              <div className={css.actionButtons}>
                <Button
                  large
                  className={css.cancel}
                  onClick={() => props.onCancel!()}
                  text="Cancel"
                  width={120}
                  type="submit"
                />
                <Button large intent="primary" disabled={!formikProps.isValid} text="Save" width={120} type="submit" />
              </div>
            </FormikForm>
          )
        }}
      />
    )
  }

  function renderHeader() {
    return (
      <div>
        <div className={css.header}>
          <h3> Configure Your Metric Threshold </h3>
        </div>
      </div>
    )
  }

  return (
    <OverlaySpinner show={inProgress}>
      <div className={css.main}>
        {!props.onUpdateConfigMetrics ? renderHeader() : null}
        {renderBody()}
      </div>
    </OverlaySpinner>
  )
}

export default ConfigureThreshold
