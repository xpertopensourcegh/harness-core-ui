import React from 'react'
import {
  Formik,
  FormInput,
  getMultiTypeFromValue,
  Layout,
  MultiTypeInputType,
  Button,
  StepProps,
  RUNTIME_INPUT_VALUE
} from '@wings-software/uicore'
import { Form } from 'formik'
import { useParams } from 'react-router-dom'
import * as Yup from 'yup'
import { get } from 'lodash-es'
import { useListAwsRegions } from 'services/portal'
import type { ConnectorConfigDTO } from 'services/cd-ng'
import { useStrings } from 'framework/exports'
import { useVariablesExpression } from '@pipeline/components/PipelineStudio/PiplineHooks/useVariablesExpression'

import { ConfigureOptions } from '@common/components/ConfigureOptions/ConfigureOptions'

import i18n from '../ArtifactsSelection.i18n'
import { ImagePathProps, ImagePathTypes, TagTypes } from '../ArtifactInterface'
import css from './ArtifactConnector.module.scss'

const ecrSchema = Yup.object().shape({
  imagePath: Yup.string().trim().required(i18n.validation.imagePath)
})

export const ECRArtifact: React.FC<StepProps<ConnectorConfigDTO> & ImagePathProps> = ({
  name,
  context,
  handleSubmit,
  prevStepData,
  initialValues
}) => {
  const { getString } = useStrings()
  const { accountId } = useParams()
  // const [tagList, setTagList] = React.useState([])
  // const [lastImagePath, setLastImagePath] = React.useState('')

  const defaultQueryParams = {
    accountId
  }
  const { data } = useListAwsRegions({
    queryParams: defaultQueryParams
  })

  const { expressions } = useVariablesExpression()

  const regions = (data?.resource || []).map((region: any) => ({
    value: region.value,
    label: region.name
  }))

  const getInitialValues = (): Omit<ImagePathTypes, 'tag'> & { tag: any } => {
    const specValues = get(initialValues, 'spec', null)

    if (specValues) {
      const values = {
        ...specValues,
        tagType: specValues.tag ? TagTypes.Value : TagTypes.Regex
      }
      if (getMultiTypeFromValue(specValues?.tag) === MultiTypeInputType.FIXED) {
        values.tag = { label: specValues?.tag, value: specValues?.tag }
      }
      if (context === 2 && initialValues?.identifier) {
        values.identifier = initialValues?.identifier
      }
      return values
    }

    return {
      identifier: '',
      imagePath: '',
      tag: RUNTIME_INPUT_VALUE as string,
      tagType: TagTypes.Value,
      tagRegex: '',
      region: ''
    }
  }

  const getConnectorIdValue = (): string => {
    if (getMultiTypeFromValue(prevStepData?.connectorId) === MultiTypeInputType.RUNTIME) {
      return prevStepData?.connectorId
    }
    if (prevStepData?.connectorId?.value) {
      return prevStepData?.connectorId?.value
    }
    return prevStepData?.identifier || ''
  }

  const submitFormData = (formData: any): void => {
    const tagData = formData?.tagType === TagTypes.Value ? { tag: formData.tag } : { tagRegex: formData.tagRegex }

    const artifactObj: any = {
      spec: {
        connectorRef: formData?.connectorId,
        imagePath: formData?.imagePath,
        region: formData?.region?.value,
        ...tagData
      }
    }
    if (context === 2) {
      artifactObj.identifier = formData?.identifier
    }
    handleSubmit(artifactObj)
  }

  return (
    <Layout.Vertical spacing="xxlarge" className={css.firstep} data-id={name}>
      <div className={css.heading}>{i18n.specifyArtifactServer}</div>
      <Formik
        initialValues={getInitialValues()}
        validationSchema={ecrSchema}
        onSubmit={formData => {
          submitFormData({
            ...prevStepData,
            ...formData,
            connectorId: getConnectorIdValue()
          })
        }}
      >
        {formik => (
          <Form>
            <div className={css.connectorForm}>
              <div className={css.imagePathContainer}>
                <FormInput.MultiTextInput
                  label={i18n.existingDocker.imageName}
                  name="imagePath"
                  placeholder={i18n.existingDocker.imageNamePlaceholder}
                  multiTextInputProps={{ expressions }}
                />
                {getMultiTypeFromValue(formik.values.imagePath) === MultiTypeInputType.RUNTIME && (
                  <div className={css.configureOptions}>
                    <ConfigureOptions
                      value={formik.values.imagePath as string}
                      type="String"
                      variableName="imagePath"
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
              <div>
                <FormInput.MultiTypeInput
                  selectItems={regions}
                  multiTypeInputProps={{ expressions }}
                  label={getString('pipelineSteps.regionLabel')}
                  name="region"
                />
                {getMultiTypeFromValue(formik.values.region) === MultiTypeInputType.RUNTIME && (
                  <div className={css.configureOptions}>
                    <ConfigureOptions
                      value={formik.values.imagePath as string}
                      type="String"
                      variableName="region"
                      showRequiredField={false}
                      showDefaultField={false}
                      showAdvanced={true}
                      onChange={value => {
                        formik.setFieldValue('region', value)
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <Button intent="primary" type="submit" text={i18n.existingDocker.save} className={css.saveBtn} />
          </Form>
        )}
      </Formik>
    </Layout.Vertical>
  )
}
