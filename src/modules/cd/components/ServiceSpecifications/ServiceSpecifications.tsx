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
  FormInput,
  IconName
} from '@wings-software/uikit'

import cx from 'classnames'
import { PipelineContext } from 'modules/cd/pages/pipeline-studio/PipelineContext/PipelineContext'
import { getStageFromPipeline } from 'modules/cd/pages/pipeline-studio/StageBuilder/StageBuilderUtil'
import { loggerFor, ModuleName } from 'framework/exports'
import ArtifactsSelection from '../ArtifactsSelection/ArtifactsSelection'
import ManifestSelection from '../ManifestSelection/ManifestSelection'
import WorkflowVariables from '../WorkflowVariablesSelection/WorkflowVariables'

import i18n from './ServiceSpecifications.i18n'
import OverrideSets from '../OverrideSets/OverrideSets'
import css from './ServiceSpecifications.module.scss'

const logger = loggerFor(ModuleName.CD)

const specificationTypes = {
  SPECIFICATION: 'SPECIFICATION',
  OVERRIDES: 'OVERRIDES'
}

const supportedDeploymentTypes: { name: string; icon: IconName }[] = [
  {
    name: i18n.deploymentTypes.kubernetes,
    icon: 'service-kubernetes'
  },
  {
    name: i18n.deploymentTypes.amazonEcs,
    icon: 'service-ecs'
  },
  {
    name: i18n.deploymentTypes.amazonAmi,
    icon: 'main-service-ami'
  },
  {
    name: i18n.deploymentTypes.awsCodeDeploy,
    icon: 'app-aws-code-deploy'
  },
  {
    name: i18n.deploymentTypes.winrm,
    icon: 'command-winrm'
  },
  {
    name: i18n.deploymentTypes.awsLambda,
    icon: 'app-aws-lambda'
  },
  {
    name: i18n.deploymentTypes.pcf,
    icon: 'service-pivotal'
  },
  {
    name: i18n.deploymentTypes.ssh,
    icon: 'secret-ssh'
  }
]

export default function ServiceSpecifications(): JSX.Element {
  const [isDescriptionVisible, setDescriptionVisible] = React.useState(false)
  const [selectedTab, setSelectedTab] = React.useState(i18n.artifacts)
  const [isTagsVisible, setTagsVisible] = React.useState(false)
  const [specSelected, setSelectedSpec] = React.useState(specificationTypes.SPECIFICATION)

  const {
    state: {
      pipeline,
      pipelineView: {
        splitViewData: { selectedStageId }
      }
    },

    updatePipeline
  } = React.useContext(PipelineContext)

  const { stage } = getStageFromPipeline(pipeline, selectedStageId || '')
  if (stage?.stage) {
    if (!stage.stage.spec) {
      stage.stage.spec = {}
    }
    if (!stage.stage.spec.service) {
      stage.stage.spec = {
        service: {
          identifier: null,
          name: null,
          description: null,
          tags: null,
          serviceDefinition: {
            type: 'Kubernetes',
            spec: {
              artifacts: {
                primary: null,
                sidecars: []
              },
              manifests: [],
              variables: [],
              artifactOverrideSets: [],
              manifestOverrideSets: [],
              variableOverrideSets: []
            }
          }
        }
      }
      updatePipeline(pipeline)
    }
  }
  const getInitialValues = (): { serviceName: string; description: string; tags: null | string[] } => {
    const pipelineData = stage?.['stage']?.['spec']?.['service'] || null
    const serviceName = pipelineData?.name || ''
    const description = pipelineData?.description || ''
    return { serviceName: serviceName, description: description, tags: null }
  }

  const handleTabChange = (data: string): void => {
    setSelectedTab(data)
  }

  return (
    <Layout.Vertical className={css.serviceOverrides}>
      <Layout.Vertical spacing="large">
        <Formik
          initialValues={getInitialValues()}
          validate={value => {
            if (stage) {
              const serviceObj = stage['stage']['spec']['service']
              serviceObj['identifier'] = value.serviceName
              serviceObj['name'] = value.serviceName
              serviceObj['description'] = value.description
              serviceObj['tags'] = value.tags
              updatePipeline(pipeline)
            }
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
                      items={[]}
                      style={{ width: 400 }}
                      labelFor={name => name as string}
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
        <Layout.Vertical spacing="medium" style={{ display: 'inline-block' }}>
          <Text style={{ fontSize: 16, color: 'var(--grey-400)' }}>{i18n.deploymentTypeLabel}</Text>

          {supportedDeploymentTypes.map((type: { name: string; icon: IconName }) => (
            <Card
              key={type.name}
              interactive={true}
              selected={type.name === i18n.deploymentTypes.kubernetes ? true : false}
              style={{ width: 90, padding: 'var(--spacing-small) 0', marginRight: 'var(--spacing-small)' }}
            >
              <CardBody.Icon icon={type.icon as IconName} iconSize={26}>
                <Text font={{ align: 'center' }} style={{ fontSize: 14 }}>
                  {type.name}
                </Text>
              </CardBody.Icon>
            </Card>
          ))}
        </Layout.Vertical>
      )}
      {specSelected === specificationTypes.OVERRIDES && (
        <Layout.Vertical spacing="medium" padding="xxlarge">
          <Checkbox label={i18n.overidesCondition} className={css.overideCheckbox} />
          <Text style={{ fontSize: 14, color: 'var(-grey-300)' }}>{i18n.overideInfoText}</Text>
        </Layout.Vertical>
      )}
      <Layout.Vertical spacing="small">
        <Tabs id="serviceSpecifications" onChange={handleTabChange}>
          <Tab id={i18n.artifacts} title={i18n.artifacts} panel={<ArtifactsSelection isForOverrideSets={false} />} />
          <Tab id={i18n.manifests} title={i18n.manifests} panel={<ManifestSelection isForOverrideSets={false} />} />
          <Tab id={i18n.variables} title={i18n.variables} panel={<WorkflowVariables isForOverrideSets={false} />} />
        </Tabs>
        <OverrideSets selectedTab={selectedTab} />
      </Layout.Vertical>
    </Layout.Vertical>
  )
}
