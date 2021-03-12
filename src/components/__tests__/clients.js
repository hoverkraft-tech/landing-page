import React from 'react';
import renderer from 'react-test-renderer';

import Clients from '../clients';

describe('Clients', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<Clients />);
    tree.unmount();
  });
});
