import React, { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Layout, SelectOption } from '@wings-software/uikit'
import * as Yup from 'yup'
import { parse, stringify } from 'yaml'
import { isUndefined, isEmpty, merge } from 'lodash-es'
import { Page, useToaster } from '@common/exports'
import { PageSpinner } from '@common/components/Page/PageSpinner'
import { Wizard } from '@common/components'
import { PageError } from '@common/components/Page/PageError'
import routes from '@common/RouteDefinitions'
import {
  NgPipeline,
  NGTriggerConfig,
  NGTriggerSource,
  useCreateTrigger,
  useGetPipeline,
  useGetTemplateFromPipeline,
  useGetTrigger,
  useUpdateTrigger
} from 'services/cd-ng'
import { useStrings } from 'framework/exports'
import type { PayloadConditionInterface } from './views/PayloadConditionsSection'
import { WebhookTriggerConfigPanel, WebhookConditionsPanel, WebhookPipelineInputPanel } from './views'
import {
  clearNullUndefined,
  FlatInitialValuesInterface,
  FlatOnEditValuesInterface,
  FlatValidFormikValuesInterface,
  getQueryParamsOnNew,
  getWizardMap,
  PayloadConditionTypes,
  ResponseStatus,
  TriggerTypes
} from './utils/TriggersWizardPageUtils'

