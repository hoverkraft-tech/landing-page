import React from 'react';
import renderer from 'react-test-renderer';

import About from '../about';

describe('About', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<About />);
    tree.unmount();
  });
});
