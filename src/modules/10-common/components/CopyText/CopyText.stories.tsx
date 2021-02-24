import React from 'react'
import type { Story, Meta } from '@storybook/react'
import styled from '@emotion/styled'
import { TestWrapper } from '@common/utils/testUtils'

import { CopyText, CopyTextProps } from './CopyText'

export default {
  title: 'Common / CopyText',
  component: CopyText,
  argTypes: {}
} as Meta

const Wrapper = styled.div`
  width: 300px;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 10px;
`

export const Basic: Story<CopyTextProps> = args => (
  <TestWrapper>
    <Wrapper>
      <CopyText {...args} />
    </Wrapper>
  </TestWrapper>
)

Basic.args = {
  children: 'Hello World',
  textToCopy: 'Hello World!'
}