const TriggersWizardPage: React.FC = (): JSX.Element => {
  const { orgIdentifier, accountId, projectIdentifier, pipelineIdentifier, triggerIdentifier } = useParams<{
    projectIdentifier: string
    orgIdentifier: string
    accountId: string
    pipelineIdentifier: string
    targetIdentifier: string
    triggerIdentifier: string
  }>()
  const history = useHistory()
  const { location } = useHistory()
  const { getString } = useStrings()
  // use passed params on new trigger
  const queryParamsOnNew = location?.search ? getQueryParamsOnNew(location.search) : undefined
  const { sourceRepo: sourceRepoOnNew, triggerType: triggerTypeOnNew } = queryParamsOnNew || {}

  const { data: template } = useGetTemplateFromPipeline({
    queryParams: { accountIdentifier: accountId, orgIdentifier, pipelineIdentifier, projectIdentifier }
  })

  const { data: triggerResponse, loading: loadingGetTrigger } = useGetTrigger({
    triggerIdentifier,
    queryParams: {
      accountIdentifier: accountId,
      orgIdentifier,
      projectIdentifier,
      targetIdentifier: pipelineIdentifier
    }
  })

  const { mutate: createTrigger, error: createTriggerErrorResponse, loading: createTriggerLoading } = useCreateTrigger({
    queryParams: { accountIdentifier: accountId, orgIdentifier, projectIdentifier },
    requestOptions: { headers: { 'content-type': 'application/yaml' } }
  })

  const { mutate: updateTrigger, error: updateTriggerErrorResponse, loading: updateTriggerLoading } = useUpdateTrigger({
    triggerIdentifier,
    queryParams: { accountIdentifier: accountId, orgIdentifier, projectIdentifier },
    requestOptions: { headers: { 'content-type': 'application/yaml' } }
  })

  const [getTriggerErrorMessage, setGetTriggerErrorMessage] = useState<string>('')
  const [currentPipeline, setCurrentPipeline] = useState<{ pipeline?: NgPipeline } | undefined>(undefined)
  const [onEditInitialValues, setOnEditInitialValues] = useState<
    FlatOnEditValuesInterface | { pipeline?: string; identifier?: string }
  >({})

  useEffect(() => {
    setCurrentPipeline(
      merge(parse(template?.data?.inputSetTemplateYaml || ''), currentPipeline || {}) as { pipeline: NgPipeline }
    )
  }, [template?.data?.inputSetTemplateYaml])

  const { data: pipelineResponse } = useGetPipeline({
    pipelineIdentifier,
    queryParams: { accountIdentifier: accountId, orgIdentifier, projectIdentifier }
  })

  const originalPipeline: NgPipeline | undefined = (pipelineResponse?.data?.ngPipeline as any)?.pipeline

  useEffect(() => {
    if (triggerResponse?.data?.yaml && triggerResponse.data.type) {
      try {
        const triggerResponseJson = parse(triggerResponse.data.yaml)
        const {
          trigger: {
            name,
            identifier,
            description,
            tags,
            source: {
              spec: {
                spec: { actions, event, repoUrl, payloadConditions },
                type
              }
            },
            target: {
              targetIdentifier,
              spec: { runtimeInputYaml: pipelineYaml }
            }
          }
        } = triggerResponseJson
        const { value: sourceBranchValue, operator: sourceBranchOperator } =
          payloadConditions?.find(
            (payloadCondition: PayloadConditionInterface) =>
              payloadCondition.key === PayloadConditionTypes.SOURCE_BRANCH
          ) || {}
        const { value: targetBranchValue, operator: targetBranchOperator } =
          payloadConditions?.find(
            (payloadCondition: PayloadConditionInterface) =>
              payloadCondition.key === PayloadConditionTypes.TARGET_BRANCH
          ) || {}
        let pipelineJson = undefined
        try {
          pipelineJson = parse(pipelineYaml)?.pipeline
        } catch (e) {
          // set error
          setGetTriggerErrorMessage('Cannot parse pipeline input values')
        }
        const newOnEditInitialValues = {
          name,
          identifier,
          description,
          tags,
          pipeline: pipelineJson,
          sourceRepo: type,
          triggerType: triggerResponse.data.type,
          repoUrl,
          event,
          targetIdentifier,
          actions: actions?.map((action: string) => ({ label: action, value: action })),
          sourceBranchOperator,
          sourceBranchValue,
          targetBranchOperator,
          targetBranchValue,
          payloadConditions: payloadConditions?.filter(
            (payloadCondition: PayloadConditionInterface) =>
              payloadCondition.key !== PayloadConditionTypes.SOURCE_BRANCH &&
              payloadCondition.key !== PayloadConditionTypes.TARGET_BRANCH
          )
        }
        setOnEditInitialValues({ ...onEditInitialValues, ...newOnEditInitialValues })
      } catch (e) {
        // set error
        setGetTriggerErrorMessage('Cannot parse triggers data')
      }
    }
  }, [triggerIdentifier, triggerResponse])

  // enable later
  // useEffect(() => {
  //   const onEditoriginalPipeline = (pipelineResponse?.data?.ngPipeline as any)?.pipeline
  //   if (originalPipeline) {
  //     setOnEditInitialValues({ ...onEditInitialValues, originalPipeline: onEditoriginalPipeline })
  //   }
  // }, [pipelineResponse])

  useEffect(() => {
    setCurrentPipeline(
      merge(parse(template?.data?.inputSetTemplateYaml || ''), currentPipeline || {}) as { pipeline: NgPipeline }
    )
  }, [template?.data?.inputSetTemplateYaml])

  const returnToTriggersPage = (): void => {
    history.push(
      routes.toCDTriggersPage({
        accountId,
        orgIdentifier,
        projectIdentifier,
        pipelineIdentifier
      })
    )
  }
  const { showSuccess } = useToaster()
  const handleSubmit = async (val: FlatValidFormikValuesInterface): Promise<void> => {
    const {
      name,
      identifier,
      description,
      tags,
      pipeline: pipelineRuntimeInput,
      sourceRepo: formikValueSourceRepo,
      triggerType: formikValueTriggerType,
      repoUrl,
      event,
      actions,
      targetIdentifier,
      sourceBranchOperator,
      sourceBranchValue,
      targetBranchOperator,
      targetBranchValue,
      payloadConditions = []
    } = val

    if (targetBranchOperator && targetBranchValue) {
      payloadConditions.unshift({
        key: PayloadConditionTypes.TARGET_BRANCH,
        operator: targetBranchOperator,
        value: targetBranchValue
      })
    }
    if (sourceBranchOperator && sourceBranchValue) {
      payloadConditions.unshift({
        key: PayloadConditionTypes.SOURCE_BRANCH,
        operator: sourceBranchOperator,
        value: sourceBranchValue
      })
    }

    // actions will be required thru validation
    const actionsValues = ((actions as unknown) as SelectOption[])?.map(action => action.value)
    const stringifyPipelineRuntimeInput = stringify({ pipeline: clearNullUndefined(pipelineRuntimeInput) })
    const triggerJson: NGTriggerConfig = {
      name,
      identifier,
      description,
      tags,
      target: {
        targetIdentifier: targetIdentifier || pipelineIdentifier,
        type: 'Pipeline',
        spec: {
          runtimeInputYaml: stringifyPipelineRuntimeInput
        }
      },
      source: {
        type: (formikValueTriggerType as unknown) as NGTriggerSource['type'],
        spec: {
          type: formikValueSourceRepo,
          spec: { repoUrl, event, actions: actionsValues }
        }
      }
    }

    if (!isEmpty(payloadConditions) && triggerJson.source?.spec) {
      triggerJson.source.spec.spec.payloadConditions = payloadConditions
    }
    if (triggerIdentifier && onEditInitialValues?.identifier) {
      const { status, data } = await updateTrigger(stringify({ trigger: clearNullUndefined(triggerJson) }) as any)
      if (status === ResponseStatus.SUCCESS) {
        showSuccess(`Successfully updated ${data?.name}.`)
        history.push(
          routes.toCDTriggersPage({
            accountId,
            orgIdentifier,
            projectIdentifier,
            pipelineIdentifier
          })
        )
      }
      // error flow sent to Wizard
    } else {
      const { status, data } = await createTrigger(stringify({ trigger: clearNullUndefined(triggerJson) }) as any)
      if (status === ResponseStatus.SUCCESS) {
        showSuccess(`Successfully created ${data?.name}.`)
        history.push(
          routes.toCDTriggersPage({
            accountId,
            orgIdentifier,
            projectIdentifier,
            pipelineIdentifier
          })
        )
      }
    }
  }

  const validationSchema = Yup.object().shape({
    name: Yup.string().trim().required('Trigger Name is required.'),
    identifier: Yup.string().trim().required('Identifier is required.'),
    event: Yup.string().trim().nullable().required('Event is required.'),
    repoUrl: Yup.string().trim().required('Repository URL is required.'),
    actions: Yup.array().test('Actions is required.', 'Actions is required.', function (actions) {
      return !isUndefined(actions)
    })
  })
  const initialValues: FlatInitialValuesInterface = Object.assign(
    {
      triggerType: (triggerTypeOnNew as unknown) as NGTriggerSource['type'],
      sourceRepo: sourceRepoOnNew,
      identifier: '',
      tags: {},
      pipeline: currentPipeline?.pipeline,
      originalPipeline
    },
    onEditInitialValues
  )
  const wizardMap =
    initialValues.sourceRepo && initialValues.triggerType
      ? getWizardMap({ triggerType: initialValues.triggerType, getString, triggerName: initialValues?.name })
      : undefined
  const errorToasterMessage =
    ((createTriggerErrorResponse?.data as unknown) as { message?: string })?.message ||
    ((updateTriggerErrorResponse?.data as unknown) as { message?: string })?.message
  // ((getTriggerErrorResponse?.data as unknown) as { message?: string })?.message

  const renderWebhookWizard = (): JSX.Element | undefined => {
    const isEdit = !!onEditInitialValues?.identifier
    if (!wizardMap) return undefined
    return (
      <Wizard
        formikInitialProps={{
          initialValues,
          onSubmit: (val: FlatValidFormikValuesInterface) => handleSubmit(val),
          validateOnBlur: false,
          validateOnChange: false,
          validationSchema,
          enableReinitialize: true
        }}
        wizardMap={wizardMap}
        tabWidth="218px"
        onHide={returnToTriggersPage}
        // defaultTabId="Conditions"
        submitLabel={
          isEdit ? getString('pipeline-triggers.updateTrigger') : getString('pipeline-triggers.createTrigger')
        }
        disableSubmit={loadingGetTrigger || createTriggerLoading || updateTriggerLoading}
        isEdit={isEdit}
        errorToasterMessage={errorToasterMessage}
      >
        <WebhookTriggerConfigPanel />
        <WebhookConditionsPanel />
        <WebhookPipelineInputPanel />
      </Wizard>
    )
  }

  if (initialValues?.triggerType && !Object.values(TriggerTypes).includes(initialValues.triggerType)) {
    return (
      <Layout.Vertical spacing="medium" padding="medium">
        <Page.Body>
          <h2>{getString('pipeline-triggers.pageNotFound')}</h2>
        </Page.Body>
      </Layout.Vertical>
    )
  }

  return triggerIdentifier && !wizardMap ? (
    <div style={{ position: 'relative', height: 'calc(100vh - 128px)' }}>
      <PageSpinner />
    </div>
  ) : (
    <>
      <Page.Body>
        {!loadingGetTrigger && getTriggerErrorMessage && <PageError message={getTriggerErrorMessage} />}
        {initialValues.triggerType === TriggerTypes.WEBHOOK && renderWebhookWizard()}
      </Page.Body>
    </>
  )
}
export default TriggersWizardPage
