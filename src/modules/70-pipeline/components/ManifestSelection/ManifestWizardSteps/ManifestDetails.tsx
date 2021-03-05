import React from 'react'
import {
  Layout,
  Button,
  Text,
  FormInput,
  Formik,
  getMultiTypeFromValue,
  MultiTypeInputType,
  Icon,
  Color,
  StepProps
} from '@wings-software/uicore'
import cx from 'classnames'
import { Form, FieldArrayRenderProps, FieldArray } from 'formik'
import { v4 as nameSpace, v5 as uuid } from 'uuid'
import * as Yup from 'yup'
import { StringUtils } from '@common/exports'
import { ConfigureOptions } from '@common/components/ConfigureOptions/ConfigureOptions'

import MultiTypeFieldSelector from '@common/components/MultiTypeFieldSelector/MultiTypeFieldSelector'
import { String, useStrings } from 'framework/exports'
import type { ConnectorConfigDTO } from 'services/cd-ng'
import i18n from './ManifestWizard.i18n'
import css from './ManifestWizardSteps.module.scss'

const gitFetchTypes = [
  { label: i18n.gitFetchTypes[0].label, value: 'Branch' },
  { label: i18n.gitFetchTypes[1].label, value: 'Commit' }
]

interface ManifestDetailsPropType {
  stepName: string
  initialValues: any
  handleSubmit: (data: any) => void
}

