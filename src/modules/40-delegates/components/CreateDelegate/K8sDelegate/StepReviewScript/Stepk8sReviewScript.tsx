import React from 'react'
import { Button, Layout, StepProps, Collapse, IconName, Heading, Text, Link, Color } from '@wings-software/uicore'
import { useStrings } from 'framework/exports'
import YamlBuilder from '@common/components/YAMLBuilder/YamlBuilder'
import type { DelegateInfoDTO } from '@delegates/DelegateInterface'
import css from '../CreateK8sDelegate.module.scss'

const Stepk8ReviewScript: React.FC<StepProps<DelegateInfoDTO>> = props => {
  const { previousStep } = props
  const { getString } = useStrings()
  const onClickBack = (): void => {
    previousStep?.()
  }
  const collapseProps = {
    collapsedIcon: 'main-chevron-up' as IconName,
    expandedIcon: 'main-chevron-down' as IconName,
    isRemovable: false,
    isOpen: true
  }
  return (
    <>
      <Layout.Horizontal spacing="large" style={{ height: '130px', background: '#ECF6FD' }}></Layout.Horizontal>
      <Layout.Horizontal>
        <Layout.Vertical padding="xlarge" spacing="medium">
          <div className={css.collapseDiv}>
            <Collapse {...collapseProps}>
              <YamlBuilder
                entityType="Secrets"
                fileName={`harness-delegate.yaml`}
                isReadOnlyMode={true}
                showSnippetSection={false}
                width="568px"
                height="462px"
              />
            </Collapse>
          </div>
          <Layout.Horizontal padding="small">
            <Button
              icon="arrow-down"
              text={getString('delegate.downloadScript')}
              className={css.downloadButton}
              outlined
            />
          </Layout.Horizontal>
          <Layout.Horizontal padding="small">
            <Button
              id="stepReviewScriptBackButton"
              text={getString('back')}
              onClick={onClickBack}
              icon="chevron-left"
              margin={{ right: 'small' }}
            />
            <Button
              id="stepReviewScriptContinueButton"
              type="submit"
              intent="primary"
              text={getString('continue')}
              rightIcon="chevron-right"
            />
          </Layout.Horizontal>
        </Layout.Vertical>
        <Layout.Vertical spacing="medium">
          <Layout.Horizontal padding="medium">
            <Heading level={2} style={{ color: '#22272D', fontWeight: 600 }}>
              {getString('delegate.reviewScript.configProxySettings')}
            </Heading>
          </Layout.Horizontal>
          <Layout.Horizontal padding="small">
            <Text lineClamp={3} width={514} font="small">
              {getString('delegate.reviewScript.descriptionProxySettings')}
              <Link href="https:app.harness.io:443" color={Color.GREY_800} font={{ size: 'normal' }}>
                More info
              </Link>
            </Text>
          </Layout.Horizontal>
        </Layout.Vertical>
      </Layout.Horizontal>
    </>
  )
}

export default Stepk8ReviewScript
