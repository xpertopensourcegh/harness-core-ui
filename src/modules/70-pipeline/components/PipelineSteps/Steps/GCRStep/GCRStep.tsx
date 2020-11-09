import React from 'react'
import {
  Text,
  Formik,
  FormInput,
  Button,
  getMultiTypeFromValue,
  IconName,
  MultiTypeInputType,
  Layout,
  FormikForm
} from '@wings-software/uikit'
import { isEmpty } from 'lodash-es'
import { FieldArray } from 'formik'
import * as yup from 'yup'
import cx from 'classnames'
import { useParams } from 'react-router-dom'
import { String, useStrings } from 'framework/exports'
import { ConfigureOptions, PipelineContext, StepViewType } from '@pipeline/exports'
import { FormMultiTypeConnectorField } from '@connectors/components/ConnectorReferenceField/FormMultiTypeConnectorField'
import {
  getIdentifierFromValue,
  getScopeFromDTO,
  getScopeFromValue
} from '@common/components/EntityReference/EntityReference'
import { Scope } from '@common/interfaces/SecretsInterface'
import { DrawerTypes } from '@pipeline/components/PipelineStudio/PipelineContext/PipelineActions'
import { ConnectorInfoDTO, useGetConnector } from 'services/cd-ng'
import { StepType } from '../../PipelineStepInterface'
import { PipelineStep } from '../../PipelineStep'
import css from './GCRStep.module.scss'
import stepCss from '../Steps.module.scss'

// Fix typings
function getInitialValuesInCorrectFormat(initialValues: any): any {
  const labels = Object.keys(initialValues.spec.labels || {}).map(key => ({
    key: key,
    value: initialValues.spec.labels![key]
  }))

  if (labels.length === 0) {
    labels.push({ key: '', value: '' })
  }

  return {
    ...initialValues,
    spec: {
      ...initialValues.spec,
      labels
    }
  }
}

const validationSchema = yup.object().shape({
  identifier: yup.string().trim().required(),
  name: yup.string().trim().required(),
  description: yup.string().trim().required(),
  spec: yup
    .object()
    .shape({
      connectorRef: yup.mixed().required(),
      registry: yup.string().trim().required(),
      repo: yup.string().trim().required(),
      tags: yup.array().compact().required(),
      labels: yup.array().compact().required()
    })
    .required()
})

export interface GCRStepWidgetProps {
  initialValues: any //GCRStepData
  onUpdate?: (data: any) => void //GCRStepData
  stepViewType?: StepViewType
}

