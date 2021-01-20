import type { IOptionProps } from '@blueprintjs/core'
import {
  Formik,
  FormInput,
  getMultiTypeFromValue,
  Layout,
  MultiTypeInputType,
  Button,
  StepProps
} from '@wings-software/uicore'
import { Form } from 'formik'
import React from 'react'
import * as Yup from 'yup'
import { useStrings } from 'framework/exports'
import { ConfigureOptions } from '@common/components/ConfigureOptions/ConfigureOptions'
import { StringUtils } from '@common/exports'
import i18n from '../ArtifactsSelection.i18n'
import css from './GCRArtifact.module.scss'

interface ImagePathProps {
  handleSubmit: (data: {
    connectorId: undefined | { value: string }
    imagePath: string
    identifier?: string
    tag?: string
    tagRegex?: string
  }) => void
  name?: string
  context?: number
  initialValues: any
}

const primarySchema = Yup.object().shape({
  imagePath: Yup.string().trim().required(i18n.validation.imagePath),
  registryHostname: Yup.string().trim().required('GCR Registry URL is required')
})

const sidecarSchema = Yup.object().shape({
  connectorId: Yup.string().trim().required(i18n.validation.connectorId),
  identifier: Yup.string()
    .trim()
    .required(i18n.validation.sidecarId)
    .matches(/^(?![0-9])[0-9a-zA-Z_$]*$/, 'Identifier can only contain alphanumerics, _ and $')
    .notOneOf(StringUtils.illegalIdentifiers),
  registryHostname: Yup.string().trim().required('GCR Registry URL is required')
})

const tagOptions: IOptionProps[] = [
  {
    label: 'Value',
    value: 'value'
  },
  {
    label: 'Regex',
    value: 'regex'
  }
]

export const ImagePath: React.FC<StepProps<any> & ImagePathProps> = props => {
  const { name, context, handleSubmit, prevStepData, initialValues } = props
  const { getString } = useStrings()
  return (
    <Layout.Vertical spacing="xxlarge" className={css.firstep} data-id={name}>
      <div className={css.heading}>{i18n.specifyArtifactServer}</div>
      <Formik
        initialValues={{
          ...initialValues,
          connectorId: prevStepData?.connectorId?.value
            ? prevStepData?.connectorId?.value
            : prevStepData?.identifier || ''
        }}
        validationSchema={context === 2 ? sidecarSchema : primarySchema}
        onSubmit={formData => {
          handleSubmit({ ...prevStepData, ...formData })
        }}
      >
        {formik => (
          <Form>
            <div className={css.connectorForm}>
              {context === 2 && (
                <div className={css.dockerSideCard}>
                  <FormInput.Text
                    label={i18n.existingDocker.sidecarId}
                    placeholder={i18n.existingDocker.sidecarIdPlaceholder}
                    name="identifier"
                  />
                </div>
              )}
              <div className={css.dockerSideCard}>
                <FormInput.Text
                  label={getString('connectors.GCR.registryHostname')}
                  placeholder={getString('UrlLabel')}
                  name="registryHostname"
                />
              </div>
              <div className={css.imagePathContainer}>
                <FormInput.MultiTextInput
                  label={i18n.existingDocker.imageName}
                  name="imagePath"
                  placeholder={i18n.existingDocker.imageNamePlaceholder}
                />
                {getMultiTypeFromValue(formik.values.imagePath) === MultiTypeInputType.RUNTIME && (
                  <div className={css.configureOptions}>
                    <ConfigureOptions
                      value={formik.values.imagePath as string}
                      type="String"
                      variableName="dockerConnector"
                      showRequiredField={false}
                      showDefaultField={false}
                      showAdvanced={true}
                      onChange={value => {
                        formik.setFieldValue('imagePath', value)
                      }}
                    />
                  </div>
                )}
              </div>

              <div className={css.tagGroup}>
                <FormInput.RadioGroup
                  name="tagType"
                  radioGroup={{ inline: true }}
                  items={tagOptions}
                  className={css.radioGroup}
                />
              </div>
              {formik.values.tagType === 'value' ? (
                <div className={css.imagePathContainer}>
                  <FormInput.MultiTextInput
                    label={i18n.existingDocker.tag}
                    name="tag"
                    placeholder={i18n.existingDocker.enterTag}
                  />
                  {getMultiTypeFromValue(formik.values.tag) === MultiTypeInputType.RUNTIME && (
                    <div className={css.configureOptions}>
                      <ConfigureOptions
                        value={formik.values.tag as string}
                        type="String"
                        variableName="dockerConnector"
                        showRequiredField={false}
                        showDefaultField={false}
                        showAdvanced={true}
                        onChange={value => {
                          formik.setFieldValue('tag', value)
                        }}
                      />
                    </div>
                  )}
                </div>
              ) : null}

              {formik.values.tagType === 'regex' ? (
                <div className={css.imagePathContainer}>
                  <FormInput.MultiTextInput
                    label={i18n.existingDocker.tagRegex}
                    name="tagRegex"
                    placeholder={i18n.existingDocker.enterTagRegex}
                  />
                  {getMultiTypeFromValue(formik.values.tagRegex) === MultiTypeInputType.RUNTIME && (
                    <div className={css.configureOptions}>
                      <ConfigureOptions
                        value={formik.values.tagRegex as string}
                        type="String"
                        variableName="dockerConnector"
                        showRequiredField={false}
                        showDefaultField={false}
                        showAdvanced={true}
                        onChange={value => {
                          formik.setFieldValue('tagRegex', value)
                        }}
                      />
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            <Button intent="primary" type="submit" text={i18n.existingDocker.save} className={css.saveBtn} />
          </Form>
        )}
      </Formik>
    </Layout.Vertical>
  )
}
