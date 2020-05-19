import React from 'react'
import { Route, RouteProps } from 'react-router-dom'
import Authentication from 'common/Authentication'

const PrivateRoute: React.FC<RouteProps> = ({ children, ...rest }) => {
  return (
    <Route
      {...rest}
      render={({ location }) => {
        if (!Authentication.isAuthenticated()) {
          window.location.href = `/#/login?returnUrl=${location.pathname}`
          return null
        }
        return children
      }}
    />
  )
}

export default PrivateRoute
