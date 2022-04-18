import 'intl';
import 'intl/locale-data/jsonp/pt-BR';
import React from 'react';
import '@testing-library/jest-native';
import { render, waitFor, act, fireEvent } from '@testing-library/react-native';
import AxiosMock from 'axios-mock-adapter';

import api from '../../src/services/api';
import FoodDetails from '../../src/pages/FoodDetails';
import formatValue from '../../src/utils/formatValue';
import factory from '../utils/factory';

interface Order {
  id: number;
  name: string;
  description: string;
  price: number;
  category: number;
  image_url: string;
  thumbnail_url: string;
  extras: Extra[];
}

interface Extra {
  id: number;
  name: string;
  value: number;
}

jest.mock('../../src/utils/formatValue.ts', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation((value: number) => {
    const [reals, cents = '00'] = value.toString().split('.');
    return `R$ ${reals},${`${cents}00`.slice(0, 2)}`;
  }),
}));

const mockedNavigate = jest.fn();

jest.mock('@react-navigation/native', () => {
  const current = jest.requireActual('@react-navigation/native');
  return {
    ...current,
    useNavigation: () => ({
      navigate: mockedNavigate,
      setOptions: jest.fn(),
    }),
    useRoute: jest.fn().mockReturnValue({
      params: {
        id: 1,
      },
    }),
  };
});

