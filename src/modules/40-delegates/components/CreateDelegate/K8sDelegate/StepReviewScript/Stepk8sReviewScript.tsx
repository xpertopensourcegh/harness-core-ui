import React from 'react'
import { useParams } from 'react-router-dom'
import { Button, Layout, StepProps, Heading, Text, Link, Color } from '@wings-software/uicore'
import { useStrings } from 'framework/exports'
import YamlBuilder from '@common/components/YAMLBuilder/YamlBuilder'
import { useGenerateKubernetesYaml } from 'services/portal'
import type { StepK8Data } from '@delegates/DelegateInterface'
import css from '../CreateK8sDelegate.module.scss'

const Stepk8ReviewScript: React.FC<StepProps<StepK8Data>> = props => {
  const { getString } = useStrings()
  const { accountId } = useParams()
  const { mutate: downloadYaml } = useGenerateKubernetesYaml({ queryParams: { accountId } })
  const linkRef = React.useRef<HTMLAnchorElement>(null)
  const onDownload = (data: any) => {
    // const downloadLink = document.createElement('a')
    downloadYaml(data)
      .then(response => {
        return new Response(response.body as Blob)
      })
      .then(response => response.blob())
      .then(blob => {
        if (linkRef?.current) {
          linkRef.current.href = window.URL.createObjectURL(blob)
          linkRef.current.download = `harness-delegate-kubernetes.tar.gz`
        }
        // let href = linkRef?.current?.href
        // let download = linkRef?.current?.download
        // href = window.URL.createObjectURL(blob)
        // download = `harness-delegate-kubernetes.tar.gz`

        // document.body.appendChild(downloadLink)

        // downloadLink.dispatchEvent(
        //   new MouseEvent('click', {
        //     bubbles: true,
        //     cancelable: true,
        //     view: window
        //   })
        // )
        linkRef?.current?.click()
      })
      .then(() => {
        // document.body.removeChild(downloadLink)
      })
  }
  return (
    <>
      <Layout.Horizontal>
        <Layout.Vertical padding="xlarge" spacing="medium">
          <div className={css.collapseDiv}>
            <YamlBuilder
              entityType="Delegates"
              fileName={`harness-delegate.yaml`}
              isReadOnlyMode={true}
              existingJSON={props?.prevStepData?.delegateYaml}
              showSnippetSection={false}
              width="568px"
              height="462px"
              theme="DARK"
            />
          </div>
          <Layout.Horizontal padding="small">
            <Button
              icon="arrow-down"
              text={getString('delegate.downloadScript')}
              className={css.downloadButton}
              onClick={() => {
                onDownload(props?.prevStepData?.delegateYaml)
              }}
              outlined
            />
          </Layout.Horizontal>
          <Layout.Horizontal padding="small">
            <Button
              id="stepReviewScriptBackButton"
              text={getString('back')}
              icon="chevron-left"
              onClick={() => props.previousStep?.(props?.prevStepData)}
              margin={{ right: 'small' }}
            />
            <Button
              id="stepReviewScriptContinueButton"
              type="submit"
              intent="primary"
              text={getString('continue')}
              rightIcon="chevron-right"
              onClick={() => props.nextStep?.(props?.prevStepData)}
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
      <a
        className="hide"
        ref={linkRef}
        // ref={hiddenRedirectLink => (this.hiddenRedirectLink = hiddenRedirectLink)}
        target={'_blank'}
      />
    </>
  )
}

export default Stepk8ReviewScript
