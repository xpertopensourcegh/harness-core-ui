import React from 'react'
import {
  Layout,
  Button,
  Text,
  FormInput,
  Formik,
  getMultiTypeFromValue,
  MultiTypeInputType,
  Color,
  StepProps
} from '@wings-software/uicore'
import cx from 'classnames'
import { Form } from 'formik'
import * as Yup from 'yup'
import { StringUtils } from '@common/exports'
import { ConfigureOptions } from '@common/components/ConfigureOptions/ConfigureOptions'

import { useStrings } from 'framework/exports'
import type { ConnectorConfigDTO } from 'services/cd-ng'
import i18n from '../ManifestWizard.i18n'
import css from '../ManifestWizardSteps.module.scss'
import helmcss from './HelmWithGIT.module.scss'

const gitFetchTypes = [
  { label: i18n.gitFetchTypes[0].label, value: 'Branch' },
  { label: i18n.gitFetchTypes[1].label, value: 'Commit' }
]
const helmVersions = [
  { label: 'Version 2', value: 'V2' },
  { label: 'Version 3', value: 'V3' }
]

interface HelmWithGITPropType {
  stepName: string
  initialValues: any
  handleSubmit: (data: any) => void
}

const HelmWithGIT: React.FC<StepProps<ConnectorConfigDTO> & HelmWithGITPropType> = ({
  stepName,
  initialValues,
  handleSubmit,
  prevStepData,
  previousStep
}) => {
  const { getString } = useStrings()
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
              paths: formData?.paths
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
          paths: Yup.string().trim().required(i18n.validation.filePath)
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
            <div className={helmcss.helmGitForm}>
              <FormInput.Text
                name="identifier"
                label={i18n.STEP_TWO.manifestId}
                placeholder={i18n.STEP_ONE.idPlaceholder}
                className={helmcss.halfWidth}
              />
              <Layout.Horizontal spacing="medium" flex>
                <div className={helmcss.halfWidth}>
                  <FormInput.Select name="gitFetchType" label={i18n.STEP_TWO.gitFetchTypeLabel} items={gitFetchTypes} />
                </div>
                <div className={helmcss.halfWidth}>
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
                <div className={helmcss.halfWidth}>
                  {formik.values?.gitFetchType === gitFetchTypes[1].value && (
                    <FormInput.MultiTextInput
                      label={i18n.STEP_TWO.commitLabel}
                      placeholder={i18n.STEP_TWO.commitPlaceholder}
                      name="commitId"
                    />
                  )}
                </div>
              </Layout.Horizontal>
              <Layout.Horizontal spacing="medium" flex>
                <div className={helmcss.halfWidth}>
                  <FormInput.MultiTextInput
                    label={getString('fileFolderPathText')}
                    placeholder={i18n.STEP_TWO.filePathPlaceholder}
                    name="paths"
                    multiTextInputProps={{
                      allowableTypes: [MultiTypeInputType.FIXED, MultiTypeInputType.EXPRESSION]
                    }}
                  />
                </div>
                <div className={helmcss.halfWidth}>
                  <FormInput.Select name="helmVersion" label={getString('helmVersion')} items={helmVersions} />
                </div>
              </Layout.Horizontal>
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

export default HelmWithGIT
