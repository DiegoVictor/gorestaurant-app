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
  const current = jest.requireActual('@react-navigation/native');
  return {
    ...current,
    useNavigation: () => ({
      navigate: mockedNavigate,
    }),
  };
});

describe('Favorites', () => {
  const apiMock = new AxiosMock(api);

  it('should be able to list the favorite food plates', async () => {
    const orders = await factory.attrsMany<Order>('Order', 2);

    apiMock.onGet('/favorites').reply(200, orders);

    const { getByText } = render(<Favorites />);

    await waitFor(() => expect(getByText(orders[0].name)).toBeTruthy());

    orders.forEach(order => {
      expect(getByText(order.name)).toBeTruthy();
      expect(getByText(order.description)).toBeTruthy();
    });
  });
});
