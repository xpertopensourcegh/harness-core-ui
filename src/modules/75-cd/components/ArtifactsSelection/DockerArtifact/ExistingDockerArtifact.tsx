import { StepWizard } from '@wings-software/uikit'
import React from 'react'
import { Layout, Button, Formik, FormInput, FormikForm as Form } from '@wings-software/uikit'
import { useParams } from 'react-router-dom'
import * as Yup from 'yup'
import cx from 'classnames'
import { FormMultiTypeConnectorField } from '@connectors/components/ConnectorReferenceField/FormMultiTypeConnectorField'
import { StringUtils } from '@common/exports'
import i18n from '../ArtifactsSelection.i18n'
import css from './DockerArtifact.module.scss'

const primarySchema = Yup.object().shape({
  connectorId: Yup.string().trim().required(i18n.validation.connectorId),
  imagePath: Yup.string().trim().required(i18n.validation.imagePath)
})

const sidecarSchema = Yup.object().shape({
  connectorId: Yup.string().trim().required(i18n.validation.connectorId),
  imagePath: Yup.string().trim().required(i18n.validation.imagePath),
  identifier: Yup.string()
    .trim()
    .required(i18n.validation.sidecarId)
    .matches(/^(?![0-9])[0-9a-zA-Z_$]*$/, 'Identifier can only contain alphanumerics, _ and $')
    .notOneOf(StringUtils.illegalIdentifiers)
})

function ExampleStep({
  handleSubmit,
  name,
  context,
  handleViewChange
}: {
  handleSubmit: (data: { connectorId: undefined | { value: string }; imagePath: string; identifier?: string }) => void
  context: number
  name?: string
  handleViewChange: () => void
}): JSX.Element {
  const { accountId, projectIdentifier, orgIdentifier } = useParams()

  return (
    <Layout.Vertical spacing="xxlarge" className={css.firstep} data-id={name}>
      <div className={css.heading}>Specify Artifact Server</div>
      <Formik
        initialValues={{ connectorId: undefined, imagePath: '' }}
        validationSchema={context === 1 ? primarySchema : sidecarSchema}
        onSubmit={formData => {
          handleSubmit(formData)
        }}
      >
        {() => (
          <Form>
            <div className={css.connectorForm}>
              {context === 2 && (
                <FormInput.InputWithIdentifier
                  inputLabel={i18n.existingDocker.sidecarId}
                  inputGroupProps={{ placeholder: i18n.existingDocker.sidecarIdPlaceholder }}
                />
              )}
              <FormMultiTypeConnectorField
                name="connectorId"
                label={i18n.existingDocker.connectorLabel}
                placeholder={i18n.existingDocker.connectorPlaceholder}
                accountIdentifier={accountId}
                projectIdentifier={projectIdentifier}
                orgIdentifier={orgIdentifier}
                width={400}
                isNewConnectorLabelVisible={false}
                type={'DockerRegistry'}
              />
              <FormInput.MultiTextInput
                label={i18n.existingDocker.imageName}
                name="imagePath"
                placeholder={i18n.existingDocker.imageNamePlaceholder}
              />
            </div>
            <Button
              intent="primary"
              minimal
              text={i18n.existingDocker.addnewConnector}
              icon="plus"
              onClick={() => handleViewChange()}
              className={cx(css.addNewArtifact, context === 2 && css.sidecarAddBtn)}
            />
            <Button intent="primary" type="submit" text={i18n.existingDocker.save} className={css.saveBtn} />
          </Form>
        )}
      </Formik>
    </Layout.Vertical>
  )
}

export default function ExistingDockerArtifact({
  handleSubmit,
  context,
  handleViewChange
}: {
  handleSubmit: (data: { connectorId: undefined | { value: string }; imagePath: string; identifier?: string }) => void
  context: number
  handleViewChange: () => void
}): JSX.Element {
  return (
    <section>
      <StepWizard className={css.existingDocker}>
        <ExampleStep
          name={i18n.specifyArtifactServer}
          handleSubmit={handleSubmit}
          context={context}
          handleViewChange={handleViewChange}
        />
        <></>
      </StepWizard>
    </section>
  )
}
