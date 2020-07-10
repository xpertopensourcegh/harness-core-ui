import React from 'react'
import * as Yup from 'yup'

import {
  Layout,
  Tabs,
  Tab,
  Button,
  Card,
  CardBody,
  Text,
  Checkbox,
  Formik,
  FormikForm,
  FormInput
} from '@wings-software/uikit'

import ArtifactsSelection from '../ArtifactsSelection/ArtifactsSelection'
import ManifestSelection from '../ManifestSelection/ManifestSelection'
import WorkflowVariables from '../WorkflowVariablesSelection/WorkflowVariables'

import i18n from './ServiceSpecifications.i18n'
import css from './ServiceSpecifications.module.scss'
import cx from 'classnames'
import { PipelineContext } from 'modules/cd/pages/pipelines/PipelineContext/PipelineContext'
import { get } from 'lodash-es'

import { loggerFor, ModuleName } from 'framework/exports'

const logger = loggerFor(ModuleName.CD)

const specificationTypes = {
  SPECIFICATION: 'SPECIFICATION',
  OVERRIDES: 'OVERRIDES'
}

export default function ServiceSpecifications(): JSX.Element {
  const [isDescriptionVisible, setDescriptionVisible] = React.useState(false)
  const [isTagsVisible, setTagsVisible] = React.useState(false)
  const [specSelected, setSelectedSpec] = React.useState(specificationTypes.SPECIFICATION)

  const {
    state: { pipeline },
    updatePipeline
  } = React.useContext(PipelineContext)

  const getInitialValues = (): { serviceName: string; description: string; tags: null | string[] } => {
    const pipelineData = get(pipeline, 'stages[0].deployment.deployment.service', null)
    const serviceName = pipelineData?.displayName
    const description = pipelineData?.description
    return { serviceName: serviceName, description: description, tags: null }
  }

  return (
    <Layout.Vertical className={css.serviceOverrides}>
      <Layout.Vertical spacing="large">
        <Formik
          initialValues={getInitialValues()}
          validate={value => {
            const pipelineData = get(pipeline, 'stages[0].deployment.deployment', {})
            const serviceStruct = {
              identifier: value.serviceName,
              displayName: value.serviceName,
              description: value.description,
              refType: {
                type: 'OUTCOME'
              },
              useFromStage: null,
              tags: value.tags,
              serviceSpec: {
                deploymentType: 'kubernetes',
                artifacts: {},
                manifests: {}
              },
              overrides: {}
            }
            pipelineData['service'] = serviceStruct
            updatePipeline(pipeline)
          }}
          onSubmit={values => {
            logger.info(JSON.stringify(values))
          }}
          validationSchema={Yup.object().shape({
            serviceName: Yup.string().trim().required(i18n.validation.serviceName)
          })}
        >
          {() => {
            return (
              <FormikForm>
                <Layout.Horizontal spacing="medium">
                  <FormInput.Text
                    name="serviceName"
                    style={{ width: 300 }}
                    label={i18n.serviceNameLabel}
                    placeholder={i18n.serviceNamePlaceholderText}
                  />
                  <div className={css.addDataLinks}>
                    <Button
                      minimal
                      text={i18n.addDescription}
                      icon="plus"
                      onClick={() => setDescriptionVisible(true)}
                    />
                    <Button minimal text={i18n.addTags} icon="plus" onClick={() => setTagsVisible(true)} />
                  </div>
                </Layout.Horizontal>

                {isDescriptionVisible && (
                  <div>
                    <span onClick={() => setDescriptionVisible(false)} className={css.removeLink}>
                      {i18n.removeLabel}
                    </span>
                    <FormInput.TextArea name="description" label="Description" style={{ width: 400 }} />
                  </div>
                )}
                {isTagsVisible && (
                  <div>
                    <span onClick={() => setTagsVisible(false)} className={css.removeLink}>
                      {i18n.removeLabel}
                    </span>
                    <FormInput.TagInput
                      name={i18n.addTags}
                      label={i18n.tagsLabel}
                      items={[
                        'The Godfather',
                        'The Godfather: Part II',
                        'The Dark Knight',
                        '12 Angry Men',
                        "Schindler's List",
                        'Special'
                      ]}
                      style={{ width: 400 }}
                      labelFor={(name: any) => name}
                      itemFromNewTag={newTag => newTag}
                      tagInputProps={{
                        noInputBorder: true,
                        openOnKeyDown: false,
                        showAddTagButton: true,
                        showClearAllButton: true,
                        allowNewTag: true,
                        getTagProps: (value, _index, _selectedItems, createdItems) => {
                          return createdItems.includes(value)
                            ? { intent: 'danger', minimal: true }
                            : { intent: 'none', minimal: true }
                        }
                      }}
                    />
                  </div>
                )}
              </FormikForm>
            )
          }}
        </Formik>
      </Layout.Vertical>
      <Layout.Horizontal flex={true} className={css.specTabs}>
        <Button
          minimal
          text={i18n.serviceSpecificationLabel}
          onClick={() => setSelectedSpec(specificationTypes.SPECIFICATION)}
          className={cx({ [css.selected]: specSelected === specificationTypes.SPECIFICATION })}
        />
        <Button
          minimal
          text={i18n.stageOverrideLabel}
          onClick={() => setSelectedSpec(specificationTypes.OVERRIDES)}
          className={cx({ [css.selected]: specSelected === specificationTypes.OVERRIDES })}
        />
      </Layout.Horizontal>
      {specSelected === specificationTypes.SPECIFICATION && (
        <Layout.Vertical spacing="medium">
          <Text style={{ fontSize: 16, color: 'var(--grey-400)' }}>{i18n.deploymentTypeLabel}</Text>

          <Card interactive={true} selected style={{ width: 120 }}>
            <CardBody.Icon icon="service-kubernetes" iconSize={34}>
              <Text font={{ align: 'center' }} style={{ fontSize: 14 }}>
                {i18n.deploymentType}
              </Text>
            </CardBody.Icon>
          </Card>
        </Layout.Vertical>
      )}
      {specSelected === specificationTypes.OVERRIDES && (
        <Layout.Vertical spacing="medium" padding="xxlarge">
          <Checkbox label={i18n.overidesCondition} className={css.overideCheckbox} />
          <Text style={{ fontSize: 14, color: 'var(-grey-300)' }}>{i18n.overideInfoText}</Text>
        </Layout.Vertical>
      )}
      <Layout.Horizontal spacing="small">
        <Tabs id="serviceSpecifications">
          <Tab id={i18n.artifacts} title={i18n.artifacts} panel={<ArtifactsSelection />} />
          <Tab id={i18n.manifests} title={i18n.manifests} panel={<ManifestSelection />} />
          <Tab id={i18n.variables} title={i18n.variables} panel={<WorkflowVariables />} />
        </Tabs>
      </Layout.Horizontal>
    </Layout.Vertical>
  )
}
