import React from 'react'
import { loggerFor, ModuleName } from 'framework/exports'
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
} from '@wings-software/uikit'
import * as Yup from 'yup'
import css from './PipelineCreate.module.scss'
import i18n from './PipelineCreate.i18n'
import type { CDPipelineDTO } from 'services/cd-ng'
import { DefaultNewPipelineId } from '../PipelineContext/PipelineActions'
import image1 from './images/first.png'
import image2 from './images/second.png'
import image3 from './images/third.png'

const logger = loggerFor(ModuleName.CD)
const collapseProps = {
  collapsedIcon: 'small-plus' as IconName,
  expandedIcon: 'small-minus' as IconName,
  isOpen: false,
  isRemovable: false,
  className: 'collapse'
}

interface PipelineCreateProps {
  afterSave?: (values: CDPipelineDTO) => void
  initialValues?: CDPipelineDTO
  closeModal?: () => void
}

const descriptionCollapseProps = Object.assign({}, collapseProps, { heading: i18n.description })
const tagCollapseProps = Object.assign({}, collapseProps, { heading: i18n.tags })

export default function CreatePipelines({
  afterSave,
  initialValues = { identifier: '', name: '' },
  closeModal
}: PipelineCreateProps): JSX.Element {
  const identifier = initialValues?.identifier
  if (identifier === DefaultNewPipelineId) {
    initialValues.identifier = ''
  }
  const isEdit = (initialValues?.identifier?.length || '') > 0
  return (
    <Container padding="small" className={css.container}>
      {isEdit && <Button icon="cross" minimal className={css.closeModal} onClick={closeModal} />}
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
            <FormikForm>
              <div className={css.formInput}>
                <FormInput.InputWithIdentifier
                  isIdentifierEditable={!isEdit}
                  inputLabel={i18n.pipelineNameLabel}
                  inputGroupProps={{ placeholder: i18n.pipelineNamePlaceholder }}
                />
                <div className={css.collapseDiv}>
                  <Collapse {...descriptionCollapseProps}>
                    <FormInput.TextArea name="description" />
                  </Collapse>
                </div>
                <div className={css.collapseDiv}>
                  <Collapse {...tagCollapseProps}>
                    <FormInput.TagInput
                      name="tags"
                      items={['pipeline', 'canary']}
                      labelFor={name => (typeof name === 'string' ? name : '')}
                      itemFromNewTag={newTag => newTag}
                      tagInputProps={{
                        noInputBorder: true,
                        openOnKeyDown: false,
                        showAddTagButton: true,
                        showClearAllButton: true,
                        allowNewTag: true,
                        placeholder: i18n.enterTags,
                        getTagProps: (value, _index, _selectedItems, createdItems) => {
                          return createdItems.includes(value)
                            ? { intent: 'danger', minimal: true }
                            : { intent: 'primary', minimal: true }
                        }
                      }}
                    />
                  </Collapse>
                </div>
              </div>
              <Button intent="primary" className={css.startBtn} type="submit" text={isEdit ? i18n.save : i18n.start} />
            </FormikForm>
          </Formik>
        </div>
        <Carousel>
          <div className={css.helpImages}>
            <img src={image1} />
            <div>
              <Text font={{ weight: 'bold' }} padding={{ bottom: 'small' }}>
                {i18n.pipelineConcepts}
              </Text>
              <Text>{i18n.concept1}</Text>
            </div>
          </div>
          <div className={css.helpImages}>
            <img src={image2} />
            <div>
              <Text font={{ weight: 'bold' }} padding={{ bottom: 'small' }}>
                {i18n.pipelineConcepts}
              </Text>
              <Text>{i18n.concept1}</Text>
            </div>
          </div>
          <div className={css.helpImages}>
            <img src={image3} />
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
