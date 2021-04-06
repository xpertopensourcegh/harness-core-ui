import React from 'react'
import { useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { Button, Color, Layout, Text } from '@wings-software/uicore'
import routes from '@common/RouteDefinitions'
import { Breadcrumbs } from '@common/components/Breadcrumbs/Breadcrumbs'
import type { Module } from '@common/interfaces/RouteInterfaces'
import { useAppStore, useStrings } from 'framework/exports'
import { Page } from '@common/exports'
import css from './Services.module.scss'

export enum Views {
  LIST,
  INSIGHT
}

type ParamsType = {
  orgIdentifier: string
  projectIdentifier: string
  accountId: string
  module: Module
}

const useSetView = (fn: (arg: Views) => void, arg: Views): (() => void) => useCallback(() => fn(arg), [arg, fn])

export const Services: React.FC = () => {
  const { orgIdentifier, projectIdentifier, accountId, module } = useParams<ParamsType>()
  const { selectedProject: { name: selectedProjectName = '' } = {} } = useAppStore()

  const { getString } = useStrings()
  const [view, setView] = React.useState<Views>(Views.INSIGHT)
  return (
    <>
      <Page.Header
        title={
          <Layout.Vertical spacing="xsmall">
            <Breadcrumbs
              links={[
                {
                  url: routes.toServices({ orgIdentifier, projectIdentifier, accountId, module }),
                  label: selectedProjectName
                },
                { url: '#', label: getString('services') }
              ]}
            />
            <Text font={{ size: 'medium' }} color={Color.GREY_700}>
              {getString('services')}
            </Text>
          </Layout.Vertical>
        }
      />
      <Layout.Horizontal className={css.header} flex={{ distribution: 'space-between' }}>
        <Layout.Horizontal>
          <Button
            intent="primary"
            data-testid="add-service"
            icon="plus"
            iconProps={{ size: 10 }}
            text={getString('newService')}
            /* Todo - Jasmeet - add onClick routing logic */
          />
        </Layout.Horizontal>
        <Layout.Horizontal flex>
          <Button
            minimal
            icon="insight-view"
            intent={view === Views.INSIGHT ? 'primary' : 'none'}
            onClick={useSetView(setView, Views.INSIGHT)}
          />
          <Button
            minimal
            icon="list-view"
            intent={view === Views.LIST ? 'primary' : 'none'}
            onClick={useSetView(setView, Views.LIST)}
          />
        </Layout.Horizontal>
      </Layout.Horizontal>
      <Page.Body></Page.Body>
    </>
  )
}
