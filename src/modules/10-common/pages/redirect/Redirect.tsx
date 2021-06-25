import React, { useEffect } from 'react'
import { getLoginPageURL } from 'framework/utils/SessionUtils'
import { validateReturnUrl } from '@common/utils/routeUtils'
import { useQueryParams } from '@common/hooks'

interface RedirectQueryParams {
  returnUrl: string
}
export default function RedirectPage(): JSX.Element {
  const { returnUrl } = useQueryParams<RedirectQueryParams>()
  useEffect(() => {
    window.location.href = validateReturnUrl(returnUrl) ? returnUrl : getLoginPageURL(false)
  }, [])
  return <div>Redirecting...</div>
}
