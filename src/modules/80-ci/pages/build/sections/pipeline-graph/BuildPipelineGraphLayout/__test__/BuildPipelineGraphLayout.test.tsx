import React from 'react'
import { render } from '@testing-library/react'
import BuildPipelineGraphLayout, {
  BuildPipelineGraphLayoutProps,
  BuildPipelineGraphLayoutType
} from '../BuildPipelineGraphLayout'

const getProps = (): BuildPipelineGraphLayoutProps => ({
  layoutType: BuildPipelineGraphLayoutType.BOTTOM,
  changeLayout: <div />,
  stageSelect: <div />,
  stagesPipeline: <div />,
  stepsPipeline: <div />,
  stepTitle: <div />,
  stepTabs: [{ title: <div />, content: <div /> }],
  stepLogs: <div />
})

describe('BuildPipelineGraphLayout snapshot test', () => {
  test('should render properly', async () => {
    // BOTTOM
    const { container, rerender } = render(
      <BuildPipelineGraphLayout {...getProps()} layoutType={BuildPipelineGraphLayoutType.BOTTOM} />
    )
    expect(container).toMatchSnapshot()

    // FLOAT
    const container2 = rerender(
      <BuildPipelineGraphLayout {...getProps()} layoutType={BuildPipelineGraphLayoutType.FLOAT} />
    )
    expect(container2).toMatchSnapshot()

    // RIGHT
    const container3 = rerender(
      <BuildPipelineGraphLayout {...getProps()} layoutType={BuildPipelineGraphLayoutType.RIGHT} />
    )
    expect(container3).toMatchSnapshot()
  })
})
