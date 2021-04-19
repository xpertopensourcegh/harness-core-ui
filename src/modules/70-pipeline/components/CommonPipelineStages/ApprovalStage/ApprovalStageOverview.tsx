import React, { useCallback, useRef } from 'react'
import cx from 'classnames'
import * as Yup from 'yup'
import { Formik } from 'formik'
import { cloneDeep, debounce } from 'lodash-es'
import { Accordion, Card, Container, FormikForm } from '@wings-software/uicore'
import Timeline from '@common/components/Timeline/Timeline'
import { NameIdDescriptionTags } from '@common/components/NameIdDescriptionTags/NameIdDescriptionTags'
import { useStrings } from 'framework/exports'
import { PipelineContext } from '@pipeline/components/PipelineStudio/PipelineContext/PipelineContext'
import { isDuplicateStageId } from '@pipeline/components/PipelineStudio/StageBuilder/StageBuilderUtil'
import { StepWidget } from '@pipeline/components/AbstractSteps/StepWidget'
import type { CustomVariablesData } from '@pipeline/components/PipelineSteps/Steps/CustomVariables/CustomVariableEditable'
import type { StageElementConfig, StageElementWrapper } from 'services/cd-ng'
import { StepViewType } from '@pipeline/components/AbstractSteps/Step'
import { StepType } from '@pipeline/components/PipelineSteps/PipelineStepInterface'
import { usePipelineVariables } from '@pipeline/components/PipelineVariablesContext/PipelineVariablesContext'
import SkipConditionsPanel from '@pipeline/components/PipelineSteps/AdvancedSteps/SkipConditionsPanel/SkipConditionsPanel'
import { Modes } from '@pipeline/components/PipelineSteps/AdvancedSteps/common'
import type { AllNGVariables } from '@pipeline/utils/types'
import { illegalIdentifiers, regexIdentifier } from '@common/utils/StringUtils'
import type { ApprovalStageOverviewProps } from './types'
import css from './ApprovalStageOverview.module.scss'

