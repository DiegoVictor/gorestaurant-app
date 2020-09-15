import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import 'jest-styled-components/native';

import SearchInput from '../../src/components/SearchInput';

interface IconProps {
  color: string;
}

jest.mock('react-native-vector-icons/Feather', () => {
  // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
  const styled = require('styled-components/native');

  const Icon = styled.default.Text<IconProps>`
    color: ${({ color }) => color || '#b7b7cc'};
  `;
  return Icon;
});

describe('SearchInput', () => {
  it('should be able highlight the icon when input is focused', async () => {
    let text = '';
    const { getByTestId } = render(
      <SearchInput
        value={text}
        onChangeText={value => {
          text = value;
        }}
      />,
    );

    const container = getByTestId('search-container');
    const inputSearch = getByTestId('search-input');

    expect(container).toHaveStyle({ borderColor: '#f0f0f5' });

    fireEvent.focus(inputSearch);

    expect(container).toHaveStyle({ borderColor: '#c72828' });
  });

  it('should be able to render without previous value', async () => {
    const { getByTestId } = render(<SearchInput />);
    const inputSearch = getByTestId('search-input');

    expect(inputSearch).toBeTruthy();
  });

  it('should be able highlight the icon when input is filled', async () => {
    const { getByTestId } = render(<SearchInput value="Veggie" />);

    const inputSearch = getByTestId('search-input');
    const icon = getByTestId('search-icon');

    expect(icon).toHaveStyle({ color: '#b7b7cc' });

    fireEvent.blur(inputSearch);

    expect(icon).toHaveStyle({ color: '#c72828' });
  });
});
