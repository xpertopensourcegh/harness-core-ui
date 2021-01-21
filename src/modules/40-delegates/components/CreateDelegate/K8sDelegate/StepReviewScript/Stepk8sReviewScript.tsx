import React from 'react'
import { Button, Layout, StepProps, Accordion, Heading, Text, Link, Color } from '@wings-software/uicore'
import { useStrings } from 'framework/exports'
import YamlBuilder from '@common/components/YAMLBuilder/YamlBuilder'
import type { DelegateInfoDTO } from '@delegates/DelegateInterface'
import css from '../CreateK8sDelegate.module.scss'

const Stepk8ReviewScript: React.FC<StepProps<DelegateInfoDTO>> = props => {
  const { getString } = useStrings()
  /* test script */
  const schema = {
    a: 'b'
  }
  return (
    <>
      <Layout.Horizontal>
        <Layout.Vertical padding="xlarge" spacing="medium">
          <div className={css.collapseDiv}>
            <Accordion activeId="yamlbuilder" collapseProps={{ transitionDuration: 0 }} className={css.yamlAccordion}>
              <Accordion.Panel
                id="yamlbuilder"
                summary={<div className={css.headerLabel}>harness-delegate.yaml</div>}
                details={
                  <YamlBuilder
                    entityType="Delegates"
                    fileName={``}
                    isReadOnlyMode={true}
                    existingJSON={schema}
                    showSnippetSection={false}
                    width="568px"
                    height="462px"
                    theme="DARK"
                  />
                }
              />
            </Accordion>
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
              icon="chevron-left"
              onClick={() => props.previousStep?.()}
              margin={{ right: 'small' }}
            />
            <Button
              id="stepReviewScriptContinueButton"
              type="submit"
              intent="primary"
              text={getString('continue')}
              rightIcon="chevron-right"
              onClick={() => props.nextStep?.()}
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
