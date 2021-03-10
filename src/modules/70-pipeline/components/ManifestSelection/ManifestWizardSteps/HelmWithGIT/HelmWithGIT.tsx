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
  StepProps,
  Accordion
} from '@wings-software/uicore'
import cx from 'classnames'
import { Form } from 'formik'
import * as Yup from 'yup'
import { v4 as nameSpace, v5 as uuid } from 'uuid'
import { get } from 'lodash-es'
import { StringUtils } from '@common/exports'
import { ConfigureOptions } from '@common/components/ConfigureOptions/ConfigureOptions'

import { useStrings } from 'framework/exports'
import type { ConnectorConfigDTO } from 'services/cd-ng'
import i18n from '../ManifestWizard.i18n'
import HelmAdvancedStepSection from '../HelmAdvancedStepSection'
import type { CommandFlags, HelmWithGITDataType } from '../../ManifestInterface'
import { helmVersions } from '../../Manifesthelper'
import css from '../ManifestWizardSteps.module.scss'
import helmcss from './HelmWithGIT.module.scss'

const gitFetchTypes = [
  { label: i18n.gitFetchTypes[0].label, value: 'Branch' },
  { label: i18n.gitFetchTypes[1].label, value: 'Commit' }
]

const commandFlagOptions = [
  { label: 'Version ', value: 'Version' },
  { label: 'Template ', value: 'Template' }
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
  const isActiveAdvancedStep: boolean = initialValues?.spec?.skipResourceVersioning || initialValues?.spec?.commandFlags

  const getInitialValues = React.useCallback((): HelmWithGITDataType => {
    const specValues = get(initialValues, 'spec.store.spec', null)

    if (specValues) {
      const values = {
        ...specValues,
        identifier: initialValues.identifier,
        paths: specValues.paths?.[0],
        helmVersion: initialValues.spec?.helmVersion,
        skipResourceVersioning: initialValues?.spec?.skipResourceVersioning,
        commandFlags: initialValues.spec?.commandFlags?.map((commandFlag: { commandType: string; flag: string }) => ({
          commandType: commandFlag.commandType,
          flag: commandFlag.flag
          // id: uuid(commandFlag, nameSpace())
        })) || [{ commandType: undefined, flag: undefined, id: uuid('', nameSpace()) }]
      }
      return values
    }
    return {
      identifier: '',
      branch: undefined,
      commitId: undefined,
      gitFetchType: 'Branch',
      paths: '',
      helmVersion: 'V2',
      skipResourceVersioning: false,
      commandFlags: [{ commandType: undefined, flag: undefined, id: uuid('', nameSpace()) }]
    }
  }, [])

  const submitFormData = (formData: any): void => {
    const manifestObj: any = {
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
              paths: [formData?.paths]
            }
          },
          skipResourceVersioning: formData?.skipResourceVersioning,
          helmVersion: formData?.helmVersion
        }
      }
    }
    if (formData?.commandFlags[0].commandType) {
      manifestObj.manifest.spec.commandFlags = formData?.commandFlags.map((commandFlag: CommandFlags) => ({
        commandType: commandFlag.commandType,
        flag: commandFlag.flag
      }))
    }
    handleSubmit(manifestObj)
  }

  return (
    <Layout.Vertical spacing="xxlarge" padding="small" className={css.manifestStore}>
      <Text font="large" color={Color.GREY_800}>
        {stepName}
      </Text>
      <Formik
        initialValues={getInitialValues()}
        validationSchema={Yup.object().shape({
          identifier: Yup.string()
            .trim()
            .required(i18n.validation.identifier)
            .matches(/^(?![0-9])[0-9a-zA-Z_$]*$/, i18n.STEP_TWO.manifestIdentifier)
            .notOneOf(StringUtils.illegalIdentifiers),
          paths: Yup.string().trim().required(i18n.validation.filePath),
          helmVersion: Yup.string().trim().required(getString('manifestType.helmVersionRequired'))
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
        {(formik: { setFieldValue: (a: string, b: string) => void; values: HelmWithGITDataType }) => (
          <Form>
            <div className={helmcss.helmGitForm}>
              <FormInput.Text
                name="identifier"
                label={i18n.STEP_TWO.manifestId}
                placeholder={i18n.STEP_ONE.idPlaceholder}
                className={helmcss.halfWidth}
              />
              <Layout.Horizontal flex spacing="xxlarge" margin={{ top: 'small', bottom: 'small' }}>
                <div className={helmcss.halfWidth}>
                  <FormInput.Select name="gitFetchType" label={i18n.STEP_TWO.gitFetchTypeLabel} items={gitFetchTypes} />
                </div>

                {formik.values?.gitFetchType === gitFetchTypes[0].value && (
                  <div className={helmcss.halfWidth}>
                    <FormInput.MultiTextInput
                      label={i18n.STEP_TWO.branchLabel}
                      placeholder={i18n.STEP_TWO.branchPlaceholder}
                      name="branch"
                      className={cx({
                        [css.runtimeInput]: getMultiTypeFromValue(formik.values?.branch) === MultiTypeInputType.RUNTIME
                      })}
                    />
                  </div>
                )}
                {getMultiTypeFromValue(formik.values?.branch) === MultiTypeInputType.RUNTIME && (
                  <ConfigureOptions
                    value={formik.values?.branch as string}
                    type="String"
                    variableName="branch"
                    showRequiredField={false}
                    showDefaultField={false}
                    showAdvanced={true}
                    onChange={value => formik.setFieldValue('branch', value)}
                  />
                )}
                {formik.values?.gitFetchType === gitFetchTypes[1].value && (
                  <div className={helmcss.halfWidth}>
                    <FormInput.MultiTextInput
                      label={i18n.STEP_TWO.commitLabel}
                      placeholder={i18n.STEP_TWO.commitPlaceholder}
                      name="commitId"
                    />
                  </div>
                )}
              </Layout.Horizontal>

              <Layout.Horizontal flex spacing="xxlarge" margin={{ bottom: 'small' }}>
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
              <Accordion activeId={isActiveAdvancedStep ? getString('advancedTitle') : ''}>
                <Accordion.Panel
                  id={getString('advancedTitle')}
                  addDomId={true}
                  summary={getString('advancedTitle')}
                  details={<HelmAdvancedStepSection formik={formik} commandFlagOptions={commandFlagOptions} />}
                />
              </Accordion>
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
