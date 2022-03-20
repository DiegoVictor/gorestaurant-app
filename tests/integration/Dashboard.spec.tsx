import React from 'react';
import { render, fireEvent, act, wait } from '@testing-library/react-native';
import AxiosMock from 'axios-mock-adapter';

import api from '../../src/services/api';
import Dashboard from '../../src/pages/Dashboard';
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

interface Category {
  id: number;
  title: string;
  image_url: string;
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

describe('Dashboard', () => {
  const apiMock = new AxiosMock(api);

  beforeEach(() => {
    mockedNavigate.mockClear();
  });

  it('should be able to back to home', async () => {
    apiMock.onGet('/categories').reply(200, []).onGet('/foods').reply(200, []);

    const { getByTestId } = render(<Dashboard />);

    await act(async () => {
      fireEvent.press(getByTestId('back'));
    });

    expect(mockedNavigate).toHaveBeenCalledWith('Home');
  });

  it('should be able to list the food plates', async () => {
    const category = await factory.attrs<Category>('Category');
    const order = await factory.attrs<Order>('Order');

    apiMock
      .onGet('/categories')
      .reply(200, [category])
      .onGet('/foods')
      .reply(200, [order]);

    const { getByText } = render(<Dashboard />);

    await wait(() => expect(getByText(order.name)).toBeTruthy(), {
      timeout: 200,
    });

    expect(getByText(order.name)).toBeTruthy();
    expect(getByText(order.description)).toBeTruthy();
  });

  it('should be able to list the food plates filtered by category', async () => {
    const categories = await factory.attrsMany<Category>('Category', 2);
    const [category] = categories;
    const orders = await factory.attrsMany<Order>(
      'Order',
      2,
      categories.map(({ id }) => ({ category: id })),
    );

    apiMock
      .onGet('/foods')
      .reply(config => {
        if (config.params.category_like) {
          return [
            200,
            orders.filter(
              order => order.category === config.params.category_like,
            ),
          ];
        }
        return [200, orders];
      })
      .onGet('/categories')
      .reply(200, categories);

    const { getByText, queryByText, getByTestId } = render(<Dashboard />);

    await wait(() => expect(getByText(category.title)).toBeTruthy(), {
      timeout: 200,
    });

    categories.forEach(({ title }) => {
      expect(getByText(title)).toBeTruthy();
    });

    orders.forEach(({ name }) => {
      expect(getByText(name)).toBeTruthy();
    });

    await act(async () => {
      fireEvent.press(getByTestId(`category-${orders[0].category}`));
    });

    expect(getByText(orders[0].name)).toBeTruthy();

    expect(queryByText(orders[1].name)).toBeFalsy();

    await act(async () => {
      fireEvent.press(getByTestId(`category-${orders[1].category}`));
    });

    expect(queryByText(orders[0].name)).toBeFalsy();
    expect(getByText(orders[1].name)).toBeTruthy();

    await act(async () => {
      fireEvent.press(getByTestId(`category-${orders[1].category}`));
    });

    orders.forEach(order => {
      expect(getByText(order.name)).toBeTruthy();
    });
  });

  it('should be able to list the food plates filtered by name search', async () => {
    const categories = await factory.attrsMany<Category>('Category', 2);
    const [category] = categories;
    const orders = await factory.attrsMany<Order>('Order', 2);

    apiMock
      .onGet('/foods')
      .reply(config => {
        if (config.params.name_like) {
          return [
            200,
            orders.filter(({ name }) => name === config.params.name_like),
          ];
        }

        return [200, orders];
      })
      .onGet('/categories')
      .reply(200, categories);

    const { getByText, queryByText, getByTestId } = render(<Dashboard />);

    await wait(() => expect(getByText(category.title)).toBeTruthy(), {
      timeout: 200,
    });

    categories.forEach(({ title }) => {
      expect(getByText(title)).toBeTruthy();
    });

    orders.forEach(({ name }) => {
      expect(getByText(name)).toBeTruthy();
    });

    const inputSearch = getByTestId('search-input');

    await act(async () => {
      fireEvent.changeText(inputSearch, orders[0].name);
    });

    expect(getByText(orders[0].name)).toBeTruthy();

    expect(queryByText(orders[1].name)).toBeFalsy();

    await act(async () => {
      fireEvent.changeText(inputSearch, orders[1].name);
    });

    expect(queryByText(orders[0].name)).toBeFalsy();

    expect(getByText(orders[1].name)).toBeTruthy();

    await act(async () => {
      fireEvent.changeText(inputSearch, '');
    });

    expect(getByText(orders[0].name)).toBeTruthy();

    expect(queryByText(orders[1].name)).toBeTruthy();
  });

  it('should be able to navigate to the food details page', async () => {
    const category = await factory.attrs<Category>('Category');
    const order = await factory.attrs<Order>('Order');

    apiMock
      .onGet('/categories')
      .reply(200, [category])
      .onGet('/foods')
      .reply(200, [order])
      .onGet('/foods?name_like=')
      .reply(200, [order]);

    const { getByText, getByTestId } = render(<Dashboard />);

    await wait(() => expect(getByText(order.name)).toBeTruthy(), {
      timeout: 200,
    });

    await act(async () => {
      fireEvent.press(getByTestId(`food-${order.id}`));
    });

    expect(getByTestId(`food-${order.id}`)).toBeTruthy();

    expect(mockedNavigate).toHaveBeenCalledTimes(1);

    expect(mockedNavigate).toHaveBeenCalledWith('FoodDetails', {
      id: order.id,
    });
  });
});
