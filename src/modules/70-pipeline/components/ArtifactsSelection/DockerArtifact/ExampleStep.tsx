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
import * as Yup from 'yup'
import { useParams } from 'react-router-dom'
import { ConfigureOptions } from '@common/components/ConfigureOptions/ConfigureOptions'
import { StringUtils } from '@common/exports'
import { FormMultiTypeConnectorField } from '@connectors/components/ConnectorReferenceField/FormMultiTypeConnectorField'
import i18n from '../ArtifactsSelection.i18n'
import css from './DockerArtifact.module.scss'

interface ExampleStepProps {
  context: number
  handleViewChange: () => void
  name: string
  initialValues: any
}
const primarySchema = Yup.object().shape({
  connectorId: Yup.string().trim().required(i18n.validation.connectorId)
})

const sidecarSchema = Yup.object().shape({
  connectorId: Yup.string().trim().required(i18n.validation.connectorId),
  identifier: Yup.string()
    .trim()
    .required(i18n.validation.sidecarId)
    .matches(/^(?![0-9])[0-9a-zA-Z_$]*$/, 'Identifier can only contain alphanumerics, _ and $')
    .notOneOf(StringUtils.illegalIdentifiers)
})

export const ExampleStep: React.FC<StepProps<any> & ExampleStepProps> = props => {
  const { handleViewChange, context, name, nextStep, initialValues } = props
  const { accountId, projectIdentifier, orgIdentifier } = useParams()

  const submitFirstStep = async (formData: any): Promise<void> => {
    nextStep?.({ ...formData })
  }

  return (
    <Layout.Vertical spacing="xxlarge" className={css.firstep} data-id={name}>
      <div className={css.heading}>{i18n.specifyArtifactServer}</div>
      <Formik
        initialValues={initialValues}
        validationSchema={context === 1 ? primarySchema : sidecarSchema}
        onSubmit={formData => {
          submitFirstStep(formData)
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
              <div className={css.connectorContainer}>
                <FormMultiTypeConnectorField
                  name="connectorId"
                  label={i18n.existingDocker.connectorLabel}
                  placeholder={i18n.existingDocker.connectorPlaceholder}
                  accountIdentifier={accountId}
                  projectIdentifier={projectIdentifier}
                  orgIdentifier={orgIdentifier}
                  width={410}
                  isNewConnectorLabelVisible={false}
                  type={'DockerRegistry'}
                  enableConfigureOptions={false}
                />
                {getMultiTypeFromValue(formik.values.connectorId) === MultiTypeInputType.RUNTIME ? (
                  <div className={css.configureOptions}>
                    <ConfigureOptions
                      value={(formik.values.connectorId as unknown) as string}
                      type={'DockerRegistry'}
                      variableName="dockerConnector"
                      showRequiredField={false}
                      showDefaultField={false}
                      showAdvanced={true}
                      onChange={value => {
                        formik.setFieldValue('imagePath', value)
                      }}
                    />
                  </div>
                ) : (
                  <Button
                    intent="primary"
                    minimal
                    text={i18n.existingDocker.addnewConnector}
                    icon="plus"
                    onClick={() => handleViewChange()}
                    className={css.addNewArtifact}
                  />
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
