import React from 'react'
import {
  Container,
  Heading,
  Formik,
  FormikForm,
  FormInput,
  Button,
  Collapse,
  IconName,
  Text,
  Carousel
} from '@wings-software/uicore'
import * as Yup from 'yup'
import isEmpty from 'lodash-es/isEmpty'
import { useParams } from 'react-router-dom'
import { loggerFor, ModuleName } from 'framework/exports'
import type { NgPipeline } from 'services/cd-ng'
import type { PipelineType } from '@common/interfaces/RouteInterfaces'
import i18n from './PipelineCreate.i18n'
import { DefaultNewPipelineId } from '../PipelineContext/PipelineActions'
import image1 from './images/first.png'
import image2 from './images/second.png'
import image3 from './images/third.png'
import ciSteps from './images/ci-steps.svg'
import pipelineStudio from './images/pipeline-studio.svg'
import testIntelligence from './images/test-intelligence.svg'
import css from './PipelineCreate.module.scss'

const logger = loggerFor(ModuleName.CD)
const collapseProps = {
  collapsedIcon: 'small-plus' as IconName,
  expandedIcon: 'small-minus' as IconName,
  isOpen: false,
  isRemovable: false,
  className: 'collapse'
}

export interface PipelineCreateProps {
  afterSave?: (values: NgPipeline) => void
  initialValues?: NgPipeline
  closeModal?: () => void
}

const descriptionCollapseProps = Object.assign({}, collapseProps, { heading: i18n.description })
const tagCollapseProps = Object.assign({}, collapseProps, { heading: i18n.tags })

export default function CreatePipelines({
  afterSave,
  initialValues = { identifier: '', name: '', description: '', tags: {} },
  closeModal
}: PipelineCreateProps): JSX.Element {
  const { module } = useParams<PipelineType<any>>()

  const identifier = initialValues?.identifier
  if (identifier === DefaultNewPipelineId) {
    initialValues.identifier = ''
  }
  const isEdit = (initialValues?.identifier?.length || '') > 0
  return (
    <Container padding="small" className={css.container}>
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
              name: Yup.string().trim().required(i18n.pipelineNameRequired)
            })}
            onSubmit={values => {
              logger.info(JSON.stringify(values))
              afterSave && afterSave(values)
            }}
          >
            {({ values }) => (
              <FormikForm>
                <div className={css.formInput}>
                  <FormInput.InputWithIdentifier
                    isIdentifierEditable={!isEdit}
                    inputLabel={i18n.pipelineNameLabel}
                    inputGroupProps={{ placeholder: i18n.pipelineNamePlaceholder }}
                  />
                  <div className={css.collapseDiv}>
                    <Collapse
                      {...descriptionCollapseProps}
                      isOpen={(values.description && values.description?.length > 0) || false}
                    >
                      <FormInput.TextArea name="description" />
                    </Collapse>
                  </div>
                  <div className={css.collapseDiv}>
                    <Collapse {...tagCollapseProps} isOpen={!isEmpty(values?.tags)}>
                      <FormInput.KVTagInput name="tags" />
                    </Collapse>
                  </div>
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
                {i18n.pipelineConcepts}
              </Text>
              <Text>{i18n.concept1}</Text>
            </div>
          </div>
          <div className={css.helpImages}>
            <img src={module === 'ci' ? testIntelligence : image2} />
            <div>
              <Text font={{ weight: 'bold' }} padding={{ bottom: 'small' }}>
                {i18n.pipelineConcepts}
              </Text>
              <Text>{i18n.concept1}</Text>
            </div>
          </div>
          <div className={css.helpImages}>
            <img src={module === 'ci' ? ciSteps : image3} />
            <div>
              <Text font={{ weight: 'bold' }} padding={{ bottom: 'small' }}>
                {i18n.pipelineConcepts}
              </Text>
              <Text>{i18n.concept1}</Text>
            </div>
          </div>
        </Carousel>
      </Container>
    </Container>
  )
}
