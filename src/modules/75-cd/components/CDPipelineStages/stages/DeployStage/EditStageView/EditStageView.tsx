import React from 'react'
import {
  Text,
  Container,
  Formik,
  FormikForm,
  FormInput,
  Button,
  CardBody,
  Card,
  CardSelectType,
  CardSelect,
  Label,
  Layout,
  Link,
  TextInput
} from '@wings-software/uicore'
import cx from 'classnames'
import * as Yup from 'yup'
import type { IconName } from '@blueprintjs/core'
import type { StageElementWrapper } from 'services/cd-ng'
import { useStrings, String } from 'framework/exports'
import { StepType } from '@pipeline/components/PipelineSteps/PipelineStepInterface'
import type { CustomVariablesData } from '@pipeline/components/PipelineSteps/Steps/CustomVariables/CustomVariableEditable'
import { StepWidget } from '@pipeline/components/AbstractSteps/StepWidget'
import { StepViewType } from '@pipeline/components/AbstractSteps/Step'
import {
  usePipelineContext,
  PipelineContext
} from '@pipeline/components/PipelineStudio/PipelineContext/PipelineContext'

import { isDuplicateStageId } from '@pipeline/components/PipelineStudio/StageBuilder/StageBuilderUtil'
import i18n from './EditStageView.i18n'
import css from './EditStageView.module.scss'
const newStageData = [
  {
    text: i18n.service,
    value: 'service',
    icon: 'service',
    disabled: false
  },
  {
    text: i18n.multipleService,
    value: 'multiple-service',
    icon: 'multi-service',
    disabled: true
  },
  {
    text: i18n.functions,
    value: 'functions',
    icon: 'functions',
    disabled: true
  },
  {
    text: i18n.otherWorkloads,
    value: 'other-workloads',
    icon: 'other-workload',
    disabled: true
  }
]

export interface EditStageView {
  data?: StageElementWrapper
  onSubmit?: (values: StageElementWrapper, identifier: string) => void
  onChange?: (values: StageElementWrapper) => void
  context?: string
}

