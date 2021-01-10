import React, { useState } from 'react'
import * as Yup from 'yup'
import { get } from 'lodash-es'
import {
  StepWizard,
  SelectOption,
  StepProps,
  Layout,
  Formik,
  FormInput,
  FormikForm as Form,
  Text,
  Button
} from '@wings-software/uicore'
import ConnectorDetailsStep from '@connectors/components/CreateConnector/commonSteps/ConnectorDetailsStep'
import type { ConnectorConfigDTO, NgPipeline } from 'services/cd-ng'
import { Connectors } from '@connectors/constants'
import { StringUtils } from '@common/exports'
import VerifyOutOfClusterDelegate from '@connectors/common/VerifyOutOfClusterDelegate/VerifyOutOfClusterDelegate'
import ConnectionModeStep from '@connectors/components/CreateConnector/GITConnector/ConnectionModeStep/ConnectionModeStep'

import HttpCredendialStep from '@connectors/components/CreateConnector/GITConnector/HTTP/HttpCredendialStep'
import type { StageElementWrapper } from 'services/cd-ng'
import i18n from '@connectors/components/CreateConnector/GITConnector/CreateGITConnector.i18n'
import customi18n from '@pipeline/components/ManifestSelection/ManifestWizardSteps/ManifestWizard.i18n'
import css from './CreateGitConnector.module.scss'

interface CreateGITConnectorProps {
  accountId: string
  projectIdentifier: string
  orgIdentifier: string
  hideLightModal: () => void
  onSuccess: () => void
  pipeline: NgPipeline
  updatePipeline: (pipeline: NgPipeline) => Promise<void>
  isForOverrideSets?: boolean
  identifierName?: string
  stage: StageElementWrapper | undefined
  isForPredefinedSets?: boolean
  view: number
}

interface StepGitConnectorProps extends CreateGITConnectorProps {
  name: string
  isEditMode?: boolean
}

const manifestTypes: { [key: number]: string } = { 2: 'K8sManifest', 3: 'Values' }

const gitFetchTypes = [
  { label: customi18n.gitFetchTypes[0].label, value: 'Branch' },
  { label: customi18n.gitFetchTypes[1].label, value: 'Commit' }
]

const ManifestSourceConfigForm: React.FC<
  StepProps<StepGitConnectorProps> & {
    hideLightModal: () => void
    pipeline: NgPipeline
    updatePipeline: (pipeline: NgPipeline) => Promise<void>
    isForOverrideSets?: boolean
    identifierName?: string
    stage: StageElementWrapper | undefined
    isForPredefinedSets?: boolean
    view: number
    prevStepData?: {
      identifier?: string
    }
  }
