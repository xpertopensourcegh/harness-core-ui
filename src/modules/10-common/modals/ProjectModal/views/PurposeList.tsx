import React, { useState } from 'react'

import { CardSelect, Text, Layout, Icon, IconName, Container, Button } from '@wings-software/uikit'

import { useHistory, useParams } from 'react-router-dom'
import { routeCDPipelineStudio } from 'navigation/cd/routes'
import type { Project, ResponseProject } from 'services/cd-ng'
import { usePutProject } from 'services/cd-ng'
import { routeCVDataSources } from 'navigation/cv/routes'
import type { UseMutateMockData } from '@common/utils/testUtils'
import i18n from '../../../pages/ProjectsPage/ProjectsPage.i18n'
import css from './Purpose.module.scss'

interface ProjectModalData {
  data: Project
  mock?: UseMutateMockData<ResponseProject>
}

interface PurposeType {
  title: string
  icon: IconName
  Description: string
  start: string
  text: string
  button: string
  module: Required<Project>['modules'][number]
}

interface ModuleProps {
  onSubmit: () => Promise<boolean>
}

const options: PurposeType[] = [
  {
    title: i18n.newProjectWizard.purposeList.cd,
    icon: 'nav-cd-hover',
    Description: i18n.newProjectWizard.purposeList.cdDescription,
    start: i18n.newProjectWizard.purposeList.startcd,
    text: i18n.newProjectWizard.purposeList.textcd,
    button: i18n.newProjectWizard.purposeList.buttoncd,
    module: 'CD'
  },
  {
    title: i18n.newProjectWizard.purposeList.cv,
    icon: 'nav-cv-hover',
    Description: i18n.newProjectWizard.purposeList.cvDescription,
    start: i18n.newProjectWizard.purposeList.startcv,
    text: i18n.newProjectWizard.purposeList.textcv,
    button: i18n.newProjectWizard.purposeList.buttoncv,
    module: 'CV'
  },
  {
    title: i18n.newProjectWizard.purposeList.ci,
    icon: 'unknown-vehicle',
    Description: i18n.newProjectWizard.purposeList.cdDescription,
    start: i18n.newProjectWizard.purposeList.startci,
    text: i18n.newProjectWizard.purposeList.textci,
    button: i18n.newProjectWizard.purposeList.buttonci,
    module: 'CI'
  },
  {
    title: i18n.newProjectWizard.purposeList.ce,
    icon: 'ce-main-colored',
    Description: i18n.newProjectWizard.purposeList.cdDescription,
    start: i18n.newProjectWizard.purposeList.startce,
    text: i18n.newProjectWizard.purposeList.textce,
    button: i18n.newProjectWizard.purposeList.buttonce,
    module: 'CE'
  },
  {
    title: i18n.newProjectWizard.purposeList.cf,
    icon: 'unknown-vehicle',
    Description: i18n.newProjectWizard.purposeList.cdDescription,
    start: i18n.newProjectWizard.purposeList.startcf,
    text: i18n.newProjectWizard.purposeList.textcf,
    button: i18n.newProjectWizard.purposeList.buttoncf,
    module: 'CF'
  }
]

const ContinuousDeployement: React.FC<ModuleProps & ProjectModalData> = ({ onSubmit, data }) => {
  const history = useHistory()

  return (
    <Container width="40%">
      <Layout.Vertical className={css.started}>
        <Text font="large" className={css.textPadding}>
          {i18n.newProjectWizard.purposeList.startcd}
        </Text>
        <Text font="small" className={css.text}>
          {i18n.newProjectWizard.purposeList.textcd}
        </Text>
        <Button
          intent="primary"
          className={css.button}
          text={i18n.newProjectWizard.purposeList.buttoncd}
          onClick={() => {
            onSubmit()
            history.push(
              routeCDPipelineStudio.url({
                orgIdentifier: data.orgIdentifier as string,
                projectIdentifier: data.identifier as string,
                pipelineIdentifier: -1
              })
            )
          }}
        />
      </Layout.Vertical>
    </Container>
  )
}

const ContinuousVerification: React.FC<ModuleProps & ProjectModalData> = ({ onSubmit, data }) => {
  const history = useHistory()

  return (
    <Container width="40%">
      <Layout.Vertical className={css.started}>
        <Text font="large" className={css.textPadding}>
          {i18n.newProjectWizard.purposeList.startcv}
        </Text>
        <Text font="small" className={css.text}>
          {i18n.newProjectWizard.purposeList.textcv}
        </Text>
        <Button
          intent="primary"
          className={css.button}
          text={i18n.newProjectWizard.purposeList.buttoncv}
          onClick={() => {
            onSubmit()
            history.push({
              pathname: routeCVDataSources.url({
                projectIdentifier: data.identifier,
                orgIdentifier: data.orgIdentifier
              }),
              search: '?onBoarding=true'
            })
          }}
        />
      </Layout.Vertical>
    </Container>
  )
}

