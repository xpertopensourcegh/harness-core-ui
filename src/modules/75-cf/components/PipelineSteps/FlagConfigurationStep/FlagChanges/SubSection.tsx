import React, { FC, ReactElement } from 'react'
import { Layout } from '@wings-software/uicore'
import type { LayoutProps } from '@wings-software/uicore/dist/layouts/Layout'
import type { SubSectionComponentProps } from './FlagChanges'
import css from './SubSection.module.scss'

export interface SubSectionProps {
  removeSubSectionButton?: ReactElement
  subSectionSelector: ReactElement
}

export const disallowedProps: Array<string | keyof SubSectionComponentProps> = [
  'fieldValues',
  'subSectionSelector',
  'removeSubSectionButton',
  'clearField',
  'setField',
  'targetAttributes',
  'targetGroups',
  'variations',
  'targets'
]

const filterSubSectionProps = (props: Record<string, unknown>): Record<string, unknown> =>
  Object.entries(props)
    .filter(([propName]) => !disallowedProps.includes(propName))
    .reduce<Record<string, unknown>>((entries, [key, value]) => ({ ...entries, [key]: value }), {})

const SubSection: FC<SubSectionProps & LayoutProps> = ({
  removeSubSectionButton,
  subSectionSelector,
  children,
  ...props
}) => {
  return (
    <Layout.Vertical
      spacing="medium"
      padding="large"
      className={css.subSection}
      {...filterSubSectionProps(props as Record<string, unknown>)}
    >
      <Layout.Horizontal className={css.header}>
        {subSectionSelector}
        {removeSubSectionButton}
      </Layout.Horizontal>
      {children}
    </Layout.Vertical>
  )
}

export default SubSection