> = props => {
  const { prevStepData } = props
  const manifests = props.isForOverrideSets
    ? get(props.stage, 'stage.spec.serviceConfig.serviceDefinition.spec.manifestOverrideSets', [])
    : !props.isForPredefinedSets
    ? get(props.stage, 'stage.spec.serviceConfig.serviceDefinition.spec.manifests', [])
    : get(props.stage, 'stage.spec.serviceConfig.stageOverrides.manifests', [])
  return (
    <Layout.Vertical spacing="xxlarge" padding="small" style={{ height: '100%' }}>
      <Text font="medium">{customi18n.STEP_TWO.title}</Text>
      <Formik
        initialValues={{ gitFetchType: gitFetchTypes[0].value }}
        validationSchema={Yup.object().shape({
          identifier: Yup.string()
            .trim()
            .required(customi18n.validation.identifier)
            .matches(/^(?![0-9])[0-9a-zA-Z_$]*$/, 'Identifier can only contain alphanumerics, _ and $')
            .notOneOf(StringUtils.illegalIdentifiers),
          filePath: Yup.string().trim().required(customi18n.validation.filePath)
        })}
        onSubmit={(formData: any) => {
          const manifestObj = {
            manifest: {
              identifier: formData.identifier,
              type: manifestTypes[props.view],
              spec: {
                store: {
                  type: 'Git',
                  spec: {
                    connectorIdentifier: prevStepData?.identifier,
                    gitFetchType: formData?.gitFetchType,
                    branch: formData?.branch,
                    commitId: formData?.commitId,
                    paths: [formData?.filePath]
                  }
                }
              }
            }
          }
          if (!props.isForOverrideSets) {
            if (manifests && manifests.length > 0) {
              manifests.push(manifestObj)
            } else {
              manifests.push(manifestObj)
            }
          } else {
            manifests.map((overrideSets: { overrideSet: { identifier: string; manifests: [{}] } }) => {
              if (overrideSets.overrideSet.identifier === props?.identifierName) {
                overrideSets.overrideSet.manifests.push(manifestObj)
              }
            })
          }

          props.updatePipeline(props.pipeline)
          props.hideLightModal()
        }}
      >
        {(formik: { values: { gitFetchType: string } }) => (
          <Form className={css.formContainer}>
            <FormInput.Text
              name="identifier"
              label={customi18n.STEP_TWO.manifestId}
              placeholder={customi18n.STEP_ONE.idPlaceholder}
            />
            <FormInput.Select name="gitFetchType" label={customi18n.STEP_TWO.gitFetchTypeLabel} items={gitFetchTypes} />

            {formik.values?.gitFetchType === gitFetchTypes[0].value && (
              <FormInput.MultiTextInput
                label={customi18n.STEP_TWO.branchLabel}
                placeholder={customi18n.STEP_TWO.branchPlaceholder}
                name="branch"
              />
            )}
            {formik.values?.gitFetchType === gitFetchTypes[1].value && (
              <FormInput.MultiTextInput
                label={customi18n.STEP_TWO.commitLabel}
                placeholder={customi18n.STEP_TWO.commitPlaceholder}
                name="commitId"
              />
            )}

            <FormInput.MultiTextInput
              label={customi18n.STEP_TWO.filePath}
              placeholder={customi18n.STEP_TWO.filePathPlaceholder}
              name="filePath"
            />

            <Layout.Horizontal spacing="large" className={css.bottomButton}>
              <Button type="submit" style={{ color: 'var(--blue-500)' }} text={customi18n.STEP_TWO.submit} />
            </Layout.Horizontal>
          </Form>
        )}
      </Formik>
    </Layout.Vertical>
  )
}

const CreateGITConnector = (props: CreateGITConnectorProps) => {
  const [formData, setFormData] = useState<ConnectorConfigDTO | undefined>()
  const [connectType, setConnectType] = useState({ label: 'HTTP', value: 'Http' } as SelectOption)
  const [isEditMode, setIsEditMode] = useState<boolean>(false)

  return (
    <>
      <StepWizard className={css.wrapper}>
        <ConnectorDetailsStep
          type={Connectors.GIT}
          name={i18n.STEP_ONE.NAME}
          setFormData={setFormData}
          formData={formData}
        />

        <ConnectionModeStep
          type={Connectors.GIT}
          name={i18n.STEP_TWO.NAME}
          setFormData={setFormData}
          formData={formData}
          connectType={connectType}
          setConnectType={setConnectType}
        />

        {connectType.value === 'Http' ? (
          <HttpCredendialStep
            name={i18n.STEP_THREE.NAME}
            setFormData={setFormData}
            formData={formData}
            {...props}
            isEditMode={isEditMode}
          />
        ) : null}
        <VerifyOutOfClusterDelegate
          name={i18n.STEP_VERIFY.NAME}
          connectorIdentifier={formData?.identifier}
          setIsEditMode={() => setIsEditMode(true)}
          renderInModal={true}
          isLastStep={false}
          type={Connectors.GIT}
          //   hideLightModal={props.hideLightModal}
          onSuccess={() => {
            // Handle on success
          }}
        />
        <ManifestSourceConfigForm name={customi18n.STEP_TWO.name} {...props} />
      </StepWizard>
    </>
  )
}

export default CreateGITConnector
