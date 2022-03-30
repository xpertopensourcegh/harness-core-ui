/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React from 'react'
import cx from 'classnames'
import { Text, FontVariation, Icon, Layout, Button, ButtonVariation, IconName, Container } from '@harness/uicore'
import { useStrings } from 'framework/strings'
import type { StringsMap } from 'stringTypes'

import samplePipelineImg from '../../assets/images/sample-pipeline.svg'

import css from './GetStartedWithCI.module.scss'

const dummy_repo = 'github.com/harnesssampleapp'

export default function GetStartedWithCI(): React.ReactElement {
  const { getString } = useStrings()

  const renderBuildPipelineStep = React.useCallback(
    ({ icon, label, isLastStep }: { icon: IconName; label: keyof StringsMap; isLastStep?: boolean }) => (
      <Layout.Horizontal flex padding={{ right: 'small' }}>
        <Icon name={icon} size={12} />
        <Text font={{ variation: FontVariation.TINY }} padding={{ left: 'xsmall', right: 'xsmall' }}>
          {getString(label)}
        </Text>
        {!isLastStep ? <Icon name="arrow-right" size={10} /> : null}
      </Layout.Horizontal>
    ),
    []
  )

  const renderSamplePipelineSetupInfo = React.useCallback(
    ({ key, value }: { key: keyof StringsMap; value: keyof StringsMap }) => (
      <Layout.Horizontal>
        <Text font={{ variation: FontVariation.SMALL }}>{getString(key)}:&nbsp;</Text>
        <Text font={{ variation: FontVariation.SMALL_BOLD }}>{getString(value)}</Text>
      </Layout.Horizontal>
    ),
    []
  )

  const CI_CATALOGUE = [
    [
      {
        icon: 'ci-ti' as IconName,
        label: 'ci.getStartedWithCI.ti' as keyof StringsMap,
        helptext: 'ci.getStartedWithCI.tiHelpText' as keyof StringsMap
      },
      {
        icon: 'ci-language' as IconName,
        label: 'ci.getStartedWithCI.languageAgnostic' as keyof StringsMap,
        helptext: 'ci.getStartedWithCI.languageAgnosticHelpText' as keyof StringsMap
      },
      {
        icon: 'ci-parameterization' as IconName,
        label: 'ci.getStartedWithCI.parameterization' as keyof StringsMap,
        helptext: 'ci.getStartedWithCI.parameterizationHelpText' as keyof StringsMap
      },
      {
        icon: 'ci-execution' as IconName,
        label: 'ci.getStartedWithCI.parallelization' as keyof StringsMap,
        helptext: 'ci.getStartedWithCI.parallelizationHelpText' as keyof StringsMap
      }
    ],
    [
      {
        icon: 'ci-infra-support' as IconName,
        label: 'ci.getStartedWithCI.flexibleInfra' as keyof StringsMap,
        helptext: 'ci.getStartedWithCI.flexibleInfraHelpText' as keyof StringsMap
      },
      {
        icon: 'ci-dev-exp' as IconName,
        label: 'ci.getStartedWithCI.devFriendly' as keyof StringsMap,
        helptext: 'ci.getStartedWithCI.devFriendlyHelpText' as keyof StringsMap
      },
      {
        icon: 'ci-gov' as IconName,
        label: 'ci.getStartedWithCI.security' as keyof StringsMap,
        helptext: 'ci.getStartedWithCI.securityHelpText' as keyof StringsMap
      },
      {
        icon: 'ci-integrated' as IconName,
        label: 'ci.getStartedWithCI.integratedCICD' as keyof StringsMap,
        helptext: 'ci.getStartedWithCI.integratedCICDHelpText' as keyof StringsMap
      }
    ]
  ]

  const renderCatalogueItem = React.useCallback(
    ({ icon, label, helptext }: { icon: IconName; label: keyof StringsMap; helptext: keyof StringsMap }) => (
      <Layout.Vertical padding={{ bottom: 'xxxlarge' }}>
        <Icon name={icon} size={50} />
        <Text font={{ variation: FontVariation.CARD_TITLE }}>{getString(label)}</Text>
        <Text font={{ variation: FontVariation.SMALL }}>{getString(helptext)}</Text>
      </Layout.Vertical>
    ),
    []
  )

  const Divider = <div className={css.divider}></div>

  return (
    <Layout.Vertical flex>
      <Icon name="ci-main" size={50} className={css.ciIcon} />
      <Text font={{ variation: FontVariation.H1_SEMI }} margin={{ bottom: 'medium' }}>
        {getString('ci.getStartedWithCI.firstPipeline')}
      </Text>
      <Text font={{ variation: FontVariation.BODY1 }} className={css.chooseAnOption}>
        {getString('ci.getStartedWithCI.chooseAnOption')}
      </Text>
      <Layout.Vertical flex spacing="medium">
        <Layout.Horizontal flex={{ alignItems: 'flex-start' }} className={css.buildYourOwnPipeline}>
          <Layout.Horizontal>
            <Icon name="ci-build-pipeline" size={40} />
            <Layout.Vertical padding={{ left: 'medium', right: 'medium' }}>
              <Text font={{ variation: FontVariation.H4 }}>
                {getString('ci.getStartedWithCI.buildyourOwnPipeline')}
              </Text>
              <Text font={{ variation: FontVariation.SMALL }} padding={{ top: 'xsmall' }}>
                {getString('ci.getStartedWithCI.quicklyCreate')}
              </Text>
              <Container padding={{ top: 'small', bottom: 'small' }}>
                <Container className={cx(css.separator, css.horizontal)} />
              </Container>
              <Layout.Horizontal padding={{ top: 'medium' }}>
                {renderBuildPipelineStep({ icon: 'ci-infra', label: 'ci.getStartedWithCI.configInfra' })}
                {renderBuildPipelineStep({ icon: 'scm', label: 'ci.getStartedWithCI.connectSCM' })}
                {renderBuildPipelineStep({ icon: 'repository', label: 'ci.getStartedWithCI.selectRepo' })}
                {renderBuildPipelineStep({
                  icon: 'ci-build-pipeline',
                  label: 'ci.getStartedWithCI.buildPipeline',
                  isLastStep: true
                })}
              </Layout.Horizontal>
            </Layout.Vertical>
          </Layout.Horizontal>
          <Button variation={ButtonVariation.PRIMARY} text={getString('common.createPipeline')} />
        </Layout.Horizontal>
        <Layout.Vertical className={cx(css.tryASamplePipeline)}>
          <Layout.Horizontal flex={{ alignItems: 'flex-start' }}>
            <Layout.Horizontal>
              <Icon name="ci-try-pipeline" size={40} />
              <Layout.Vertical padding={{ left: 'medium', right: 'medium' }}>
                <Text font={{ variation: FontVariation.H4 }}>
                  {getString('ci.getStartedWithCI.tryASamplePipeline')}
                </Text>
                <Text font={{ variation: FontVariation.SMALL }} padding={{ top: 'xsmall' }}>
                  {getString('ci.getStartedWithCI.startSamplePipeline')}
                </Text>
              </Layout.Vertical>
            </Layout.Horizontal>
            <Button
              variation={ButtonVariation.PRIMARY}
              icon="run-pipeline"
              intent="success"
              text={getString('runPipelineText')}
            />
          </Layout.Horizontal>
          <Layout.Horizontal padding={{ top: 'medium' }}>
            <Container padding={{ left: 'small', right: 'xxxlarge' }}>
              <Container
                style={{ background: `transparent url(${samplePipelineImg}) no-repeat` }}
                className={css.samplePipeline}
              />
            </Container>
            <Container padding={{ left: 'huge', top: 'xlarge' }}>
              <Container className={css.separator} />
            </Container>
            <Layout.Vertical padding={{ left: 'huge' }} margin={{ top: 'xlarge' }}>
              {renderSamplePipelineSetupInfo({ key: 'languageLabel', value: 'ci.getStartedWithCI.javaLabel' })}
              <Layout.Horizontal>
                <Text font={{ variation: FontVariation.SMALL }}>
                  {getString('ci.getStartedWithCI.codebaseRepoLabel')}:&nbsp;
                </Text>
                <Text font={{ variation: FontVariation.SMALL_BOLD }}>{dummy_repo}</Text>
              </Layout.Horizontal>
              {renderSamplePipelineSetupInfo({
                key: 'infrastructureText',
                value: 'ci.getStartedWithCI.hostedByHarness'
              })}
            </Layout.Vertical>
          </Layout.Horizontal>
        </Layout.Vertical>
      </Layout.Vertical>
      <Layout.Horizontal flex padding={{ top: 'huge' }}>
        <Icon name="ci-main" size={42} />
        <Layout.Vertical flex padding={{ left: 'xsmall' }}>
          <Text font={{ variation: FontVariation.H5 }} className={css.label}>
            {getString('common.purpose.ci.continuousLabel')}
          </Text>
          <Text font={{ variation: FontVariation.H5 }} className={css.label}>
            {getString('common.purpose.ci.integration')}
          </Text>
        </Layout.Vertical>
      </Layout.Horizontal>
      <Text
        font={{ variation: FontVariation.H3 }}
        className={css.nextLevel}
        padding={{ top: 'large', bottom: 'xxxlarge' }}
      >
        {getString('ci.getStartedWithCI.takeToTheNextLevel')}
      </Text>
      {Divider}
      <Layout.Horizontal width="70%" padding={{ top: 'xxlarge' }}>
        <Layout.Vertical padding="xxlarge" style={{ flex: 1 }}>
          {CI_CATALOGUE[0].map(item => renderCatalogueItem(item))}
        </Layout.Vertical>
        <Layout.Vertical padding="xxlarge" style={{ flex: 1 }}>
          {CI_CATALOGUE[1].map(item => renderCatalogueItem(item))}
        </Layout.Vertical>
      </Layout.Horizontal>
      {Divider}
      <Container padding={{ top: 'xxxlarge', bottom: 'huge' }}>
        <Button variation={ButtonVariation.PRIMARY} href={'#'} target="_blank">
          {getString('learnMore')}
        </Button>
      </Container>
    </Layout.Vertical>
  )
}