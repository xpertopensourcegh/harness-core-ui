import React from 'react'
import cx from 'classnames'
import { Card, Text, Tag, Layout, Icon, CardBody } from '@wings-software/uikit'

import css from './ProjectCard.module.scss'
import i18n from './ProjectCard.i18n'
import type { ProjectDTO } from 'services/cd-ng'

export interface ProjectCardProps {
  data?: ProjectDTO
  isPreview?: boolean
  className?: string
}

const ContextMenu: React.FC = () => {
  return (
    <Layout.Vertical spacing="medium" style={{ padding: 'var(--spacing-medium)' }}>
      <Text>{i18n.edit}</Text>
      <Text>{i18n.clone}</Text>
      <Text>{i18n.delete}</Text>
    </Layout.Vertical>
  )
}

const ProjectCard: React.FC<ProjectCardProps> = props => {
  const { data, isPreview } = props
  return (
    <Card className={cx(css.projectCard, props.className)}>
      <CardBody.Menu menuContent={<ContextMenu />} />
      <Text font="medium">{data?.name || 'Project Name'}</Text>
      {data?.description ? <Text>{data.description}</Text> : isPreview ? <Text>{i18n.sampleDescription}</Text> : null}
      <Layout.Horizontal spacing="small" style={{ marginTop: 'var(--spacing-large)' }}>
        {data?.tags && data.tags.length > 0 ? (
          data?.tags.map((tag: string) => (
            <Tag minimal key={tag}>
              {tag}
            </Tag>
          ))
        ) : isPreview ? (
          <>
            <Tag minimal>your</Tag>
            <Tag minimal>tags</Tag>
            <Tag minimal>here</Tag>
          </>
        ) : null}
      </Layout.Horizontal>
      <table className={css.dataTable}>
        <tbody>
          <tr className={css.rowOne}>
            <td className={cx(css.linkCell)} rowSpan={2}>
              <Icon name="link" />
            </td>
            <td>
              <Text font="medium" className={css.count}>
                {/* TODO: remove hardcoded numbers once backend is integrated */}0
              </Text>
            </td>
            <td>
              <Text>
                <Icon name="chart" />
              </Text>
            </td>
            <td>
              <Text font="medium" className={css.count} intent="danger">
                0
              </Text>
            </td>
          </tr>
          <tr className={css.rowTwo}>
            <td>
              <Text font="small" className={css.subtitle}>
                {i18n.services}
              </Text>
            </td>
            <td>
              <Text font="small" className={css.subtitle}>
                {i18n.activity}
              </Text>
            </td>
            <td>
              <Text font="small" className={css.subtitle}>
                {i18n.errors}
              </Text>
            </td>
          </tr>
        </tbody>
      </table>
      <br />
      <Icon name="main-user" />
    </Card>
  )
}

export default ProjectCard