const ContinuousIntegration: React.FC<ModuleProps> = ({ onSubmit }) => {
  return (
    <Container width="40%">
      <Layout.Vertical className={css.started}>
        <Text font="large" className={css.textPadding}>
          {i18n.newProjectWizard.purposeList.startci}
        </Text>
        <Text font="small" className={css.text}>
          {i18n.newProjectWizard.purposeList.textci}
        </Text>
        <Button
          intent="primary"
          className={css.button}
          text={i18n.newProjectWizard.purposeList.buttonci}
          onClick={() => {
            onSubmit()
          }}
        />
      </Layout.Vertical>
    </Container>
  )
}

const ContinuousEfficiency: React.FC<ModuleProps> = ({ onSubmit }) => {
  return (
    <Container width="40%">
      <Layout.Vertical className={css.started}>
        <Text font="large" className={css.textPadding}>
          {i18n.newProjectWizard.purposeList.startce}
        </Text>
        <Text font="small" className={css.text}>
          {i18n.newProjectWizard.purposeList.textce}
        </Text>
        <Button
          intent="primary"
          className={css.button}
          text={i18n.newProjectWizard.purposeList.buttonce}
          onClick={() => {
            onSubmit()
          }}
        />
      </Layout.Vertical>
    </Container>
  )
}

const ContinuousFeatures: React.FC<ModuleProps> = ({ onSubmit }) => {
  return (
    <Container width="40%">
      <Layout.Vertical className={css.started}>
        <Text font="large" className={css.textPadding}>
          {i18n.newProjectWizard.purposeList.startcf}
        </Text>
        <Text font="small" className={css.text}>
          {i18n.newProjectWizard.purposeList.textcf}
        </Text>
        <Button
          intent="primary"
          className={css.button}
          text={i18n.newProjectWizard.purposeList.buttoncf}
          onClick={() => {
            onSubmit()
          }}
        />
      </Layout.Vertical>
    </Container>
  )
}

const PurposeList: React.FC<ProjectModalData> = props => {
  const { data: projectData, mock } = props
  const { accountId } = useParams()
  const [selected, setSelected] = useState<PurposeType>(options[0])
  const { mutate: updateProject } = usePutProject({
    identifier: '',
    queryParams: {
      accountIdentifier: accountId,
      orgIdentifier: ''
    },
    mock: mock
  })

  const onSuccess = async (): Promise<boolean> => {
    const dataToSubmit: Project = {
      ...(projectData as Project),
      modules: [selected.module]
    }
    ;(dataToSubmit as Project)['owners'] = [accountId]

    try {
      await updateProject(dataToSubmit, {
        pathParams: {
          identifier: projectData.identifier
        },
        queryParams: {
          accountIdentifier: accountId,
          orgIdentifier: projectData.orgIdentifier
        }
      })
      return true
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  }

  return (
    <Layout.Horizontal>
      <Container width="60%">
        <Layout.Vertical spacing="large" className={css.modalPage}>
          <Text font="medium">{i18n.newProjectWizard.purposeList.name}</Text>
          <div className={css.border}>
            <CardSelect<PurposeType>
              selected={selected}
              onChange={value => {
                setSelected(value)
              }}
              className={css.radioSelect}
              data={options}
              renderItem={item => (
                <>
                  <Layout.Horizontal>
                    <Icon name={item.icon} size={30} />
                    <Layout.Vertical>
                      <Text font="small">{i18n.newProjectWizard.purposeList.continuous}</Text>
                      <Text font={{ size: 'medium' }} padding={{ bottom: 'xxlarge' }}>
                        {item.title}
                      </Text>
                    </Layout.Vertical>
                  </Layout.Horizontal>

                  <Text font="small" padding={{ bottom: 'xxlarge' }} width={150}>
                    {item.Description}
                  </Text>
                  <Text font="small">{i18n.newProjectWizard.purposeList.time}</Text>
                </>
              )}
            ></CardSelect>
          </div>
        </Layout.Vertical>
      </Container>
      {selected.module === 'CD' ? <ContinuousDeployement onSubmit={onSuccess} data={projectData} /> : null}
      {selected.module === 'CV' ? <ContinuousVerification onSubmit={onSuccess} data={projectData} /> : null}
      {selected.module === 'CI' ? <ContinuousIntegration onSubmit={onSuccess} /> : null}
      {selected.module === 'CE' ? <ContinuousEfficiency onSubmit={onSuccess} /> : null}
      {selected.module === 'CF' ? <ContinuousFeatures onSubmit={onSuccess} /> : null}
    </Layout.Horizontal>
  )
}

export default PurposeList
