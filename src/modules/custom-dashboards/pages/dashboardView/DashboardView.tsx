import React from 'react'
import { useParams } from 'react-router-dom'
import { useMutate } from 'restful-react'
import { Page } from '@common/exports'
// import { useStrings } from 'framework/exports'
import css from './DashboardView.module.scss'

const DashboardViewPage: React.FC = () => {
  // const { getString } = useStrings()
  const { accountId, viewId } = useParams()
  const [embedUrl, setEmbedUrl] = React.useState('')
  const external_user_id = decodeURI(atob(localStorage.getItem('email') || '')) /* eslint-disable-line */
  const account_id = decodeURI(atob(localStorage.getItem('accountId') || '')) /* eslint-disable-line */
  const { mutate: createSignedUrl, loading, error } = useMutate({
    verb: 'POST',
    path: 'insights/signedUrl',
    queryParams: { accountId: accountId, src: `/embed/dashboards-next/${viewId}` }
  })
  const generateSignedUrl = async () => {
    const { resource } = await createSignedUrl({
      external_user_id: external_user_id /* eslint-disable-line */,
      first_name: external_user_id.split('@')[0] /* eslint-disable-line */,
      permissions: 'editor',
      user_attributes /* eslint-disable-line */: {
        accountName: external_user_id.split('@')[1] /* eslint-disable-line */,
        companyName: external_user_id.split('@')[1] /* eslint-disable-line */,
        licenseInfo: 'PAID',
        dataset: account_id /* eslint-disable-line */,
        accountId: account_id /* eslint-disable-line */
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
      <iframe src={embedUrl} height="100%" width="100%" frameBorder="0" />
    </Page.Body>
  )
}

export default DashboardViewPage
