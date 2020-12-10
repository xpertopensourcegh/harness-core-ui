import React from 'react'

import { useHistory, useParams } from 'react-router-dom'
import { Button, Heading, Color, Link } from '@wings-software/uikit'
import routes from '@common/RouteDefinitions'
import { useProjectModal } from '@projects-orgs/modals/ProjectModal/useProjectModal'
import { Page } from '@common/components/Page/Page'
import i18n from '../../ProjectsPage.i18n'
import getStarted from './images/getStarted.png'
import css from './GetStartedProject.module.scss'

const GetStartedProject = () => {
  const { accountId } = useParams()
  let projecCreated = false
  const history = useHistory()
  const projectCreateSuccessHandler = (): void => {
    projecCreated = true
  }
  const { openProjectModal } = useProjectModal({
    onSuccess: projectCreateSuccessHandler,
    onCloseModal: () => {
      if (projecCreated) {
        history.push(routes.toProjects({ accountId }))
      }
    }
  })
  return (
    <>
      <Page.Header
        title={i18n.getNewProjectStarted}
        content={
          <Link
            withoutHref
            onClick={() => {
              history.push(routes.toProjects({ accountId }))
            }}
          >
            {i18n.projects}
          </Link>
        }
      />
      <div className={css.getStartedMainContainer}>
        <div className={css.getStartedContainer}>
          <img src={getStarted} className={css.image} />
          <Heading level={1} font={{ weight: 'bold' }} color={Color.BLACK}>
            {i18n.newProjectWizard.GetStartedProjectPage.welcome}
          </Heading>
          <Heading color={Color.GREY_600} level={2}>
            {i18n.newProjectWizard.GetStartedProjectPage.welcomeSecondLine}
          </Heading>
          <Button
            margin={{ top: '24px' }}
            intent="primary"
            text={i18n.newProject}
            icon="plus"
            onClick={() => openProjectModal()}
          />
        </div>
      </div>
    </>
  )
}
export default GetStartedProject
