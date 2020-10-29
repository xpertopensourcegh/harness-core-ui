import React from 'react'
import { Text, Container, Formik, FormikForm, FormInput, Collapse, Button } from '@wings-software/uikit'
import * as Yup from 'yup'
import type { IconName } from '@blueprintjs/core'
import type { StageElementWrapper } from 'services/cd-ng'
import i18n from './EditStageView.i18n'
import css from './EditStageView.module.scss'

const collapseProps = {
  collapsedIcon: 'small-plus' as IconName,
  expandedIcon: 'small-minus' as IconName,
  isOpen: false,
  isRemovable: false,
  className: 'collapse',
  heading: i18n.description
}

export interface EditStageView {
  data?: StageElementWrapper
  onSubmit?: (values: StageElementWrapper, identifier: string) => void
  onChange?: (values: StageElementWrapper) => void
  context?: string
}

export const EditStageView: React.FC<EditStageView> = ({ data, onSubmit, context, onChange }): JSX.Element => {
  return (
    <div className={css.stageCreate}>
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
            description: data?.stage.description
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
                  <Collapse
                    {...collapseProps}
                    isOpen={(formikProps.values.description && formikProps.values.description?.length > 0) || false}
                  >
                    <FormInput.TextArea name="description" />
                  </Collapse>
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
