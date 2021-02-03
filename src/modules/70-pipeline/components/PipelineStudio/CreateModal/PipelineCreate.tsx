import React from 'react'
import { Container, Heading, Formik, FormikForm, Button, Text, Carousel } from '@wings-software/uicore'
import * as Yup from 'yup'
import { useParams } from 'react-router-dom'
import { loggerFor, ModuleName, useStrings } from 'framework/exports'
import type { NgPipeline } from 'services/cd-ng'
import type { PipelineType } from '@common/interfaces/RouteInterfaces'
import { StringUtils } from '@common/exports'
import { NameIdDescriptionTags } from '@common/components'
import { DefaultNewPipelineId } from '../PipelineContext/PipelineActions'
import image1 from './images/first.png'
import image2 from './images/second.png'
import image3 from './images/third.png'
import ciSteps from './images/ci-steps.svg'
import pipelineStudio from './images/pipeline-studio.svg'
import testIntelligence from './images/test-intelligence.svg'
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
  const { module } = useParams<PipelineType<{ module: string; pipelineIdentifier: string }>>()
  const { getString } = useStrings()

  const identifier = initialValues?.identifier
  if (identifier === DefaultNewPipelineId) {
    initialValues.identifier = ''
  }
  const isEdit = (initialValues?.identifier?.length || '') > 0
  return (
    <Container className={css.container}>
      <Button icon="cross" minimal className={css.closeModal} onClick={closeModal} />
      <Heading className={css.heading} level={2}>
        {isEdit ? i18n.pipelineEdit : i18n.welcomeToPipelineStudio}
      </Heading>
      <Container padding="xsmall" className={css.layout}>
        <div>
          {!isEdit && <Text className={css.helpText}>{i18n.letsStart}</Text>}
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
        <Carousel>
          <div className={css.helpImages}>
            <img src={module === 'ci' ? pipelineStudio : image1} />
            <div>
              <Text font={{ weight: 'bold' }} padding={{ bottom: 'small' }}>
                {module === 'ci' ? i18n.ciItem1Title : i18n.pipelineConcepts}
              </Text>
              <Text>{module === 'ci' ? i18n.ciItem1Description : i18n.concept1}</Text>
            </div>
          </div>
          <div className={css.helpImages}>
            <img src={module === 'ci' ? testIntelligence : image2} />
            <div>
              <Text font={{ weight: 'bold' }} padding={{ bottom: 'small' }}>
                {module === 'ci' ? i18n.ciItem2Title : i18n.pipelineConcepts}
              </Text>
              <Text>{module === 'ci' ? i18n.ciItem2Description : i18n.concept1}</Text>
            </div>
          </div>
          <div className={css.helpImages}>
            <img src={module === 'ci' ? ciSteps : image3} />
            <div>
              <Text font={{ weight: 'bold' }} padding={{ bottom: 'small' }}>
                {module === 'ci' ? i18n.ciItem3Title : i18n.pipelineConcepts}
              </Text>
              <Text>{module === 'ci' ? i18n.ciItem3Description : i18n.concept1}</Text>
            </div>
          </div>
        </Carousel>
      </Container>
    </Container>
  )
}
