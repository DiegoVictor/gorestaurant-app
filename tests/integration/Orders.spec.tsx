import React from 'react';
import { render, wait } from '@testing-library/react-native';
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
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
      navigate: mockedNavigate,
    }),
  };
});

describe('Orders', () => {
  const apiMock = new AxiosMock(api);

  it('should be able to list the orders', async () => {
    const orders = await factory.attrsMany<Order>('Order', 2);

    apiMock.onGet('/orders').reply(200, orders);

    const { getByText } = render(<Orders />);

    await wait(() => expect(getByText(orders[0].name)).toBeTruthy(), {
      timeout: 200,
    });

    orders.forEach(order => {
      expect(getByText(order.name)).toBeTruthy();
      expect(getByText(order.description)).toBeTruthy();
    });
  });
});