export const ApprovalStageOverview: React.FC<ApprovalStageOverviewProps> = props => {
  const {
    state: {
      pipeline: { stages = [] },
      selectionState: { selectedStageId }
    },
    stepsFactory,
    isReadonly,
    updateStage,
    getStageFromPipeline
  } = React.useContext(PipelineContext)
  const { variablesPipeline, metadataMap } = usePipelineVariables()
  const { stage } = getStageFromPipeline(selectedStageId || '')
  const cloneOriginalData = cloneDeep(stage)

  const { getString } = useStrings()
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const onTimelineItemClick = (id: string): void => {
    const element = document.querySelector(`#${id}`)
    if (scrollRef.current && typeof scrollRef.current.scrollTo === 'function' && element) {
      const elementTop = element.getBoundingClientRect().top
      const parentTop = scrollRef.current.getBoundingClientRect().top
      scrollRef.current.scrollTo({ top: elementTop - parentTop, behavior: 'smooth' })
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateStageDebounced = useCallback(
    debounce((values: StageElementWrapper): void => {
      updateStage({ ...stage?.stage, ...values })
    }, 300),
    [stage?.stage, updateStage]
  )

  const getTimelineNodes = useCallback(
    () => [
      {
        label: 'Stage Overview',
        id: 'stageOverview'
      },
      {
        label: 'Stage Variables',
        id: 'variables-panel'
      },
      {
        label: 'Skip Condition',
        id: 'skipCondition-panel'
      }
    ],
    []
  )

  return (
    <div className={cx(css.approvalStageOverviewWrapper, css.stageSection)}>
      <Timeline onNodeClick={onTimelineItemClick} nodes={getTimelineNodes()} />
      <div className={css.content} ref={scrollRef}>
        <div className={css.tabHeading} id="stageOverview">
          {getString('stageOverview')}
        </div>
        <Container id="stageOverview" className={css.basicOverviewDetails}>
          <Formik
            enableReinitialize
            initialValues={{
              identifier: cloneOriginalData?.stage.identifier,
              name: cloneOriginalData?.stage.name,
              description: cloneOriginalData?.stage.description,
              skipCondition: cloneOriginalData?.stage.skipCondition,
              tags: cloneOriginalData?.stage.tags || {}
            }}
            validationSchema={{
              name: Yup.string().trim().required(getString('approvalStage.stageNameRequired')),
              identifier: Yup.string().when('name', {
                is: val => val?.length,
                then: Yup.string()
                  .required(getString('validation.identifierRequired'))
                  .matches(regexIdentifier, getString('validation.validIdRegex'))
                  .notOneOf(illegalIdentifiers)
              })
            }}
            validate={values => {
              const errors: { name?: string } = {}
              if (isDuplicateStageId(values.identifier, stages)) {
                errors.name = getString('validation.identifierDuplicate')
              }
              if (cloneOriginalData) {
                updateStageDebounced({
                  ...cloneOriginalData.stage,
                  name: values?.name,
                  identifier: values?.identifier,
                  description: values?.description,
                  skipCondition: values?.skipCondition
                })
              }
              return errors
            }}
            onSubmit={values => {
              if (cloneOriginalData) {
                updateStageDebounced({
                  ...cloneOriginalData.stage,
                  name: values?.name,
                  identifier: values?.identifier,
                  description: values?.description,
                  skipCondition: values?.skipCondition
                })
              }
            }}
          >
            {formikProps => (
              <FormikForm>
                <Card className={cx(css.sectionCard, css.shadow)}>
                  <NameIdDescriptionTags
                    formikProps={formikProps}
                    descriptionProps={{
                      disabled: isReadonly
                    }}
                    identifierProps={{
                      isIdentifierEditable: false,
                      inputGroupProps: { disabled: isReadonly }
                    }}
                    tagsProps={{
                      disabled: isReadonly
                    }}
                  />
                </Card>
              </FormikForm>
            )}
          </Formik>
        </Container>

        <Accordion className={cx(css.sectionCard, css.shadow)} activeId="variables">
          <Accordion.Panel
            id="variables"
            summary={'Variables'}
            addDomId={true}
            details={
              <StepWidget<CustomVariablesData>
                factory={stepsFactory}
                readonly={isReadonly}
                initialValues={{
                  variables: ((cloneOriginalData?.stage as StageElementConfig)?.variables || []) as AllNGVariables[],
                  canAddVariable: true
                }}
                type={StepType.CustomVariable}
                stepViewType={StepViewType.StageVariable}
                onUpdate={({ variables }: CustomVariablesData) => {
                  updateStageDebounced({
                    ...cloneOriginalData?.stage,
                    variables
                  })
                }}
                customStepProps={{
                  yamlProperties:
                    getStageFromPipeline(
                      cloneOriginalData?.stage?.identifier,
                      variablesPipeline
                    )?.stage?.variables?.map?.(
                      (variable: AllNGVariables) => metadataMap[variable.value || '']?.yamlProperties || {}
                    ) || []
                }}
              />
            }
          />
        </Accordion>

        <Accordion className={cx(css.sectionCard, css.shadow)} activeId="skipCondition">
          <Accordion.Panel
            id="skipCondition"
            summary={'Skip Condition'}
            addDomId={true}
            details={
              <Formik
                initialValues={{
                  skipCondition: cloneOriginalData?.stage?.skipCondition || ''
                }}
                validate={values => {
                  if (cloneOriginalData) {
                    updateStageDebounced({
                      ...cloneOriginalData.stage,
                      skipCondition: values?.skipCondition
                    })
                  }
                }}
                onSubmit={values => {
                  updateStageDebounced({
                    ...cloneOriginalData?.stage,
                    skipCondition: values?.skipCondition
                  })
                }}
              >
                <SkipConditionsPanel isReadonly={isReadonly} mode={Modes.STAGE} />
              </Formik>
            }
          />
        </Accordion>
        {props.children}
      </div>
    </div>
  )
}