describe('FoodDetails', () => {
  const apiMock = new AxiosMock(api);

  beforeEach(() => {
    mockedNavigate.mockClear();
  });

  it('should be able to list the food', async () => {
    const order = await factory.attrs<Order>('Order');

    apiMock
      .onGet('/foods/1')
      .reply(200, order)
      .onGet('/favorites/1')
      .reply(200, order);

    const { getByText, getByTestId } = render(<FoodDetails />);

    await waitFor(() => expect(getByText(order.name)).toBeTruthy());

    expect(getByText(order.name)).toBeTruthy();
    expect(getByText(order.description)).toBeTruthy();

    order.extras.forEach(({ name }) => {
      expect(getByText(name)).toBeTruthy();
    });

    expect(getByTestId('food-quantity')).toHaveTextContent('1');

    expect(getByTestId('cart-total')).toHaveTextContent(
      formatValue(order.price),
    );
  });

  it('should be able to increment food quantity', async () => {
    const order = await factory.attrs<Order>('Order');

    apiMock.onGet('/foods/1').reply(200, order);

    const { getByText, getByTestId } = render(<FoodDetails />);

    await waitFor(() => expect(getByText(order.name)).toBeTruthy());

    expect(getByText(order.name)).toBeTruthy();
    expect(getByText(order.description)).toBeTruthy();

    order.extras.forEach(({ name }) => {
      expect(getByText(name)).toBeTruthy();
    });

    expect(getByTestId('food-quantity')).toHaveTextContent('1');

    await act(async () => {
      fireEvent.press(getByTestId('increment-food'));
    });

    expect(getByTestId('food-quantity')).toHaveTextContent('2');

    expect(getByTestId('cart-total')).toHaveTextContent(
      formatValue(order.price * 2),
    );
  });

  it('should be able to decrement food quantity', async () => {
    const order = await factory.attrs<Order>('Order');

    apiMock.onGet('/foods/1').reply(200, order);

    const { getByText, getByTestId } = render(<FoodDetails />);

    await waitFor(() => expect(getByText(order.name)).toBeTruthy());

    expect(getByText(order.name)).toBeTruthy();
    expect(getByText(order.description)).toBeTruthy();

    order.extras.forEach(({ name }) => {
      expect(getByText(name)).toBeTruthy();
    });

    expect(getByTestId('food-quantity')).toHaveTextContent('1');

    await act(async () => {
      fireEvent.press(getByTestId('increment-food'));
    });

    expect(getByTestId('food-quantity')).toHaveTextContent('2');

    await act(async () => {
      fireEvent.press(getByTestId('increment-food'));
    });

    expect(getByTestId('food-quantity')).toHaveTextContent('3');

    await act(async () => {
      fireEvent.press(getByTestId('decrement-food'));
    });

    expect(getByTestId('food-quantity')).toHaveTextContent('2');

    await act(async () => {
      fireEvent.press(getByTestId('decrement-food'));
    });

    expect(getByTestId('food-quantity')).toHaveTextContent('1');

    expect(getByTestId('cart-total')).toHaveTextContent(
      formatValue(order.price),
    );
  });

  it('should not be able to decrement food quantity below than 1', async () => {
    const order = await factory.attrs<Order>('Order');

    apiMock.onGet('/foods/1').reply(200, order);

    const { getByText, getByTestId } = render(<FoodDetails />);

    await waitFor(() => expect(getByText(order.name)).toBeTruthy());

    expect(getByText(order.name)).toBeTruthy();
    expect(getByText(order.description)).toBeTruthy();

    order.extras.forEach(({ name }) => {
      expect(getByText(name)).toBeTruthy();
    });

    expect(getByTestId('food-quantity')).toHaveTextContent('1');

    await act(async () => {
      fireEvent.press(getByTestId('increment-food'));
    });

    expect(getByTestId('food-quantity')).toHaveTextContent('2');

    await act(async () => {
      fireEvent.press(getByTestId('decrement-food'));
    });

    expect(getByTestId('food-quantity')).toHaveTextContent('1');

    await act(async () => {
      fireEvent.press(getByTestId('decrement-food'));
    });

    expect(getByTestId('food-quantity')).toHaveTextContent('1');
  });

  it('should be able to increment an extra item quantity', async () => {
    const order = await factory.attrs<Order>('Order');
    const [extra] = order.extras;

    apiMock.onGet('/foods/1').reply(200, order);

    const { getByText, getByTestId } = render(<FoodDetails />);

    await waitFor(() => expect(getByText(order.name)).toBeTruthy());

    expect(getByText(order.name)).toBeTruthy();
    expect(getByText(order.description)).toBeTruthy();

    order.extras.forEach(({ name }) => {
      expect(getByText(name)).toBeTruthy();
    });

    expect(getByTestId(`extra-quantity-${extra.id}`)).toHaveTextContent('0');

    await act(async () => {
      fireEvent.press(getByTestId(`increment-extra-${extra.id}`));
    });

    expect(getByTestId(`extra-quantity-${extra.id}`)).toHaveTextContent('1');

    await act(async () => {
      fireEvent.press(getByTestId(`increment-extra-${extra.id}`));
    });

    expect(getByTestId(`extra-quantity-${extra.id}`)).toHaveTextContent('2');

    const sum = Number(order.price) + Number(extra.value) * 2;

    expect(getByTestId('cart-total')).toHaveTextContent(formatValue(sum));
  });

  it('should be able to decrement an extra item quantity', async () => {
    const order = await factory.attrs<Order>('Order');
    const [extra] = order.extras;

    apiMock.onGet('/foods/1').reply(200, order);

    const { getByText, getByTestId } = render(<FoodDetails />);

    await waitFor(() => expect(getByText(order.name)).toBeTruthy());

    expect(getByText(order.name)).toBeTruthy();
    expect(getByText(order.description)).toBeTruthy();

    expect(getByText(extra.name)).toBeTruthy();

    expect(getByTestId(`extra-quantity-${extra.id}`)).toHaveTextContent('0');

    await act(async () => {
      fireEvent.press(getByTestId(`increment-extra-${extra.id}`));
    });

    expect(getByTestId(`extra-quantity-${extra.id}`)).toHaveTextContent('1');

    await act(async () => {
      fireEvent.press(getByTestId(`increment-extra-${extra.id}`));
    });

    expect(getByTestId(`extra-quantity-${extra.id}`)).toHaveTextContent('2');

    await act(async () => {
      fireEvent.press(getByTestId(`decrement-extra-${extra.id}`));
    });

    expect(getByTestId(`extra-quantity-${extra.id}`)).toHaveTextContent('1');

    expect(getByTestId('cart-total')).toHaveTextContent(
      formatValue(Number(order.price) + Number(extra.value)),
    );
  });

  it('should not be able to decrement an extra item quantity below than 0', async () => {
    const order = await factory.attrs<Order>('Order');
    const [extra] = order.extras;

    apiMock.onGet('/foods/1').reply(200, order);

    const { getByText, getByTestId } = render(<FoodDetails />);

    await waitFor(() => expect(getByText(order.name)).toBeTruthy());

    expect(getByText(order.name)).toBeTruthy();
    expect(getByText(order.description)).toBeTruthy();

    order.extras.forEach(({ name }) => {
      expect(getByText(name)).toBeTruthy();
    });

    expect(getByTestId(`extra-quantity-${extra.id}`)).toHaveTextContent('0');

    await act(async () => {
      fireEvent.press(getByTestId(`decrement-extra-${extra.id}`));
    });

    expect(getByTestId(`extra-quantity-${extra.id}`)).toHaveTextContent('0');

    expect(getByTestId('cart-total')).toHaveTextContent(
      formatValue(order.price),
    );
  });

  it('should be able to finish the order', async () => {
    const order = await factory.attrs<Order>('Order');

    apiMock
      .onGet(`/foods/1`)
      .reply(200, order)
      .onPost('orders')
      .reply(200, order);

    const { getByText, getByTestId } = render(<FoodDetails />);

    await waitFor(() => expect(getByText(order.name)).toBeTruthy());

    expect(getByText(order.name)).toBeTruthy();
    expect(getByText(order.description)).toBeTruthy();

    order.extras.forEach(extra => {
      expect(getByText(extra.name)).toBeTruthy();
    });

    expect(getByTestId('food-quantity')).toHaveTextContent('1');
    expect(getByTestId('cart-total')).toHaveTextContent(
      formatValue(order.price),
    );

    await act(async () => {
      fireEvent.press(getByTestId('finish'));
    });

    expect(mockedNavigate).toHaveBeenCalledWith('Dashboard');
  });
});
