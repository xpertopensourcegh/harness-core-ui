import React from 'react'
import PrivateRoute from 'framework/PrivateRoute'
import { PipelineStudioPage } from 'modules/cd/pages/pipeline-studio/PipelineStudioPage'

const Routes: React.FC = () => (
  <PrivateRoute path="/pipeline-studio">
    <PipelineStudioPage />
  </PrivateRoute>
)

export default Routes
