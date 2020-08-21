import React, { useState } from 'react'
import {
  Formik,
  FormikForm as Form,
  FormInput,
  Button,
  Text,
  Layout,
  StepProps,
  Container,
  Color,
  SelectOption,
  TextInput,
  MultiSelectOption,
  Icon,
  ModalErrorHandlerBinding,
  ModalErrorHandler
} from '@wings-software/uikit'
import { Select } from '@blueprintjs/select'
import cx from 'classnames'
import { Menu } from '@blueprintjs/core'
import { useParams } from 'react-router-dom'
import { ProjectDTO, useGetUsers, useGetRoles, useGetInvites, CreateInviteListDTO, useSendInvite } from 'services/cd-ng'
import i18n from 'modules/common/pages/ProjectsPage/ProjectsPage.i18n'
import { InviteType } from '../Constants'

import css from './Steps.module.scss'

interface ProjectModalData {
  data: ProjectDTO | undefined
}

export interface CollaboratorsData {
  collaborators?: string[]
  invitationMessage?: string
}

const CustomSelect = Select.ofType<SelectOption>()

const defaultRole: SelectOption = {
  label: i18n.newProjectWizard.Collaborators.label,
  value: i18n.newProjectWizard.Collaborators.value
}

const Collaborators: React.FC<StepProps<ProjectDTO> & ProjectModalData> = props => {
  const { nextStep, prevStepData, data } = props
  const [role, setRole] = useState<SelectOption>(defaultRole)
  const [collaborators, setCollabrators] = useState<MultiSelectOption[]>()
  const { accountId } = useParams()
  const [modalErrorHandler, setModalErrorHandler] = useState<ModalErrorHandlerBinding>()
  const isFromMenu = !!data && !!data.id
  const projectData = isFromMenu ? data : prevStepData

  const { data: userData } = useGetUsers({ queryParams: { accountIdentifier: accountId } })

  const { data: inviteData, refetch: reloadInvites } = useGetInvites({
    orgIdentifier: projectData?.orgIdentifier || '',
    projectIdentifier: projectData?.identifier || '',
    queryParams: {
      accountIdentifier: accountId
    }
  })

  const { mutate: sendInvite } = useSendInvite({
    orgIdentifier: projectData?.orgIdentifier || '',
    projectIdentifier: projectData?.identifier || '',
    queryParams: {
      accountIdentifier: accountId
    }
  })

  const { data: roleData } = useGetRoles({
    orgIdentifier: projectData?.orgIdentifier || '',
    projectIdentifier: projectData?.identifier || '',
    queryParams: {
      accountIdentifier: accountId
    }
  })

  const users: SelectOption[] =
    userData?.data?.content?.map(user => {
      return {
        label: user.name || '',
        value: user.email || ''
      }
    }) || []

  const roles: SelectOption[] =
    roleData?.data?.map(roleOption => {
      return {
        label: roleOption.name || '',
        value: roleOption.name || ''
      }
    }) || []

  const SendInvitation = async (): Promise<void> => {
    const usersToSubmit = collaborators?.map(collaborator => {
      return collaborator.value
    })

    const dataToSubmit: CreateInviteListDTO = {
      users: usersToSubmit as string[],
      role: {
        name: role.label
      },
      inviteType: InviteType.ADMIN_INITIATED as Required<CreateInviteListDTO>['inviteType']
    }

    try {
      await sendInvite(dataToSubmit)
      reloadInvites()
    } catch (e) {
      modalErrorHandler?.show(e.data)
    }
  }

  return (
    <>
      <Formik
        initialValues={{ collaborators: [], invitationMessage: '' }}
        onSubmit={() => {
          if (prevStepData) {
            nextStep?.({ ...prevStepData })
          }
        }}
        enableReinitialize={true}
      >
        {formik => (
          <Form>
            <ModalErrorHandler bind={setModalErrorHandler} />
            <Layout.Vertical padding="xxxlarge">
              <Container className={css.collaboratorForm}>
                <Text font="medium" color={Color.BLACK} padding={{ bottom: 'xxlarge' }}>
                  {i18n.newProjectWizard.Collaborators.name.toUpperCase()}
                </Text>
                <Text padding={{ bottom: 'small' }}>{i18n.newProjectWizard.Collaborators.urlMessage}</Text>
                <Layout.Horizontal>
                  <TextInput
                    placeholder={i18n.newProjectWizard.Collaborators.url}
                    disabled
                    rightElement={(<Button icon="duplicate" inline minimal className={css.clone} />) as any}
                    className={css.url}
                  />
                </Layout.Horizontal>
                <Layout.Horizontal padding={{ top: 'medium' }} spacing="xlarge" className={css.align}>
                  <Text>{i18n.newProjectWizard.Collaborators.inviteCollab}</Text>
                  <CustomSelect
                    items={roles}
                    filterable={false}
                    itemRenderer={(item, { handleClick }) => (
                      <div>
                        <Menu.Item
                          text={item.label}
                          onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) => handleClick(e)}
                        />
                      </div>
                    )}
                    onItemSelect={item => {
                      setRole(item)
                    }}
                    popoverProps={{ minimal: true }}
                  >
                    <Layout.Horizontal padding={{ left: 'xlarge' }}>
                      <Button inline minimal rightIcon="chevron-down" text={role.label} />
                    </Layout.Horizontal>
                  </CustomSelect>
                </Layout.Horizontal>
                <Layout.Horizontal spacing="small">
                  <FormInput.MultiSelect
                    name="collaborators"
                    items={users}
                    multiSelectProps={{
                      allowCreatingNewItems: true
                    }}
                    className={css.input}
                    onChange={opts => {
                      setCollabrators(opts)
                    }}
                  />
                  <Button
                    text={i18n.newProjectWizard.Collaborators.add}
                    intent="primary"
                    inline
                    disabled={role.value == 'none' ? true : false}
                    onClick={() => {
                      SendInvitation()
                      formik.setFieldValue('collaborators', [])
                      setRole(defaultRole)
                    }}
                  />
                </Layout.Horizontal>
                {inviteData?.data?.content?.length ? (
                  <Layout.Vertical padding={{ top: 'medium', bottom: 'xxxlarge' }}>
                    <Text padding={{ bottom: 'small' }}>
                      {i18n.newProjectWizard.Collaborators.pendingUsers(inviteData?.data?.content?.length.toString())}
                    </Text>
                    <Container className={css.pendingList}>
                      {inviteData?.data?.content.slice(0, 15).map(user => (
                        <Container
                          key={user.name}
                          className={css.invites}
                          padding={{ top: 'medium', bottom: 'medium' }}
                        >
                          <Layout.Horizontal>
                            <Layout.Horizontal spacing="medium" className={css.align} width="75%">
                              <Icon name="main-user" size={30} />
                              <Layout.Vertical padding={{ left: 'small' }}>
                                <Layout.Horizontal spacing="small">
                                  <Text font={{ weight: 'bold' }} color={Color.BLACK}>
                                    {user.name}
                                  </Text>
                                  <Text
                                    font={{ size: 'xsmall', weight: 'bold' }}
                                    className={css.colorBar}
                                    color={Color.BLUE_500}
                                  >
                                    {i18n.newProjectWizard.Collaborators.pendingInvitation}
                                  </Text>
                                </Layout.Horizontal>
                                <Text>{user.email}</Text>
                                <Layout.Horizontal>
                                  <Text font={{ size: 'xsmall', weight: 'bold' }} color={Color.BLACK}>
                                    {i18n.newProjectWizard.Collaborators.roleAssigned}
                                  </Text>
                                  <Text font="xsmall" color={Color.BLUE_600}>
                                    {user.role.name}
                                  </Text>
                                </Layout.Horizontal>
                              </Layout.Vertical>
                            </Layout.Horizontal>
                            {user?.inviteType ==
                            (InviteType.ADMIN_INITIATED as Required<CreateInviteListDTO>['inviteType']) ? (
                              <Layout.Horizontal
                                width="25%"
                                padding={{ right: 'medium' }}
                                className={cx(css.align, css.toEnd)}
                              >
                                <Button inline minimal icon="refresh" />
                                <Button inline minimal icon="trash" />
                              </Layout.Horizontal>
                            ) : (
                              <Layout.Horizontal
                                width="25%"
                                padding={{ right: 'medium' }}
                                className={cx(css.align, css.toEnd)}
                              >
                                <Button inline minimal icon="command-approval" />
                                <Button inline minimal icon="trash" />
                              </Layout.Horizontal>
                            )}
                          </Layout.Horizontal>
                        </Container>
                      ))}
                    </Container>
                  </Layout.Vertical>
                ) : null}
              </Container>
              {!isFromMenu ? (
                <Layout.Horizontal>
                  <Button className={css.button} text={i18n.newProjectWizard.saveAndContinue} type="submit" />
                </Layout.Horizontal>
              ) : null}
            </Layout.Vertical>
          </Form>
        )}
      </Formik>
    </>
  )
}
export default Collaborators
