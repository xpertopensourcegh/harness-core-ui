import React, { useState } from 'react'
import { Layout, Select, SelectOption } from '@wings-software/uikit'
import cx from 'classnames'
import { useHistory } from 'react-router-dom'
import { Sidebar, isRouteActive, useRouteParams } from 'framework/exports'
import { routeOrgGitSync, routeOrgGovernance, routeOrgProjects, routeOrgResources } from 'modules/common/routes'
import { useGetOrganizationList } from 'services/cd-ng'
import i18n from './OrgSelector.i18n'
import css from './OrgSelector.module.scss'

const defaultOption: SelectOption = {
  label: i18n.selectorg,
  value: i18n.selectorg
}

const OrgNavLinks: React.FC<{ orgIdentifier?: string }> = ({ orgIdentifier }) => {
  if (!orgIdentifier) return null
  return (
    <>
      <Layout.Vertical style={{ marginLeft: 'var(--spacing-xlarge)' }}>
        <Sidebar.Link
          href={routeOrgProjects.url({ orgIdentifier })}
          label={i18n.projects}
          icon="nav-project"
          selected={isRouteActive(routeOrgProjects)}
        />
        <Sidebar.Link
          href={routeOrgGovernance.url({ orgIdentifier })}
          label={i18n.governance}
          icon="nav-governance"
          selected={isRouteActive(routeOrgGovernance)}
        />
        <Sidebar.Link
          href={routeOrgResources.url({ orgIdentifier })}
          label={i18n.resources}
          icon="nav-resources"
          selected={isRouteActive(routeOrgResources, false)}
        />
        <Sidebar.Link
          href={routeOrgGitSync.url({ orgIdentifier })}
          label={i18n.gitSync}
          icon="nav-git-sync"
          selected={isRouteActive(routeOrgGitSync, false)}
        />
      </Layout.Vertical>
    </>
  )
}

const OrgSelector: React.FC = () => {
  const {
    params: { orgIdentifier, accountId }
  } = useRouteParams()
  const history = useHistory()
  const [selectedOrg, setSelectedOrg] = useState<SelectOption>()
  const { data } = useGetOrganizationList({ queryParams: { accountIdentifier: accountId } })
  const orgValues: SelectOption[] =
    data?.data?.content?.map(org => {
      return {
        label: org.name || '',
        value: org.identifier || ''
      }
    }) || []
  const orgName = orgValues.find(org => org.value === orgIdentifier)?.label as string
  React.useEffect(() => {
    if (orgIdentifier) {
      setSelectedOrg({
        label: orgName,
        value: orgIdentifier as string
      })
    } else {
      setSelectedOrg(undefined)
    }
  }, [orgName, orgIdentifier])

  return (
    <>
      <Select
        items={orgValues}
        value={selectedOrg ? selectedOrg : defaultOption}
        onChange={item => {
          setSelectedOrg(item)
          history.push(routeOrgProjects.url({ orgIdentifier: item.value as string }))
        }}
        className={cx(css.orgSelector, !selectedOrg && css.noSelected)}
      />
      <OrgNavLinks orgIdentifier={selectedOrg?.value as string} />{' '}
    </>
  )
}

export default OrgSelector
