import React, { useState } from 'react'
import { Container, Layout, Text, Heading, Icon, Button, Color, IconName, Spacing } from '@wings-software/uikit'
import { ModuleName, useAppStoreReader } from 'framework/exports'
import type { Project } from 'services/cd-ng'
import { useProjectModal } from '@common/modals/ProjectModal/useProjectModal'
import ProjectsListPage from '@common/pages/ProjectsPage/ProjectsPage'
import { Page } from '../../components/Page/Page'
import ProjectGridView from '../../pages/ProjectsPage/views/ProjectGridView/ProjectGridView'
import i18n from './ModuleLandingView.i18n'
import css from './ModuleLandingView.module.scss'

export interface ModuleLandingViewProps {
  module: ModuleName.CD | ModuleName.CV | ModuleName.CE | ModuleName.CI | ModuleName.CF
  heading: string
  subHeading: string
  icon: IconName
  iconSize?: number
  iconPadding?: Spacing
  description: string
  onProjectCreated: (project: Project) => void
  onRowClick?: ((project: Project) => void) | undefined
  onCardClick?: ((project: Project) => void) | undefined
}

export const ModuleLandingView: React.FC<ModuleLandingViewProps> = ({
  module,
  onProjectCreated,
  icon,
  iconSize,
  iconPadding,
  heading,
  subHeading,
  description,
  onCardClick,
  onRowClick
}) => {
  const [collapse, setCollapse] = useState<boolean>(true)
  const { openProjectModal } = useProjectModal({
    onSuccess: (project?: Project): void => {
      if (project) {
        onProjectCreated(project)
      }
    }
  })
  const showEditProject = (project: Project): void => {
    openProjectModal(project)
  }
  const { projects } = useAppStoreReader()
  const noProjectPresent: boolean =
    projects.filter((project: Project) => project.modules?.includes?.(module)).length === 0
  return (
    <Page.Body filled className={css.noProject}>
      <Layout.Vertical>
        <Page.Body className={collapse ? css.noProject : css.projects}>
          {noProjectPresent ? (
            <Layout.Vertical flex={{ align: 'center-center' }} className={css.noProject}>
              <Heading font={{ weight: 'bold', size: 'large' }} color="black">
                {heading}
              </Heading>
              <Text color={Color.GREY_400} padding="small" style={{ paddingTop: 20 }}>
                {subHeading}
              </Text>
              <Icon name={icon} size={iconSize || 200} padding={iconPadding} />
              <Button
                intent="primary"
                text={i18n.newProject}
                onClick={() => openProjectModal(({ modules: [module] } as unknown) as Project)}
              />
              <Text color={Color.GREY_400} padding="large">
                {i18n.startYourTrial}
              </Text>
            </Layout.Vertical>
          ) : (
            <ProjectsListPage
              module={module}
              onNewProjectCreated={onProjectCreated}
              onCardClick={onCardClick}
              onRowClick={onRowClick}
            />
          )}
        </Page.Body>

        <Page.Body filled className={collapse ? undefined : css.add}>
          <Container
            style={{ borderTop: '1px solid var(--grey-300)', maxWidth: 900, margin: '0 auto' }}
            padding={{ bottom: 'small' }}
          >
            <Layout.Vertical flex={{ align: 'center-center' }}>
              <Button
                minimal
                icon={collapse ? 'main-chevron-up' : 'main-chevron-down'}
                iconProps={{ size: 20 }}
                onClick={() => {
                  setCollapse(!collapse)
                }}
              ></Button>
              <Text font={{ align: 'center' }} color={Color.BLACK} style={{ paddingBottom: 0 }}>
                {description}
              </Text>
            </Layout.Vertical>
            {!collapse ? (
              <Button
                minimal
                icon="cross"
                iconProps={{ size: 18 }}
                className={css.crossIcon}
                onClick={() => {
                  setCollapse(true)
                }}
              />
            ) : null}
          </Container>
          {!collapse ? (
            <ProjectGridView
              module={module}
              showEditProject={showEditProject}
              deselectModule={true}
              className={css.view}
              pageSize={10}
              onCardClick={onCardClick}
            />
          ) : null}
        </Page.Body>
      </Layout.Vertical>
    </Page.Body>
  )
}
