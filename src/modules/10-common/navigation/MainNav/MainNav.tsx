import React from 'react'
import cx from 'classnames'
import { NavLink as Link, useParams } from 'react-router-dom'
import type { NavLinkProps } from 'react-router-dom'
import { Text, Icon, Layout, Color } from '@wings-software/uikit'
import { String } from 'framework/exports'

import paths from '@common/RouteDefinitions'

import type { AccountPathProps, ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import css from './MainNav.module.scss'

const commonLinkProps: Partial<NavLinkProps> = {
  activeClassName: css.active,
  className: cx(css.navLink, css.separation)
}

export default function L1Nav(): React.ReactElement {
  const params = useParams<AccountPathProps & Partial<ProjectPathProps>>()

  return (
    <nav className={css.main}>
      <ul className={css.navList}>
        <li className={css.navItem}>
          <Link {...commonLinkProps} to={paths.toProjects(params)}>
            <Layout.Vertical flex={{ align: 'center-center' }} spacing="small">
              <Icon name="harness" size={30} />
              <Text font={{ size: 'small', weight: 'semi-bold', align: 'center' }} color={Color.WHITE} lineClamp={2}>
                <String stringID="projectsText" />
              </Text>
            </Layout.Vertical>
          </Link>
        </li>
        <li className={css.navItem}>
          <Link {...commonLinkProps} to={paths.toCD(params)}>
            <Layout.Vertical flex={{ align: 'center-center' }} spacing="small">
              <Icon name="cd-main" size={30} />
              <Text font={{ size: 'small', weight: 'semi-bold', align: 'center' }} color={Color.WHITE} lineClamp={2}>
                <String stringID="deploymentsText" />
              </Text>
            </Layout.Vertical>
          </Link>
        </li>
        <li className={css.navItem}>
          <Link {...commonLinkProps} to={paths.toCI(params)}>
            <Layout.Vertical flex={{ align: 'center-center' }} spacing="small">
              <Icon name="ci-main" size={30} />
              <Text font={{ size: 'small', weight: 'semi-bold', align: 'center' }} color={Color.WHITE} lineClamp={2}>
                <String stringID="buildsText" />
              </Text>
            </Layout.Vertical>
          </Link>
        </li>
        <li className={css.navItem}>
          <Link {...commonLinkProps} to={paths.toCF(params)}>
            <Layout.Vertical flex={{ align: 'center-center' }} spacing="small">
              <Icon name="cf-main" size={30} />
              <Text font={{ size: 'small', weight: 'semi-bold', align: 'center' }} color={Color.WHITE} lineClamp={2}>
                <String stringID="featureFlagsText" />
              </Text>
            </Layout.Vertical>
          </Link>
        </li>
        <li className={css.navItem}>
          <Link {...commonLinkProps} to={paths.toCE(params)}>
            <Layout.Vertical flex={{ align: 'center-center' }} spacing="small">
              <Icon name="ce-main" size={30} />
              <Text font={{ size: 'small', weight: 'semi-bold', align: 'center' }} color={Color.WHITE} lineClamp={2}>
                <String stringID="cloudCostsText" />
              </Text>
            </Layout.Vertical>
          </Link>
        </li>
        <li className={css.navItem}>
          <Link {...commonLinkProps} to={paths.toCV(params)}>
            <Layout.Vertical flex={{ align: 'center-center' }} spacing="small" width={90}>
              <Icon name="cv-main" size={30} />
              <Text font={{ size: 'small', weight: 'semi-bold', align: 'center' }} color={Color.WHITE} lineClamp={2}>
                <String stringID="changeVerificationText" />
              </Text>
            </Layout.Vertical>
          </Link>
        </li>
      </ul>
      <ul className={css.navList}>
        <li className={css.navItem}>
          <Link className={css.navLink} activeClassName={css.active} to={paths.toAdmin(params)}>
            <Icon name="nav-settings" size={30} />
          </Link>
        </li>
      </ul>
    </nav>
  )
}
