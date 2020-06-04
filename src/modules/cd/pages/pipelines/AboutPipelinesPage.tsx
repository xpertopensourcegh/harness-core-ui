import React from 'react'
import { loggerFor, ModuleName } from 'framework/exports'
import { Container, Heading, Formik, FormikForm, FormInput, Button, Collapse, IconName } from '@wings-software/uikit'
import css from './AboutPipelinesPage.module.scss'
import i18n from './AboutPipelinesPage.i18n'

const logger = loggerFor(ModuleName.CD)
const collapseProps = {
  collapsedIcon: 'small-plus' as IconName,
  expandedIcon: 'small-minus' as IconName,
  isOpen: false,
  isRemovable: false,
  className: 'collapse'
}

const descriptionCollapseProps = Object.assign({}, collapseProps, { heading: i18n.description })
const tagCollapseProps = Object.assign({}, collapseProps, { heading: i18n.tags })

export default function AboutPipelinesPage(): JSX.Element {
  logger.debug('Mounting About Pipelibnes...')

  return (
    <Container padding="xsmall" className={css.container}>
      <Heading level={2}>{i18n.aboutThePipelines}</Heading>
      <Container padding="large">
        <Formik
          initialValues={{ name: '', description: '', tags: [''] }}
          onSubmit={values =>
            new Promise(resolve => {
              setTimeout(() => {
                logger.info(JSON.stringify(values))
                resolve(values)
              }, 5000)
            })
          }
        >
          <FormikForm>
            <FormInput.Text name="name" label={i18n.nameYourPipeline} placeholder={i18n.pipelineName} />
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
            <Button intent="primary" type="submit" text={i18n.submit} />
          </FormikForm>
        </Formik>
      </Container>
    </Container>
  )
}
