import React, { useState, useCallback } from 'react';
import { TextInputProps } from 'react-native';

import { Container, TextInput } from './styles';
import { Feather } from '@react-native-vector-icons/feather';

interface InputProps extends TextInputProps {
  name?: string;
}

const SearchInput: React.FC<InputProps> = ({ value = '', ...rest }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);

    setIsFilled(!!value);
  }, [value]);

  return (
    <Container testID="search-container" isFocused={isFocused}>
      <Feather
        testID="search-icon"
        style={{ marginRight: 16 }}
        name="search"
        size={20}
        color={isFocused || isFilled ? '#c72828' : '#b7b7cc'}
      />

      <TextInput
        placeholderTextColor="#B7B7CC"
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        value={value}
        testID="search-input"
        {...rest}
      />
    </Container>
  );
};

export default SearchInput;
