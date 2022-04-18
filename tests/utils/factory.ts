import faker from '@faker-js/faker';
import factory from 'factory-girl';

factory.define(
  'Category',
  {},
  {
    id: faker.datatype.number,
    title: faker.name.jobTitle,
    image_url: faker.image.imageUrl,
  },
);

factory.define(
  'Order',
  {},
  {
    id: faker.datatype.number,
    name: faker.name.jobTitle,
    description: faker.lorem.paragraph,
    price: faker.finance.amount,
    category: faker.datatype.number,
    image_url: faker.image.imageUrl,
    thumbnail_url: faker.image.imageUrl,
    extras: [
      {
        id: faker.datatype.number,
        name: faker.name.jobTitle,
        value: faker.finance.amount,
      },
    ],
  },
);

factory.define(
  'Extra',
  {},
  {
    id: faker.datatype.number,
    name: faker.name.jobTitle,
    value: faker.finance.amount,
  },
);

export default factory;
