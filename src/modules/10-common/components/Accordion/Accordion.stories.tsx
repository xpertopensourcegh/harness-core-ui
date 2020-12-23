import React from 'react'
import type { Meta, Story } from '@storybook/react'

import Accordion, { AccordionProps } from './Accordion'

export default {
  title: 'Common / Accordion',
  component: Accordion
} as Meta

export const Basic: Story<AccordionProps> = args => (
  <Accordion {...args}>
    <Accordion.Panel id="1" details="Lorem Ipsum Dolor Sit Amet 1" summary="Tab 1" />
    <Accordion.Panel id="2" details="Lorem Ipsum Dolor Sit Amet 2" summary="Tab 2" />
  </Accordion>
)

Basic.args = {
  activeId: '1'
}
