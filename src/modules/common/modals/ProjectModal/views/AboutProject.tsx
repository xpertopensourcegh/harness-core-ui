import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
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
  ModalErrorHandlerBinding,
  ModalErrorHandler
} from '@wings-software/uikit'
import * as Yup from 'yup'
import { pick } from 'lodash'
import { useAppStoreReader, useAppStoreWriter } from 'framework/exports'
import ProjectCard from 'modules/common/pages/ProjectsPage/views/ProjectCard/ProjectCard'
import i18n from 'modules/common/pages/ProjectsPage/ProjectsPage.i18n'
import { illegalIdentifiers } from 'modules/common/utils/StringUtils'

import { useGetOrganizationList } from 'services/cd-ng'
import type { Project } from 'services/cd-ng'
import { usePutProject, usePostProject } from 'services/cd-ng'
import css from './Steps.module.scss'

interface ProjectModalData {
  data: Project | undefined
  closeModal?: () => void
  onSuccess: (project: Project | undefined) => void
}

interface AboutPageData extends Project {
  preview?: boolean
}

const collapseProps = {
  collapsedIcon: 'small-plus' as IconName,
  expandedIcon: 'small-minus' as IconName,
  isOpen: false,
  isRemovable: false,
  className: 'collapse'
}
const descriptionCollapseProps = Object.assign({}, collapseProps, { heading: i18n.newProjectWizard.aboutProject.desc })
const tagCollapseProps = Object.assign({}, collapseProps, { heading: i18n.newProjectWizard.aboutProject.tags })

const AboutProject: React.FC<StepProps<Project> & ProjectModalData> = props => {
  const { nextStep, data: projectData, closeModal, onSuccess } = props
  const [showPreview, setShowPreview] = useState<boolean>(true)
  const { accountId } = useParams()
  const isEdit = !!props.data && !!props.data.identifier
  const { mutate: updateProject } = usePutProject({
    identifier: '',
    queryParams: {
      accountIdentifier: accountId,
      orgIdentifier: ''
    }
  })
  const { mutate: createProject } = usePostProject({
    queryParams: {
      accountIdentifier: accountId,
      orgIdentifier: ''
    }
  })
  const [modalErrorHandler, setModalErrorHandler] = useState<ModalErrorHandlerBinding>()
  const { loading, data } = useGetOrganizationList({
    queryParams: {
      accountIdentifier: accountId
    }
  })
  const { projects } = useAppStoreReader()
  const updateAppStore = useAppStoreWriter()

  const organisations: SelectOption[] =
    data?.data?.content?.map(org => {
      return {
        label: org.name || '',
        value: org.identifier || ''
      }
    }) || []

  const onComplete = async (values: Project): Promise<void> => {
    const dataToSubmit: unknown = pick<Project, keyof Project>(values, ['name', 'color', 'description', 'tags'])
    ;(dataToSubmit as Project)['accountIdentifier'] = accountId
    ;(dataToSubmit as Project)['owners'] = [accountId]
    if (isEdit) {
      await updateProject(dataToSubmit as Project, {
        pathParams: { identifier: values?.identifier || '' },
        queryParams: { accountIdentifier: accountId, orgIdentifier: values?.orgIdentifier || '' }
      })
      closeModal?.()
      onSuccess?.(values)
      updateAppStore({ projects: projects.filter(p => p.identifier !== values.identifier).concat(values) })
    } else {
      ;(dataToSubmit as Project)['identifier'] = values.identifier || ''
      ;(dataToSubmit as Project)['modules'] = values.modules || []
      try {
        await createProject(dataToSubmit as Project, {
          queryParams: { accountIdentifier: accountId, orgIdentifier: values?.orgIdentifier || '' }
        })
        nextStep?.({ ...values })
        onSuccess?.(values)
        updateAppStore({ projects: projects.concat(values) })
      } catch (e) {
        modalErrorHandler?.show(e.data)
      }
    }
  }

  return (
    <>
      <Formik
        initialValues={{
          color: '',
          identifier: '',
          name: '',
          orgIdentifier: '',
          description: '',
          tags: [],
          ...projectData
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().trim().required(i18n.newProjectWizard.aboutProject.errorName),
          identifier: Yup.string()
            .trim()
            .required(i18n.newProjectWizard.aboutProject.errorIdentifier)
            .matches(/^(?![0-9])[0-9a-zA-Z_$]*$/, 'Identifier can only contain alphanumerics, _ and $')
            .notOneOf(illegalIdentifiers),
          color: Yup.string().required(i18n.newProjectWizard.aboutProject.errorColor),
          orgIdentifier: Yup.string().required(i18n.newProjectWizard.aboutProject.errorOrganisation)
        })}
        onSubmit={(values: AboutPageData) => {
          onComplete(values)
        }}
      >
        {formikProps => (
          <Form>
            <ModalErrorHandler bind={setModalErrorHandler} />
            <Layout.Horizontal>
              <Layout.Vertical width="50%" padding="xxlarge">
                <Container style={{ minHeight: '450px' }}>
                  <Layout.Horizontal padding={{ bottom: 'large' }}>
                    <Text font="medium" color={Color.BLACK}>
                      {isEdit
                        ? i18n.newProjectWizard.aboutProject.edit.toUpperCase()
                        : i18n.newProjectWizard.aboutProject.name.toUpperCase()}
                    </Text>
                  </Layout.Horizontal>
                  <FormInput.InputWithIdentifier isIdentifierEditable={isEdit ? false : true} />
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
                      items={organisations}
                      disabled={isEdit ? true : loading}
                    />
                  </Layout.Horizontal>
                  <div className={css.collapseDiv}>
                    <Collapse {...descriptionCollapseProps}>
                      <FormInput.TextArea name="description" />
                    </Collapse>
                  </div>
                  <div className={css.collapseDiv}>
                    <Collapse {...tagCollapseProps}>
                      <FormInput.TagInput
                        name="tags"
                        items={[]}
                        labelFor={name => name as string}
                        itemFromNewTag={newTag => newTag}
                        tagInputProps={{
                          showClearAllButton: true,
                          allowNewTag: true,
                          placeholder: i18n.newProjectWizard.aboutProject.addTags
                        }}
                      />
                    </Collapse>
                  </div>
                  <Button
                    minimal
                    onClick={() => {
                      showPreview ? setShowPreview(false) : setShowPreview(true)
                    }}
                    text={
                      showPreview
                        ? i18n.newProjectWizard.aboutProject.closePreview
                        : i18n.newProjectWizard.aboutProject.previewProjectCard
                    }
                    margin={{ top: 'large' }}
                  />
                </Container>
                <Layout.Horizontal>
                  <Button className={css.button} text={i18n.newProjectWizard.saveAndContinue} type="submit" />
                </Layout.Horizontal>
              </Layout.Vertical>
              <Container width="50%" flex={{ align: 'center-center' }} className={css.preview}>
                {showPreview ? <ProjectCard data={formikProps.values} isPreview={true} /> : null}
              </Container>
            </Layout.Horizontal>
          </Form>
        )}
      </Formik>
    </>
  )
}

export default AboutProject
