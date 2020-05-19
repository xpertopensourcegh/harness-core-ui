import React from 'react'

import PrivateRoute from 'common/PrivateRoute'

import PipelineStudio from 'modules/cd/pages/PipelineStudio/PipelineStudio'

const Routes: React.FC = () => (
  <PrivateRoute path="/pipeline-studio">
    <PipelineStudio />
  </PrivateRoute>
)

export default Routes
