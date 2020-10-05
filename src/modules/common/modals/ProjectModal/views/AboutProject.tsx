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
import { pick } from 'lodash-es'
import { useAppStoreReader, useAppStoreWriter } from 'framework/exports'
import ProjectCard from 'modules/common/pages/ProjectsPage/views/ProjectCard/ProjectCard'
import i18n from 'modules/common/pages/ProjectsPage/ProjectsPage.i18n'
import { illegalIdentifiers } from 'modules/common/utils/StringUtils'
import { useGetOrganizationList, ResponsePageOrganization } from 'services/cd-ng'
import type { Project } from 'services/cd-ng'
import { usePutProject, usePostProject } from 'services/cd-ng'
import type { UseGetMockData } from 'modules/common/utils/testUtils'
import { useToaster } from 'modules/common/components/Toaster/useToaster'
import css from './Steps.module.scss'

interface ProjectModalData {
  orgmockData?: UseGetMockData<ResponsePageOrganization>
  data: Project | undefined
  closeModal?: () => void
  onSuccess?: (project: Project | undefined) => void
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

const AboutProject: React.FC<StepProps<Project> & ProjectModalData> = props => {
  const { prevStepData, nextStep, data: projectData, closeModal, onSuccess, orgmockData } = props
  const [showPreview, setShowPreview] = useState<boolean>(true)
  const { accountId, orgIdentifier } = useParams()
  const isEdit = (!!projectData && !!projectData.identifier) || prevStepData?.identifier
  const isStep = prevStepData?.identifier
  const { showSuccess } = useToaster()

  const { mutate: updateProject, loading: updateLoading } = usePutProject({
    identifier: '',
    queryParams: {
      accountIdentifier: accountId,
      orgIdentifier: ''
    }
  })
  const { mutate: createProject, loading: createLoading } = usePostProject({
    queryParams: {
      accountIdentifier: accountId,
      orgIdentifier: ''
    }
  })
  const [modalErrorHandler, setModalErrorHandler] = useState<ModalErrorHandlerBinding>()
  const { loading, data } = useGetOrganizationList({
    queryParams: {
      accountIdentifier: accountId
    },
    mock: orgmockData
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

  const getErrorMessage = (errors: any): string => {
    const message: string[] = errors.map((error: any) => {
      return error.error
    })
    return message.toString()
  }

  const onComplete = async (values: Project): Promise<void> => {
    const dataToSubmit: Project = pick<Project, keyof Project>(values, [
      'name',
      'orgIdentifier',
      'color',
      'description',
      'identifier',
      'tags'
    ])
    if (values.color === '') delete dataToSubmit.color
    ;(dataToSubmit as Project)['accountIdentifier'] = accountId
    ;(dataToSubmit as Project)['owners'] = [accountId]
    if (isEdit) {
      try {
        await updateProject(dataToSubmit as Project, {
          pathParams: { identifier: values?.identifier || '' },
          queryParams: { accountIdentifier: accountId, orgIdentifier: values?.orgIdentifier || '' }
        })
        isStep ? nextStep?.({ ...values }) : closeModal?.()
        showSuccess(i18n.newProjectWizard.aboutProject.editSuccess)
        onSuccess?.(values)
        updateAppStore({ projects: projects.filter(p => p.identifier !== values.identifier).concat(values) })
      } catch (e) {
        modalErrorHandler?.showDanger(e.data.message || getErrorMessage(e.data.errors))
      }
    } else {
      ;(dataToSubmit as Project)['modules'] = values.modules || []
      try {
        await createProject(dataToSubmit as Project, {
          queryParams: { accountIdentifier: accountId, orgIdentifier: values?.orgIdentifier || '' }
        })
        nextStep?.({ ...values })
        showSuccess(i18n.newProjectWizard.aboutProject.createSuccess)
        onSuccess?.(values)
        updateAppStore({ projects: projects.concat(values) })
      } catch (e) {
        modalErrorHandler?.showDanger(e.data.message || getErrorMessage(e.data.errors))
      }
    }
  }
  return (
    <Formik
      initialValues={{
        color: '',
        identifier: '',
        name: '',
        orgIdentifier: orgIdentifier || i18n.newProjectWizard.aboutProject.default,
        description: '',
        tags: [],
        ...projectData,
        ...prevStepData
      }}
      validationSchema={Yup.object().shape({
        name: Yup.string().trim().required(i18n.newProjectWizard.aboutProject.errorName),
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
                      disabled={isEdit || orgIdentifier ? true : loading}
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
                  <Button
                    className={css.button}
                    text={i18n.newProjectWizard.saveAndContinue}
                    type="submit"
                    disabled={updateLoading || createLoading}
                  />
                </Layout.Horizontal>
              </Layout.Vertical>
              <Container width="50%" flex={{ align: 'center-center' }} className={css.preview}>
                {showPreview ? <ProjectCard data={formikProps.values} isPreview={true} /> : null}
              </Container>
            </Layout.Horizontal>
          </Form>
        )
      }}
    </Formik>
  )
}

export default AboutProject
