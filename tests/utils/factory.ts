import faker from 'faker';
import factory from 'factory-girl';

factory.define(
  'Category',
  {},
  {
    id: faker.random.number,
    title: faker.name.title,
    image_url: faker.image.imageUrl,
  },
);

factory.define(
  'Order',
  {},
  {
    id: faker.random.number,
    name: faker.name.title,
    description: faker.lorem.paragraph,
    price: faker.finance.amount,
    category: faker.random.number,
    image_url: faker.image.imageUrl,
    thumbnail_url: faker.image.imageUrl,
    extras: [
      {
        id: faker.random.number,
        name: faker.name.title,
        value: faker.finance.amount,
      },
    ],
  },
);

factory.define(
  'Extra',
  {},
  {
    id: faker.random.number,
    name: faker.name.title,
    value: faker.finance.amount,
  },
);

export default factory;
