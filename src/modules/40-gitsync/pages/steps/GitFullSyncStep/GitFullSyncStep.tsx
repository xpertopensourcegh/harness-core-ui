import React, { useState } from 'react'
import * as Yup from 'yup'
import { useParams } from 'react-router-dom'
import { defaultTo } from 'lodash-es'
import {
  Button,
  Color,
  Container,
  FontVariation,
  Formik,
  FormikForm,
  FormInput,
  Layout,
  ModalErrorHandler,
  ModalErrorHandlerBinding,
  StepProps,
  Text
} from '@wings-software/uicore'
import { useStrings } from 'framework/strings'
import { createGitFullSyncConfigPromise, GitSyncConfig, triggerFullSyncPromise } from 'services/cd-ng'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import css from '@gitsync/pages/steps/GitFullSyncStep/GitFullSyncStep.module.scss'

export interface GitFullSyncStepProps {
  name: string
  onClose: () => void
}

interface GitFullSyncFormData {
  branch: string
  startPullRequest: boolean
  baseBranch: string
  title: string
}

const defaultInitialFormValues: GitFullSyncFormData = {
  branch: '',
  startPullRequest: false,
  baseBranch: '',
  title: ''
}

const saveAndTriggerFullSync = async (
  values: GitFullSyncFormData,
  params: ProjectPathProps & { gitConfigIdentifier: string },
  setIsSubmitting: (value: boolean) => void,
  closeDialog: () => void,
  modalErrorHandler?: ModalErrorHandlerBinding
): Promise<void> => {
  const { branch, startPullRequest, baseBranch, title } = values
  const { accountId, orgIdentifier, projectIdentifier, gitConfigIdentifier } = params
  const queryParams = {
    accountIdentifier: accountId,
    orgIdentifier,
    projectIdentifier
  }
  const requestBody = {
    branch,
    baseBranch,
    createPullRequest: startPullRequest,
    repoIdentifier: gitConfigIdentifier,
    ...(startPullRequest ? { message: title } : {})
  }
  modalErrorHandler?.hide()
  try {
    setIsSubmitting(true)
    const fullSyncConfigData = await createGitFullSyncConfigPromise({ queryParams, body: requestBody })
    if (fullSyncConfigData.status !== 'SUCCESS') {
      throw fullSyncConfigData
    }
    const triggerFullSync = await triggerFullSyncPromise({ queryParams, body: {} as unknown as void })
    if (triggerFullSync.status !== 'SUCCESS') {
      throw triggerFullSync
    }
    closeDialog()
  } catch (err) {
    modalErrorHandler?.showDanger(defaultTo(err.data?.message, err.message))
  } finally {
    setIsSubmitting(false)
  }
}

export const GitFullSyncStep: React.FC<StepProps<GitSyncConfig> & GitFullSyncStepProps> = props => {
  const { getString } = useStrings()
  const { prevStepData } = props
  const { accountId, orgIdentifier, projectIdentifier } = useParams<ProjectPathProps>()
  const [modalErrorHandler, setModalErrorHandler] = useState<ModalErrorHandlerBinding | undefined>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  return (
    <Container height={'inherit'} className={css.modalContainer} margin="large">
      <Container padding={{ top: 'small' }}>
        <ModalErrorHandler bind={setModalErrorHandler} style={{ marginBottom: 'var(--spacing-medium)' }} />
      </Container>
      <Text font={{ variation: FontVariation.H4 }} margin={{ top: 'large', bottom: 'large' }} color={Color.BLACK}>
        {getString('gitsync.fullSyncTitle')}
      </Text>
      <Text
        font={{ variation: FontVariation.FORM_SUB_SECTION }}
        margin={{ top: 'large', bottom: 'large' }}
        color={Color.BLACK}
      >
        {getString('gitsync.fullSyncSubTitle')}
      </Text>
      <Formik<GitFullSyncFormData>
        initialValues={defaultInitialFormValues}
        formName="gitFullSyncForm"
        validationSchema={Yup.object().shape({
          branch: Yup.string().trim().required(getString('common.git.validation.branchRequired')),
          baseBranch: Yup.string().when('startPullRequest', {
            is: true,
            then: Yup.string().trim().required(getString('common.git.validation.baseBranchRequired'))
          }),
          title: Yup.string().trim().required(getString('common.git.validation.PRTitleRequired'))
        })}
        onSubmit={values => {
          saveAndTriggerFullSync(
            values,
            { accountId, orgIdentifier, projectIdentifier, gitConfigIdentifier: prevStepData?.identifier || '' },
            setIsSubmitting,
            props.onClose,
            modalErrorHandler
          )
        }}
      >
        {({ values: formValues, isValid }) => (
          <FormikForm>
            <Container className={css.formBody}>
              <FormInput.Text
                name="branch"
                label={getString('gitsync.enterBranchToSync')}
                className={css.input}
              ></FormInput.Text>
              <FormInput.CheckBox name="startPullRequest" label={getString('gitsync.startPullRequest')} isOptional />
              {formValues.startPullRequest ? (
                <FormInput.Text
                  name="baseBranch"
                  label={getString('gitsync.baseBranch')}
                  className={css.input}
                ></FormInput.Text>
              ) : (
                <></>
              )}
              <FormInput.Text
                name="title"
                label={getString('gitsync.PRTitle')}
                className={css.inputLarge}
              ></FormInput.Text>
            </Container>

            <Layout.Horizontal padding={{ top: 'small', left: 'xlarge' }} spacing="medium">
              <Button
                type="submit"
                intent="primary"
                text={getString('gitsync.startSync')}
                disabled={!isValid || isSubmitting}
              />
              <Button text={getString('cancel')} margin={{ left: 'medium' }} onClick={props.onClose} />
            </Layout.Horizontal>
          </FormikForm>
        )}
      </Formik>
    </Container>
  )
}
