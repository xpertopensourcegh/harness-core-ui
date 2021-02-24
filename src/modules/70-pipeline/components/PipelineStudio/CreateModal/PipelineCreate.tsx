import React from 'react'
import { Container, Formik, FormikForm, Button, Text } from '@wings-software/uicore'
import * as Yup from 'yup'

import { loggerFor, ModuleName, useStrings } from 'framework/exports'
import type { NgPipeline } from 'services/cd-ng'

import { StringUtils } from '@common/exports'
import { NameIdDescriptionTags } from '@common/components'
import { DefaultNewPipelineId } from '../PipelineContext/PipelineActions'

import i18n from './PipelineCreate.i18n'
import css from './PipelineCreate.module.scss'

const logger = loggerFor(ModuleName.CD)

export interface PipelineCreateProps {
  afterSave?: (values: NgPipeline) => void
  initialValues?: NgPipeline
  closeModal?: () => void
}

export default function CreatePipelines({
  afterSave,
  initialValues = { identifier: '', name: '', description: '', tags: {} },
  closeModal
}: PipelineCreateProps): JSX.Element {
  const { getString } = useStrings()

  const identifier = initialValues?.identifier
  if (identifier === DefaultNewPipelineId) {
    initialValues.identifier = ''
  }
  const isEdit = (initialValues?.identifier?.length || '') > 0
  return (
    <Container className={css.container}>
      <Button icon="cross" minimal className={css.closeModal} onClick={closeModal} />
      <div className={css.heading}>{isEdit ? getString('editPipeline') : getString('moduleRenderer.newPipeLine')}</div>
      <Container padding="xsmall" className={css.layout}>
        <div>
          {!isEdit && <Text className={css.helpText}>{getString('craetePipelineSubtitle')}</Text>}
          <Formik
            initialValues={initialValues}
            validationSchema={Yup.object().shape({
              name: Yup.string().trim().required(i18n.pipelineNameRequired),
              identifier: Yup.string().when('name', {
                is: val => val?.length,
                then: Yup.string()
                  .trim()
                  .required(getString('validation.identifierRequired'))
                  .matches(/^(?![0-9])[0-9a-zA-Z_$]*$/, getString('validation.validIdRegex'))
                  .notOneOf(StringUtils.illegalIdentifiers)
              })
            })}
            onSubmit={values => {
              logger.info(JSON.stringify(values))
              afterSave && afterSave(values)
            }}
          >
            {formikProps => (
              <FormikForm>
                <div className={css.formInput}>
                  <NameIdDescriptionTags
                    formikProps={formikProps}
                    identifierProps={{
                      isIdentifierEditable: !isEdit
                    }}
                  />
                </div>
                <Button
                  intent="primary"
                  className={css.startBtn}
                  type="submit"
                  text={isEdit ? i18n.save : i18n.start}
                />
              </FormikForm>
            )}
          </Formik>
        </div>
      </Container>
    </Container>
  )
}
