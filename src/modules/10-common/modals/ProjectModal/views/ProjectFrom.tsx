import React from 'react'
import {
  Formik,
  FormikForm as Form,
  FormInput,
  Button,
  Text,
  Layout,
  StepProps,
  Collapse,
  IconName,
  SelectOption,
  Container,
  Color,
  ModalErrorHandler,
  ModalErrorHandlerBinding
} from '@wings-software/uikit'
import * as Yup from 'yup'
import ProjectCard from '@common/pages/ProjectsPage/views/ProjectCard/ProjectCard'
import i18n from '@common/pages/ProjectsPage/ProjectsPage.i18n'
import { illegalIdentifiers } from '@common/utils/StringUtils'
import type { Project } from 'services/cd-ng'
import css from './Steps.module.scss'

interface ProjectModalData {
  data?: Project
  disableSelect: boolean
  disableSubmit: boolean
  enableEdit: boolean
  title: string
  initialOrgIdentifier: string
  initialModules?: Project['modules']
  onComplete: (project: Project) => Promise<void>
  organisationItems: SelectOption[]
  setModalErrorHandler: (modalErrorHandler: ModalErrorHandlerBinding) => void
}

interface AboutPageData extends Project {
  preview?: boolean
}

const collapseProps = {
  collapsedIcon: 'small-plus' as IconName,
  expandedIcon: 'small-minus' as IconName,
  isRemovable: false,
  className: 'collapse'
}
const descriptionCollapseProps = Object.assign({}, collapseProps, { heading: i18n.newProjectWizard.aboutProject.desc })
const tagCollapseProps = Object.assign({}, collapseProps, { heading: i18n.newProjectWizard.aboutProject.tags })

const ProjectForm: React.FC<StepProps<Project> & ProjectModalData> = props => {
  const {
    data: projectData,
    title,
    enableEdit,
    onComplete,
    disableSelect,
    disableSubmit,
    organisationItems,
    initialOrgIdentifier,
    initialModules,
    setModalErrorHandler
  } = props
  return (
    <Formik
      initialValues={{
        color: '#0063F7',
        identifier: '',
        name: '',
        orgIdentifier: initialOrgIdentifier,
        modules: initialModules,
        description: '',
        tags: [],
        ...projectData
      }}
      validationSchema={Yup.object().shape({
        name: Yup.string()
          .trim()
          .required(i18n.newProjectWizard.aboutProject.errorName)
          .matches(/^[A-Za-z0-9_-][A-Za-z0-9 _-]*$/, i18n.newProjectWizard.aboutProject.validationNameChars),
        identifier: Yup.string().when('name', {
          is: val => val?.length,
          then: Yup.string()
            .required(i18n.newProjectWizard.aboutProject.errorIdentifier)
            .matches(/^(?![0-9])[0-9a-zA-Z_$]*$/, i18n.newProjectWizard.aboutProject.validationIdentifierChars)
            .notOneOf(illegalIdentifiers)
        }),
        orgIdentifier: Yup.string().required(i18n.newProjectWizard.aboutProject.errorOrganisation)
      })}
      onSubmit={(values: AboutPageData) => {
        onComplete(values)
      }}
    >
      {formikProps => {
        return (
          <Form>
            <Layout.Horizontal>
              <Layout.Vertical width="50%" padding="xxlarge">
                <Container style={{ minHeight: '450px' }}>
                  <Layout.Horizontal padding={{ bottom: 'large' }}>
                    <Text font="medium" color={Color.BLACK}>
                      {title}
                    </Text>
                  </Layout.Horizontal>
                  <ModalErrorHandler bind={setModalErrorHandler} />
                  <FormInput.InputWithIdentifier isIdentifierEditable={enableEdit} />
                  <Layout.Horizontal spacing="small">
                    <FormInput.ColorPicker
                      label={i18n.newProjectWizard.aboutProject.color}
                      name="color"
                      height={38}
                      color={formikProps.initialValues.color}
                    />
                    <FormInput.Select
                      label={i18n.newProjectWizard.aboutProject.org}
                      name="orgIdentifier"
                      items={organisationItems}
                      disabled={disableSelect}
                    />
                  </Layout.Horizontal>
                  <div className={css.collapseDiv}>
                    <Collapse
                      isOpen={formikProps.values.description === '' ? false : true}
                      {...descriptionCollapseProps}
                    >
                      <FormInput.TextArea name="description" className={css.desc} />
                    </Collapse>
                  </div>
                  <div className={css.collapseDiv}>
                    <Collapse isOpen={formikProps.values.tags?.length ? true : false} {...tagCollapseProps}>
                      <FormInput.TagInput
                        name="tags"
                        items={[]}
                        labelFor={/* istanbul ignore next */ name => name as string}
                        itemFromNewTag={/* istanbul ignore next */ newTag => newTag}
                        tagInputProps={{
                          showClearAllButton: true,
                          allowNewTag: true,
                          placeholder: i18n.newProjectWizard.aboutProject.addTags
                        }}
                      />
                    </Collapse>
                  </div>
                </Container>
                <Layout.Horizontal>
                  <Button
                    className={css.button}
                    text={i18n.newProjectWizard.saveAndContinue}
                    type="submit"
                    disabled={disableSubmit}
                  />
                </Layout.Horizontal>
              </Layout.Vertical>
              <Container width="50%" flex={{ align: 'center-center' }} className={css.preview}>
                <ProjectCard data={formikProps.values} isPreview={true} />
              </Container>
            </Layout.Horizontal>
          </Form>
        )
      }}
    </Formik>
  )
}

export default ProjectForm
