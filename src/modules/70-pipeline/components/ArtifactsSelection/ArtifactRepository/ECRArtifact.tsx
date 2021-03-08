import React from 'react'
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
import { useParams } from 'react-router-dom'
import * as Yup from 'yup'
import { useListAwsRegions } from 'services/portal'
import type { ConnectorConfigDTO } from 'services/cd-ng'
import { useStrings } from 'framework/exports'
import { ConfigureOptions } from '@common/components/ConfigureOptions/ConfigureOptions'

import i18n from '../ArtifactsSelection.i18n'
import type { ImagePathProps } from '../ArtifactInterface'
import css from './ArtifactConnector.module.scss'

const ecrSchema = Yup.object().shape({
  imagePath: Yup.string().trim().required(i18n.validation.imagePath)
})

export const ECRArtifact: React.FC<StepProps<ConnectorConfigDTO> & ImagePathProps> = props => {
  const { name, handleSubmit, prevStepData, initialValues } = props

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

  const regions = (data?.resource || []).map((region: any) => ({
    value: region.value,
    label: region.name
  }))

  const getInitialValues = () => {
    const initialData = {
      ...(initialValues as any)
    }

    return initialData
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

  return (
    <Layout.Vertical spacing="xxlarge" className={css.firstep} data-id={name}>
      <div className={css.heading}>{i18n.specifyArtifactServer}</div>
      <Formik
        initialValues={getInitialValues()}
        validationSchema={ecrSchema}
        onSubmit={formData => {
          handleSubmit({
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
              <div>
                <FormInput.MultiTypeInput
                  selectItems={regions}
                  // multiTypeInputProps={{ expressions }}
                  label={getString('pipelineSteps.regionLabel')}
                  name="region"
                />
              </div>
            </div>

            <Button intent="primary" type="submit" text={i18n.existingDocker.save} className={css.saveBtn} />
          </Form>
        )}
      </Formik>
    </Layout.Vertical>
  )
}
