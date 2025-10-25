import { faker } from '@faker-js/faker';
import factory from 'factory-girl';

factory.define(
  'Category',
  {},
  {
    id: faker.number.int,
    title: () =>
      faker.helpers.arrayElement([
        'Meat',
        'Pizza',
        'Pasta',
        'Dessert',
        'Drinks',
      ]),
    image_url: faker.image.url,
  },
);

factory.define(
  'Order',
  {},
  {
    id: faker.number.int,
    name: faker.food.dish,
    description: faker.lorem.paragraph,
    price: faker.finance.amount,
    category: faker.number.int,
    image_url: faker.image.url,
    thumbnail_url: faker.image.url,
    extras: [
      {
        id: faker.number.int,
        name: () =>
          faker.helpers.arrayElement(['Bacon', 'Cheese', 'Onion', 'Egg']),
        value: faker.finance.amount,
      },
    ],
  },
);

factory.define(
  'Extra',
  {},
  {
    id: faker.number.int,
    name: faker.person.jobTitle,
    value: faker.finance.amount,
  },
);

export default factory;