export const EditStageView: React.FC<EditStageView> = ({ data, onSubmit, context, onChange }): JSX.Element => {
  const {
    state: {
      pipeline: { stages = [] }
    }
  } = React.useContext(PipelineContext)
  const [isDescriptionVisible, toggleDescription] = React.useState(!!data?.stage?.description)
  const { stepsFactory } = usePipelineContext()

  const removeDescription = (values: any) => {
    onChange?.({ ...values, description: '' })
    toggleDescription(false)
  }

  const { getString } = useStrings()

  return (
    <>
      <div className={css.stageSection}>
        {context && <Layout.Vertical className={css.tabHeading}>{i18n.stageDetails}</Layout.Vertical>}
        <div className={cx({ [css.stageCreate]: true, [css.stageDetails]: !!context })}>
          {!context && (
            <Text icon="pipeline-deploy" iconProps={{ size: 16 }}>
              {i18n.aboutYourStage}
            </Text>
          )}
          <Container padding="medium">
            <Formik
              initialValues={{
                identifier: data?.stage.identifier,
                name: data?.stage.name,
                description: data?.stage.description,
                skipCondition: data?.stage.skipCondition,
                serviceType: newStageData[0]
              }}
              onSubmit={values => {
                if (data) {
                  data.stage.identifier = values.identifier
                  data.stage.name = values.name
                  onSubmit?.(data, values.identifier)
                }
              }}
              validate={values => {
                const errors: { name?: string } = {}
                if (isDuplicateStageId(values.identifier, stages)) {
                  errors.name = getString('validation.identifierDuplicate')
                }
                if (context && data) {
                  onChange?.(values)
                }
                return errors
              }}
              validationSchema={Yup.object().shape({
                name: Yup.string().required(i18n.stageNameRequired)
              })}
            >
              {formikProps => {
                return (
                  <FormikForm>
                    <div className={cx({ [css.inputContainer]: true, [css.sideDescription]: !!context })}>
                      <FormInput.InputWithIdentifier inputLabel={i18n.stageName} />

                      {!isDescriptionVisible && (
                        <Button
                          minimal
                          text={getString('description')}
                          className={css.toggleDesc}
                          icon="plus"
                          onClick={() => toggleDescription(true)}
                        />
                      )}
                    </div>
                    {isDescriptionVisible && (
                      <div>
                        <span
                          onClick={() => removeDescription(formikProps.values)}
                          className={cx({ [css.removeLink]: true, [css.dialogView]: !context })}
                        >
                          {i18n.removeLabel}
                        </span>
                        <FormInput.TextArea
                          name="description"
                          label={getString('description')}
                          style={{ width: context ? 440 : 320 }}
                        />
                      </div>
                    )}
                    <div className={css.labelBold}>
                      <Label>{i18n.whatToDeploy}</Label>
                    </div>
                    <div>
                      <CardSelect
                        type={CardSelectType.Any} // TODO: Remove this by publishing uikit with exported CardSelectType
                        selected={formikProps.values.serviceType}
                        onChange={item => formikProps.setFieldValue('serviceType', item)}
                        renderItem={(item, selected) => (
                          <span
                            onClick={e => {
                              if (item.disabled) {
                                e.stopPropagation()
                              }
                            }}
                          >
                            <Card selected={selected} interactive={!item.disabled} disabled={item.disabled}>
                              <CardBody.Icon icon={item.icon as IconName} iconSize={25} />
                            </Card>
                            <Text
                              font={{
                                size: 'small',
                                align: 'center'
                              }}
                              style={{
                                color: selected ? 'var(--grey-900)' : 'var(--grey-350)'
                              }}
                            >
                              {item.text}
                            </Text>
                          </span>
                        )}
                        data={newStageData}
                        className={css.grid}
                      />
                    </div>

                    {!context && (
                      <div className={css.btnSetup}>
                        <Button
                          type="submit"
                          intent="primary"
                          text={i18n.setupStage}
                          onClick={() => {
                            formikProps.submitForm()
                          }}
                        />
                      </div>
                    )}
                  </FormikForm>
                )
              }}
            </Formik>
          </Container>
        </div>
      </div>
      <div className={css.stageSection}>
        {context && <Layout.Vertical className={css.tabHeading}>{getString('variableLabel')}</Layout.Vertical>}

        <div className={cx({ [css.stageCreate]: true, [css.stageDetails]: !!context })}>
          {context ? (
            <StepWidget<CustomVariablesData>
              factory={stepsFactory}
              initialValues={{
                variables: (data?.stage as any)?.variables || [],
                canAddVariable: true
              }}
              type={StepType.CustomVariable}
              stepViewType={StepViewType.InputVariable}
              onUpdate={({ variables }: CustomVariablesData) => {
                onChange?.({ ...data?.stage, variables } as any)
              }}
            />
          ) : null}
        </div>
      </div>
      {context && (
        <div className={css.stageSection}>
          <Layout.Vertical className={css.tabHeading}>{getString('skipConditionsTitle')}</Layout.Vertical>
          <div className={cx({ [css.stageCreate]: true, [css.stageDetails]: !!context })}>
            <Layout.Vertical>
              <div className={css.labelBold}>
                <Label>
                  <String stringID="skipConditionLabel" />
                </Label>
              </div>
              <div>
                <TextInput
                  name="skipCondition"
                  defaultValue={data?.stage.skipCondition}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    onChange?.({ ...data?.stage, skipCondition: event.target.value } as any)
                  }}
                />
                <Text font="small" style={{ whiteSpace: 'break-spaces' }}>
                  <String stringID="skipConditionText" />
                  <br />
                  <Link font="small" withoutHref>
                    <String stringID="learnMore" />
                  </Link>
                </Text>
              </div>
            </Layout.Vertical>
          </div>
        </div>
      )}
    </>
  )
}
