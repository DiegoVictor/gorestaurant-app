import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import AxiosMock from 'axios-mock-adapter';

import api from '../../src/services/api';
import Orders from '../../src/pages/Orders';
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

describe('Orders', () => {
  it('should be able to list the orders', async () => {
    const orders = await factory.attrsMany<Order>('Order', 2);

    apiMock.onGet('/orders').reply(200, orders);

    const { getByText } = render(<Orders />);

    const [order] = orders;
    await waitFor(() => getByText(order.name));

    orders.forEach(({ name, description }) => {
      expect(getByText(name)).toBeTruthy();
      expect(getByText(description)).toBeTruthy();
    });
  });
});
