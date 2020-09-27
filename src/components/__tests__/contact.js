import React from 'react';
import renderer from 'react-test-renderer';

import Contact from '../contact';

describe('Contact', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<Contact />);
    tree.unmount();
  });
});
