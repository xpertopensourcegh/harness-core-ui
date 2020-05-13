import React from 'react';
import { render } from '@testing-library/react';

import PipelineStudio from '../PipelineStudio';

describe('PipelineStudio tests', () => {
  test('page snapshot', () => {
    const { container } = render(<PipelineStudio />);
    expect(container).toMatchSnapshot();
  });
});