const GCRStepWidget: React.FC<GCRStepWidgetProps> = ({ initialValues, onUpdate }): JSX.Element => {
  const {
    state: { pipelineView },
    updatePipelineView
  } = React.useContext(PipelineContext)

  const { getString: getGlobalString } = useStrings()
  const { getString } = useStrings('pipeline')

  const { accountId, projectIdentifier, orgIdentifier } = useParams<{
    projectIdentifier: string
    orgIdentifier: string
    accountId: string
  }>()

  const connectorId = getIdentifierFromValue((initialValues.spec.connectorRef as string) || '')
  const initialScope = getScopeFromValue((initialValues.spec.connectorRef as string) || '')

  const { data: connector, loading, refetch } = useGetConnector({
    identifier: connectorId,
    queryParams: {
      accountIdentifier: accountId,
      orgIdentifier: initialScope === Scope.ORG || initialScope === Scope.PROJECT ? orgIdentifier : undefined,
      projectIdentifier: initialScope === Scope.PROJECT ? projectIdentifier : undefined
    },
    lazy: true,
    debounce: 300
  })

  React.useEffect(() => {
    if (
      !isEmpty(initialValues.spec.connectorRef) &&
      getMultiTypeFromValue(initialValues.spec.connectorRef || '') === MultiTypeInputType.FIXED
    ) {
      refetch()
    }
  }, [initialValues.spec.connectorRef])

  const values = getInitialValuesInCorrectFormat(initialValues)

  if (
    connector?.data?.connector &&
    getMultiTypeFromValue(initialValues.spec.connectorRef || '') === MultiTypeInputType.FIXED
  ) {
    const scope = getScopeFromDTO<ConnectorInfoDTO>(connector?.data?.connector)
    values.spec.connectorRef = {
      label: connector?.data?.connector.name || '',
      value: `${scope !== Scope.PROJECT ? `${scope}.` : ''}${connector?.data?.connector.identifier}`,
      scope: scope
    }
  } else {
    // do not apply if we are loading connectors (this will keep "Loading" as placeholder in a input field)
    if (!loading) {
      values.spec.connectorRef = initialValues.spec.connectorRef
    }
  }

  const handleCancelClick = (): void => {
    updatePipelineView({
      ...pipelineView,
      isDrawerOpened: false,
      drawerData: { type: DrawerTypes.StepConfig }
    })
  }

  return (
    <>
      <Text className={stepCss.boldLabel} font={{ size: 'medium' }}>
        <String namespace="pipeline" stringID="steps.gcr.title" />
      </Text>
      <Formik
        enableReinitialize={true}
        initialValues={values}
        validationSchema={validationSchema}
        onSubmit={_values => {
          const labels: { [key: string]: string } = {}
          _values.spec.labels.forEach((pair: { key: string; value: string }) => {
            // skip empty
            if (pair.key) {
              labels[pair.key] = pair.value
            }
          })

          const schemaValues = {
            identifier: _values.identifier,
            name: _values.name,
            description: _values.description,
            spec: {
              ..._values.spec,
              connectorRef: _values.spec.connectorRef?.value || _values.spec.connectorRef,
              labels
            }
          }

          onUpdate?.(schemaValues)
        }}
      >
        {({ values: formValues, setFieldValue, handleSubmit }) => (
          <FormikForm>
            <div className={css.fieldsSection}>
              <FormInput.InputWithIdentifier
                inputName="name"
                idName="identifier"
                inputLabel={getString('steps.gcr.stepNameLabel')}
              />
              <FormInput.TextArea name="description" label={getString('steps.gcr.descriptionLabel')} />
              <Text margin={{ top: 'medium', bottom: 'xsmall' }}>{getString('steps.gcr.connectorLabel')}</Text>
              <div className={cx(css.fieldsGroup, css.withoutSpacing)}>
                <FormMultiTypeConnectorField
                  name="spec.connectorRef"
                  label=""
                  placeholder={loading ? getString('steps.gcr.loading') : getString('steps.gcr.connectorPlaceholder')}
                  disabled={loading}
                  accountIdentifier={accountId}
                  projectIdentifier={projectIdentifier}
                  orgIdentifier={orgIdentifier}
                />
                {getMultiTypeFromValue(formValues?.spec.connectorRef) === MultiTypeInputType.RUNTIME && (
                  <ConfigureOptions
                    value={formValues?.spec.connectorRef as string}
                    type={
                      <Layout.Horizontal spacing="medium" style={{ alignItems: 'center' }}>
                        <Text>{getString('steps.gcr.connectorLabel')}</Text>
                      </Layout.Horizontal>
                    }
                    variableName="spec.connectorRef"
                    showRequiredField={false}
                    showDefaultField={false}
                    showAdvanced={true}
                    onChange={value => {
                      setFieldValue('spec.connectorRef', value)
                    }}
                  />
                )}
              </div>
              <Text margin={{ top: 'medium', bottom: 'xsmall' }}>
                <String namespace="pipeline" stringID="steps.gcr.registryLabel" />
              </Text>
              <div className={cx(css.fieldsGroup, css.withoutSpacing)}>
                <FormInput.MultiTextInput name="spec.registry" label="" style={{ flexGrow: 1 }} />
                {getMultiTypeFromValue(formValues.spec.registry) === MultiTypeInputType.RUNTIME && (
                  <ConfigureOptions
                    value={formValues.spec.registry as string}
                    type={
                      <Layout.Horizontal spacing="medium" style={{ alignItems: 'center' }}>
                        <Text>
                          <String namespace="pipeline" stringID="steps.gcr.registryLabel" />
                        </Text>
                      </Layout.Horizontal>
                    }
                    variableName="spec.registry"
                    showRequiredField={false}
                    showDefaultField={false}
                    showAdvanced={true}
                    onChange={value => setFieldValue('spec.registry', value)}
                  />
                )}
              </div>
              <Text margin={{ top: 'medium', bottom: 'xsmall' }}>
                <String namespace="pipeline" stringID="steps.gcr.repoLabel" />
              </Text>
              <div className={cx(css.fieldsGroup, css.withoutSpacing, css.bottomSpacing)}>
                <FormInput.MultiTextInput name="spec.repo" label="" style={{ flexGrow: 1 }} />
                {getMultiTypeFromValue(formValues.spec.repo) === MultiTypeInputType.RUNTIME && (
                  <ConfigureOptions
                    value={formValues.spec.repo as string}
                    type={
                      <Layout.Horizontal spacing="medium" style={{ alignItems: 'center' }}>
                        <Text>
                          <String namespace="pipeline" stringID="steps.gcr.repoLabel" />
                        </Text>
                      </Layout.Horizontal>
                    }
                    variableName="spec.repo"
                    showRequiredField={false}
                    showDefaultField={false}
                    showAdvanced={true}
                    onChange={value => setFieldValue('spec.repo', value)}
                  />
                )}
              </div>
              <FormInput.TagInput
                name="spec.tags"
                label={getString('steps.gcr.tagsLabel')}
                items={[]}
                labelFor={name => name as string}
                itemFromNewTag={newTag => newTag}
                tagInputProps={{
                  className: '',
                  noInputBorder: true,
                  openOnKeyDown: false,
                  showAddTagButton: false,
                  fill: true,
                  showNewlyCreatedItemsInList: false,
                  allowNewTag: true,
                  placeholder: ''
                }}
              />
              <Text margin={{ bottom: 'xsmall' }}>
                <String namespace="pipeline" stringID="steps.gcr.labelsLabel" />
              </Text>
              <FieldArray
                name="spec.labels"
                render={({ push, remove }) => (
                  <>
                    {formValues.spec.labels.map((_labels: string, index: number) => (
                      <div className={css.fieldsGroup} key={index}>
                        <FormInput.Text
                          name={`spec.labels[${index}].key`}
                          placeholder={getString('steps.gcr.labelsKeyPlaceholder')}
                          style={{ flexGrow: 1 }}
                        />
                        <FormInput.MultiTextInput
                          label=""
                          name={`spec.labels[${index}].value`}
                          placeholder={getString('steps.gcr.labelsValuePlaceholder')}
                          style={{ flexGrow: 1 }}
                        />
                        {getMultiTypeFromValue(formValues.spec.labels[index].value) === MultiTypeInputType.RUNTIME && (
                          <ConfigureOptions
                            value={formValues.spec.labels[index].value as string}
                            type={
                              <Layout.Horizontal spacing="medium" style={{ alignItems: 'center' }}>
                                <Text>
                                  <String namespace="pipeline" stringID="steps.gcr.labelsValuePlaceholder" />
                                </Text>
                              </Layout.Horizontal>
                            }
                            variableName={`spec.labels[${index}].value`}
                            showRequiredField={false}
                            showDefaultField={false}
                            showAdvanced={true}
                            onChange={value => setFieldValue(`spec.labels[${index}].value`, value)}
                          />
                        )}

                        {formValues.spec.labels.length > 1 && (
                          <Button
                            intent="primary"
                            icon="ban-circle"
                            iconProps={{ size: 20 }}
                            minimal
                            onClick={() => remove(index)}
                          />
                        )}
                      </div>
                    ))}
                    <Button
                      intent="primary"
                      minimal
                      text={getString('steps.gcr.addLabel')}
                      onClick={() => push({ key: '', value: '' })}
                    />
                  </>
                )}
              />
            </div>
            <div className={css.fieldsSection}>
              <Text className={css.optionalConfiguration} font={{ weight: 'semi-bold' }} margin={{ bottom: 'medium' }}>
                <String namespace="pipeline" stringID="steps.gcr.optionalConfiguration" />
              </Text>
              <Text margin={{ bottom: 'xsmall' }}>
                <String namespace="pipeline" stringID="steps.gcr.dockerfileLabel" />
              </Text>
              <div className={cx(css.fieldsGroup, css.withoutSpacing)}>
                <FormInput.MultiTextInput name="spec.dockerfile" label="" style={{ flexGrow: 1 }} />
                {getMultiTypeFromValue(formValues.spec.dockerfile) === MultiTypeInputType.RUNTIME && (
                  <ConfigureOptions
                    value={formValues.spec.dockerfile as string}
                    type={
                      <Layout.Horizontal spacing="medium" style={{ alignItems: 'center' }}>
                        <Text>
                          <String namespace="pipeline" stringID="steps.gcr.dockerfileLabel" />
                        </Text>
                      </Layout.Horizontal>
                    }
                    variableName="spec.dockerfile"
                    showRequiredField={false}
                    showDefaultField={false}
                    showAdvanced={true}
                    onChange={value => setFieldValue('spec.dockerfile', value)}
                  />
                )}
              </div>
              <Text margin={{ top: 'medium', bottom: 'xsmall' }}>
                <String namespace="pipeline" stringID="steps.gcr.contextLabel" />
              </Text>
              <div className={cx(css.fieldsGroup, css.withoutSpacing, css.bottomSpacing)}>
                <FormInput.MultiTextInput name="spec.context" label="" style={{ flexGrow: 1 }} />
                {getMultiTypeFromValue(formValues.spec.context) === MultiTypeInputType.RUNTIME && (
                  <ConfigureOptions
                    value={formValues.spec.context as string}
                    type={
                      <Layout.Horizontal spacing="medium" style={{ alignItems: 'center' }}>
                        <Text>
                          <String namespace="pipeline" stringID="steps.gcr.contextLabel" />
                        </Text>
                      </Layout.Horizontal>
                    }
                    variableName="spec.context"
                    showRequiredField={false}
                    showDefaultField={false}
                    showAdvanced={true}
                    onChange={value => setFieldValue('spec.context', value)}
                  />
                )}
              </div>
              <FormInput.TagInput
                name="spec.args"
                label={getString('steps.gcr.argsLabel')}
                items={[]}
                labelFor={name => name as string}
                itemFromNewTag={newTag => newTag}
                tagInputProps={{
                  className: '',
                  noInputBorder: true,
                  openOnKeyDown: false,
                  showAddTagButton: false,
                  fill: true,
                  showNewlyCreatedItemsInList: false,
                  allowNewTag: true,
                  placeholder: ''
                }}
              />
              <FormInput.TagInput
                name="spec.cache_from"
                label={getString('steps.gcr.cacheFromLabel')}
                items={[]}
                labelFor={name => name as string}
                itemFromNewTag={newTag => newTag}
                tagInputProps={{
                  className: '',
                  noInputBorder: true,
                  openOnKeyDown: false,
                  showAddTagButton: false,
                  fill: true,
                  showNewlyCreatedItemsInList: false,
                  allowNewTag: true,
                  placeholder: ''
                }}
              />
              <Text margin={{ top: 'medium', bottom: 'xsmall' }}>
                <String namespace="pipeline" stringID="steps.gcr.targetLabel" />
              </Text>
              <div className={cx(css.fieldsGroup, css.withoutSpacing, css.bottomSpacing)}>
                <FormInput.MultiTextInput name="spec.target" label="" style={{ flexGrow: 1 }} />
                {getMultiTypeFromValue(formValues.spec.target) === MultiTypeInputType.RUNTIME && (
                  <ConfigureOptions
                    value={formValues.spec.target as string}
                    type={
                      <Layout.Horizontal spacing="medium" style={{ alignItems: 'center' }}>
                        <Text>
                          <String namespace="pipeline" stringID="steps.gcr.targetLabel" />
                        </Text>
                      </Layout.Horizontal>
                    }
                    variableName="spec.target"
                    showRequiredField={false}
                    showDefaultField={false}
                    showAdvanced={true}
                    onChange={value => setFieldValue('spec.target', value)}
                  />
                )}
              </div>
              <FormInput.CheckBox
                name="spec.auto_tag"
                label={getString('steps.gcr.autoTagLabel')}
                margin={{ left: 'xxlarge' }}
              />
              <Text margin={{ top: 'medium', bottom: 'xsmall' }}>
                <String namespace="pipeline" stringID="steps.gcr.autoTagSuffixLabel" />
              </Text>
              <div className={cx(css.fieldsGroup, css.withoutSpacing)}>
                <FormInput.MultiTextInput name="spec.auto_tag_suffix" label="" style={{ flexGrow: 1 }} />
                {getMultiTypeFromValue(formValues.spec.auto_tag_suffix) === MultiTypeInputType.RUNTIME && (
                  <ConfigureOptions
                    value={formValues.spec.auto_tag_suffix as string}
                    type={
                      <Layout.Horizontal spacing="medium" style={{ alignItems: 'center' }}>
                        <Text>
                          <String namespace="pipeline" stringID="steps.gcr.autoTagSuffixLabel" />
                        </Text>
                      </Layout.Horizontal>
                    }
                    variableName="spec.auto_tag_suffix"
                    showRequiredField={false}
                    showDefaultField={false}
                    showAdvanced={true}
                    onChange={value => setFieldValue('spec.auto_tag_suffix', value)}
                  />
                )}
              </div>
            </div>
            <div className={css.buttonsWrapper}>
              <Button
                onClick={() => handleSubmit()}
                intent="primary"
                type="submit"
                text={getGlobalString('save')}
                margin={{ right: 'xxlarge' }}
              />
              <Button text={getGlobalString('cancel')} minimal onClick={handleCancelClick} />
            </div>
          </FormikForm>
        )}
      </Formik>
    </>
  )
}

export class GCRStep extends PipelineStep<any /*GCRStepData*/> {
  renderStep(
    initialValues: any, //GCRStepData
    onUpdate?: (data: any) => void, //GCRStepData
    stepViewType?: StepViewType
  ): JSX.Element {
    return <GCRStepWidget initialValues={initialValues} onUpdate={onUpdate} stepViewType={stepViewType} />
  }

  protected type = StepType.GCR
  // TODO: Add i18n support
  protected stepName = 'GCR'
  protected stepIcon: IconName = 'gcr'

  protected defaultValues: any /*GCRStepData*/ = {
    identifier: '',
    spec: {}
  }
}
