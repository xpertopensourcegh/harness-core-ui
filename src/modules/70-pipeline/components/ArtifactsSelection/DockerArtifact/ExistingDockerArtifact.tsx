import { getMultiTypeFromValue, Icon, Text } from '@wings-software/uicore'
import React from 'react'
import { Layout, Button, Formik, FormInput, FormikForm as Form, MultiTypeInputType } from '@wings-software/uicore'
import { useParams } from 'react-router-dom'
import * as Yup from 'yup'
import { FormMultiTypeConnectorField } from '@connectors/components/ConnectorReferenceField/FormMultiTypeConnectorField'
import { StringUtils } from '@common/exports'
import { ConfigureOptions } from '@common/components/ConfigureOptions/ConfigureOptions'
import { getIconByType } from '@connectors/exports'
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
      <div className={css.heading}>{i18n.specifyArtifactServer}</div>
      <Formik
        initialValues={{ connectorId: undefined, imagePath: '', identifier: '' }}
        validationSchema={context === 1 ? primarySchema : sidecarSchema}
        onSubmit={formData => {
          handleSubmit(formData)
        }}
      >
        {formik => (
          <Form>
            <div className={css.connectorForm}>
              {context === 2 && (
                <div className={css.dockerSideCard}>
                  <FormInput.InputWithIdentifier
                    inputLabel={i18n.existingDocker.sidecarId}
                    inputGroupProps={{ placeholder: i18n.existingDocker.sidecarIdPlaceholder }}
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
                      type={
                        <Layout.Horizontal spacing="medium" style={{ alignItems: 'center' }}>
                          <Icon name={getIconByType('K8sCluster')}></Icon>
                          <Text>{i18n.kubernetesConnector}</Text>
                        </Layout.Horizontal>
                      }
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
                      type={
                        <Layout.Horizontal spacing="medium" style={{ alignItems: 'center' }}>
                          <Icon name={getIconByType('K8sCluster')}></Icon>
                          <Text>{i18n.kubernetesConnector}</Text>
                        </Layout.Horizontal>
                      }
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
            </div>

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
    <div style={{ margin: '0 auto' }}>
      <ExampleStep
        name={i18n.specifyArtifactServer}
        handleSubmit={handleSubmit}
        context={context}
        handleViewChange={handleViewChange}
      />
    </div>
  )
}
