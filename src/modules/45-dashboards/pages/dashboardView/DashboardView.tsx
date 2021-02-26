import React from 'react'
// import { Drawer, Position } from '@blueprintjs/core'
import { useParams } from 'react-router-dom'
import { useMutate } from 'restful-react'
import { Layout } from '@wings-software/uicore'
import { useGet } from 'restful-react'
import routes from '@common/RouteDefinitions'
import { Page } from '@common/exports'
import { Breadcrumbs } from '@common/components/Breadcrumbs/Breadcrumbs'
import css from './DashboardView.module.scss'

// import { WizardLibrary } from '../../components/WidgetLibrary/WidgetLibrary'

const DashboardViewPage: React.FC = () => {
  // const { getString } = useStrings()
  const { accountId, viewId } = useParams()
  const [embedUrl, setEmbedUrl] = React.useState('')
  const [iframeState] = React.useState(0)
  // const [isDrawerOpen, setDrawerState] = React.useState(false)
  const external_user_id = decodeURI(atob(localStorage.getItem('email') || '')) /* eslint-disable-line */

  const { mutate: createSignedUrl, loading, error } = useMutate({
    verb: 'POST',
    path: 'insights/signedUrl',
    queryParams: { accountId: accountId, src: `/embed/dashboards-next/${viewId}` }
  })

  const { data: dashboardData } = useGet({
    path: `insights/dashboard/${viewId}/isEmpty`,
    queryParams: { accountId: accountId }
  })

  const generateSignedUrl = async () => {
    const { resource } = await createSignedUrl({
      external_user_id: external_user_id.replace(/['"]+/g, '') /* eslint-disable-line */,
      first_name: external_user_id.replace(/['"]+/g, '').split('@')[0] /* eslint-disable-line */,
      permissions: 'editor',
      user_attributes /* eslint-disable-line */: {
        accountName: external_user_id.replace(/['"]+/g, '').split('@')[1] /* eslint-disable-line */,
        companyName: external_user_id.replace(/['"]+/g, '').split('@')[1] /* eslint-disable-line */,
        licenseInfo: 'PAID',
        dataset: accountId,
        accountId: accountId
      }
    })
    setEmbedUrl(resource)
  }

  React.useEffect(() => {
    generateSignedUrl()
  }, [viewId])

  return (
    <Page.Body
      className={css.pageContainer}
      loading={loading}
      retryOnError={() => {
        return
      }}
      error={(error?.data as Error)?.message}
      noData={{
        when: () => embedUrl === '',
        icon: 'dashboard',
        message: 'Dashboard not available'
      }}
    >
      <Breadcrumbs
        className={css.breadCrumb}
        links={[
          {
            url: routes.toCustomDasboardHome({ accountId }),
            label: 'All Dashboards'
          },
          {
            url: routes.toCustomDasboardHome({ accountId }),
            label: dashboardData?.title
          }
        ]}
      />

      <Layout.Vertical className={css.frame}>
        <iframe src={embedUrl} key={iframeState} height="100%" width="100%" frameBorder="0" id="dashboard-render" />
        {/* {!dashboardData?.isHarnessDashboard && (
          <Layout.Vertical
            padding="medium"
            background={Color.GREY_100}
            style={{ borderBottom: '1px solid var(--grey-200)' }}
          >
            <Layout.Horizontal style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Text color={Color.BLACK} font={{ size: 'medium', weight: 'bold' }}>
                {dashboardData?.title}
              </Text>
              {dashboardData && !dashboardData.resource && (
                <Button
                  intent="primary"
                  text={'Add Visulization'}
                  style={{ background: 'var(--blue-700)', borderColor: 'var(--blue-700)', width: '200px' }}
                  onClick={() => setDrawerState(true)}
                />
              )}
            </Layout.Horizontal>
          </Layout.Vertical>
        )}
        {dashboardData && dashboardData.resource && (
          <Layout.Vertical
            style={{ height: 'calc(100% - 62px)', justifyContent: 'center', alignItems: 'center' }}
            spacing="large"
          >
            <Text>Your Dashboard is Empty</Text>
            <Button
              intent="primary"
              text={'Add Visulization'}
              style={{ background: 'var(--blue-700)', borderColor: 'var(--blue-700)', width: '200px' }}
              onClick={() => setDrawerState(true)}
            />
          </Layout.Vertical>
        )}
        {dashboardData && !dashboardData.resource && (
          <iframe src={embedUrl} key={iframeState} height="100%" width="100%" frameBorder="0" id="dashboard-render" />
        )} */}
      </Layout.Vertical>

      {/* <Drawer
        onClose={() => {
          setDrawerState(false)
        }}
        usePortal={false}
        autoFocus={true}
        canEscapeKeyClose={true}
        canOutsideClickClose={true}
        enforceFocus={true}
        hasBackdrop={true}
        size={700}
        isOpen={isDrawerOpen}
        position={Position.RIGHT}
      >
        <WizardLibrary
          onClose={() => {
            setIframeState(iframeState + 1)
            generateSignedUrl()
            setDrawerState(false)
          }}
        />
      </Drawer> */}
    </Page.Body>
  )
}

export default DashboardViewPage
