import React, { useEffect } from 'react'
import AppStorage from 'common/AppStorage'

const RedirectRoot: React.FC = () => {
  useEffect(() => {
    const accountId = AppStorage.get('acctId')
    if (accountId) {
      location.replace(location.href.split('#')[0] + `#/account/${accountId}/dashboard`)
    } else {
      location.replace('/#/login')
    }
  }, [])

  return null
}

export default RedirectRoot
