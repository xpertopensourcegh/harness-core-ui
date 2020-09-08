import React from 'react'
import {
  Text,
  Container,
  Formik,
  FormikForm,
  FormInput,
  Collapse,
  Button,
  CardBody,
  Card,
  CardSelectType,
  CardSelect,
  Label
} from '@wings-software/uikit'
import * as Yup from 'yup'
import type { IconName } from '@blueprintjs/core'
import type { StageElementWrapper } from 'services/cd-ng'
import i18n from '../StageBuilder.i18n'
import { MapStepTypeToIcon, StageType, getTypeOfStage } from '../StageBuilderUtil'
import css from '../StageBuilder.module.scss'

const collapseProps = {
  collapsedIcon: 'small-plus' as IconName,
  expandedIcon: 'small-minus' as IconName,
  isOpen: false,
  isRemovable: false,
  className: 'collapse',
  heading: i18n.description
}

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
  const type = data ? getTypeOfStage(data.stage).type : StageType.DEPLOY
  return (
    <div className={css.stageCreate}>
      {!context && (
        <Text icon={MapStepTypeToIcon[type]} iconProps={{ size: 16 }}>
          {i18n.aboutYourStage}
        </Text>
      )}
      <Container padding="medium">
        <Formik
          initialValues={{
            identifier: data?.stage.identifier,
            name: data?.stage.name,
            description: data?.stage.description,
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
            if (context && data) {
              onChange?.(values)
            }
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().required(i18n.stageNameRequired)
          })}
        >
          {formikProps => {
            return (
              <FormikForm>
                <FormInput.InputWithIdentifier inputLabel={i18n.stageName} />
                <div className={css.collapseDiv}>
                  <Collapse {...collapseProps}>
                    <FormInput.TextArea name="description" />
                  </Collapse>
                </div>
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
  )
}
