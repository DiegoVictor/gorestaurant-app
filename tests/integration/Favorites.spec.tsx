import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import AxiosMock from 'axios-mock-adapter';

import api from '../../src/services/api';
import Favorites from '../../src/pages/Favorites';
import factory from '../utils/factory';

interface Order {
  id: number;
  name: string;
  description: string;
  price: number;
  category: number;
  image_url: string;
  thumbnail_url: string;
  extras: [
    {
      id: number;
      name: string;
      value: number;
    },
  ];
}

const mockedNavigate = jest.fn();

jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: () => ({
      navigate: mockedNavigate,
    }),
  };
});

const apiMock = new AxiosMock(api);

describe('Favorites', () => {
  it('should be able to list the favorite food plates', async () => {
    const orders = await factory.attrsMany<Order>('Order', 2);

    apiMock.onGet('/favorites').reply(200, orders);

    const { getByText, findByText } = render(<Favorites />);

    const [order] = orders;
    await waitFor(() => findByText(order.name));

    orders.forEach(({ name, description }) => {
      expect(getByText(name)).toBeTruthy();
      expect(getByText(description)).toBeTruthy();
    });
  });
});