const ManifestDetails: React.FC<StepProps<ConnectorConfigDTO> & ManifestDetailsPropType> = ({
  stepName,
  initialValues,
  handleSubmit,
  prevStepData,
  previousStep
}) => {
  const onDragStart = React.useCallback((event: React.DragEvent<HTMLDivElement>, index: number) => {
    event.dataTransfer.setData('data', index.toString())
    event.currentTarget.classList.add(css.dragging)
  }, [])

  const onDragEnd = React.useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.currentTarget.classList.remove(css.dragging)
  }, [])

  const onDragLeave = React.useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.currentTarget.classList.remove(css.dragOver)
  }, [])

  const onDragOver = React.useCallback((event: React.DragEvent<HTMLDivElement>) => {
    /* istanbul ignore else */
    if (event.preventDefault) {
      event.preventDefault()
    }
    event.currentTarget.classList.add(css.dragOver)
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = React.useCallback(
    (event: React.DragEvent<HTMLDivElement>, arrayHelpers: FieldArrayRenderProps, droppedIndex: number) => {
      /* istanbul ignore else */
      if (event.preventDefault) {
        event.preventDefault()
      }
      const data = event.dataTransfer.getData('data')
      /* istanbul ignore else */
      if (data) {
        const index = parseInt(data, 10)
        arrayHelpers.swap(index, droppedIndex)
      }
      event.currentTarget.classList.remove(css.dragOver)
    },
    []
  )
  const { getString } = useStrings()
  const defaultValueToReset = [{ path: '', uuid: uuid('', nameSpace()) }]

  const submitFormData = (formData: any): void => {
    const manifestObj = {
      manifest: {
        identifier: formData.identifier,
        spec: {
          store: {
            type: formData?.store,
            spec: {
              connectorRef: formData?.connectorRef,
              gitFetchType: formData?.gitFetchType,
              branch: formData?.branch,
              commitId: formData?.commitId,
              paths:
                typeof formData?.paths === 'string'
                  ? formData?.paths
                  : formData?.paths.map((path: { path: string }) => path.path)
            }
          }
        }
      }
    }
    handleSubmit(manifestObj)
  }

  return (
    <Layout.Vertical spacing="xxlarge" padding="small" className={css.manifestStore}>
      <Text font="large" color={Color.GREY_800}>
        {stepName}
      </Text>
      <Formik
        initialValues={initialValues}
        validationSchema={Yup.object().shape({
          identifier: Yup.string()
            .trim()
            .required(i18n.validation.identifier)
            .matches(/^(?![0-9])[0-9a-zA-Z_$]*$/, i18n.STEP_TWO.manifestIdentifier)
            .notOneOf(StringUtils.illegalIdentifiers),
          paths: Yup.array(
            Yup.object().shape({
              path: Yup.string().trim().required(i18n.validation.filePath)
            })
          ).min(1)
        })}
        onSubmit={formData => {
          submitFormData({
            ...prevStepData,
            ...formData,
            connectorRef: prevStepData?.connectorRef
              ? getMultiTypeFromValue(prevStepData?.connectorRef) === MultiTypeInputType.RUNTIME
                ? prevStepData?.connectorRef
                : prevStepData?.connectorRef?.value
              : prevStepData?.identifier
              ? prevStepData?.identifier
              : ''
          })
        }}
      >
        {(formik: {
          setFieldValue: (a: string, b: string) => void
          values: { gitFetchType: string; branch: string; paths: { path: string; uuid: string }[] }
        }) => (
          <Form>
            <div className={css.manifestDetailsForm}>
              <FormInput.Text
                name="identifier"
                label={i18n.STEP_TWO.manifestId}
                placeholder={i18n.STEP_ONE.idPlaceholder}
              />
              <FormInput.Select name="gitFetchType" label={i18n.STEP_TWO.gitFetchTypeLabel} items={gitFetchTypes} />
              <div>
                {formik.values?.gitFetchType === gitFetchTypes[0].value && (
                  <FormInput.MultiTextInput
                    label={i18n.STEP_TWO.branchLabel}
                    placeholder={i18n.STEP_TWO.branchPlaceholder}
                    name="branch"
                    className={cx({
                      [css.runtimeInput]: getMultiTypeFromValue(formik.values?.branch) === MultiTypeInputType.RUNTIME
                    })}
                  />
                )}
                {getMultiTypeFromValue(formik.values?.branch) === MultiTypeInputType.RUNTIME && (
                  <ConfigureOptions
                    value={formik.values?.branch}
                    type="String"
                    variableName="branch"
                    showRequiredField={false}
                    showDefaultField={false}
                    showAdvanced={true}
                    onChange={value => formik.setFieldValue('branch', value)}
                  />
                )}
              </div>

              {formik.values?.gitFetchType === gitFetchTypes[1].value && (
                <FormInput.MultiTextInput
                  label={i18n.STEP_TWO.commitLabel}
                  placeholder={i18n.STEP_TWO.commitPlaceholder}
                  name="commitId"
                />
              )}

              <MultiTypeFieldSelector
                defaultValueToReset={defaultValueToReset}
                disableTypeSelection
                name={'paths'}
                label={getString('fileFolderPathText')}
              >
                <Text
                  icon="info-sign"
                  className={css.fileHelpText}
                  iconProps={{ color: Color.BLUE_450, size: 23, padding: 'small' }}
                >
                  <String tagName="div" stringID="multipleFilesHelpText" />
                </Text>
                <FieldArray
                  name="paths"
                  render={arrayHelpers => (
                    <Layout.Vertical>
                      {formik.values?.paths?.map((path: { path: string; uuid: string }, index) => (
                        <Layout.Horizontal
                          key={path.uuid}
                          flex={{ distribution: 'space-between' }}
                          style={{ alignItems: 'end' }}
                        >
                          <Layout.Horizontal
                            spacing="medium"
                            style={{ alignItems: 'baseline' }}
                            draggable={true}
                            onDragStart={event => {
                              onDragStart(event, index)
                            }}
                            onDragEnd={onDragEnd}
                            onDragOver={onDragOver}
                            onDragLeave={onDragLeave}
                            onDrop={event => onDrop(event, arrayHelpers, index)}
                          >
                            {formik.values?.paths?.length > 1 && (
                              <Icon name="drag-handle-vertical" className={css.drag} />
                            )}
                            {formik.values?.paths?.length > 1 && <Text>{`${index + 1}.`}</Text>}
                            <FormInput.MultiTextInput
                              label={''}
                              placeholder={i18n.STEP_TWO.filePathPlaceholder}
                              name={`paths[${index}].path`}
                              style={{ width: '330px' }}
                              multiTextInputProps={{
                                allowableTypes: [MultiTypeInputType.FIXED, MultiTypeInputType.EXPRESSION]
                              }}
                            />
                          </Layout.Horizontal>
                          {formik.values?.paths?.length > 1 && (
                            <Button minimal icon="minus" onClick={() => arrayHelpers.remove(index)} />
                          )}
                        </Layout.Horizontal>
                      ))}
                      <span>
                        <Button
                          minimal
                          text={getString('addFileText')}
                          intent="primary"
                          className={css.addFileButton}
                          onClick={() => arrayHelpers.push({ path: '', uuid: uuid('', nameSpace()) })}
                        />
                      </span>
                    </Layout.Vertical>
                  )}
                />
              </MultiTypeFieldSelector>
            </div>

            <Layout.Horizontal spacing="xxlarge" className={css.saveBtn}>
              <Button text={getString('back')} icon="chevron-left" onClick={() => previousStep?.(prevStepData)} />
              <Button intent="primary" type="submit" text={getString('submit')} rightIcon="chevron-right" />
            </Layout.Horizontal>
          </Form>
        )}
      </Formik>
    </Layout.Vertical>
  )
}

export default ManifestDetails
