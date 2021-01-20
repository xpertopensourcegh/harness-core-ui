import React from 'react'
import { Formik, getMultiTypeFromValue, Layout, MultiTypeInputType, Button, StepProps } from '@wings-software/uicore'
import { Form } from 'formik'
import * as Yup from 'yup'
import { useParams } from 'react-router-dom'
import { useStrings } from 'framework/exports'
import { ConfigureOptions } from '@common/components/ConfigureOptions/ConfigureOptions'
import { FormMultiTypeConnectorField } from '@connectors/components/ConnectorReferenceField/FormMultiTypeConnectorField'
import i18n from '../ArtifactsSelection.i18n'
import css from './GCRArtifact.module.scss'

interface GCRDetailStepProps {
  handleViewChange: () => void
  name: string
  initialValues: any
}
const primarySchema = Yup.object().shape({
  connectorId: Yup.string().trim().required(i18n.validation.connectorId)
})

export const GCRDetailStep: React.FC<StepProps<any> & GCRDetailStepProps> = props => {
  const { handleViewChange, name, nextStep, initialValues } = props
  const { accountId, projectIdentifier, orgIdentifier } = useParams()
  const { getString } = useStrings()
  const submitFirstStep = async (formData: any): Promise<void> => {
    nextStep?.({ ...formData })
  }

  return (
    <Layout.Vertical spacing="xxlarge" className={css.firstep} data-id={name}>
      <div className={css.heading}>{i18n.specifyArtifactServer}</div>
      <Formik
        initialValues={initialValues}
        validationSchema={primarySchema}
        onSubmit={formData => {
          submitFirstStep(formData)
        }}
      >
        {formik => (
          <Form>
            <div className={css.connectorForm}>
              <div className={css.connectorContainer}>
                <FormMultiTypeConnectorField
                  name="connectorId"
                  label={getString('connectors.GCR.artifactServer')}
                  placeholder={getString('select')}
                  accountIdentifier={accountId}
                  projectIdentifier={projectIdentifier}
                  orgIdentifier={orgIdentifier}
                  width={410}
                  isNewConnectorLabelVisible={false}
                  type={'Gcp'}
                  enableConfigureOptions={false}
                  selected={formik?.values?.connectorId}
                />
                {getMultiTypeFromValue(formik.values.connectorId) === MultiTypeInputType.RUNTIME ? (
                  <div className={css.configureOptions}>
                    <ConfigureOptions
                      value={(formik.values.connectorId as unknown) as string}
                      type={'Gcp'}
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
