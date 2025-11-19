import React, { useEffect, useState } from 'react';
import { Image, ListRenderItemInfo } from 'react-native';

import api from '../../services/api';
import formatValue from '../../utils/formatValue';

import {
  Container,
  Header,
  HeaderTitle,
  FoodsContainer,
  FoodList,
  Food,
  FoodImageContainer,
  FoodContent,
  FoodTitle,
  FoodDescription,
  FoodPricing,
} from './styles';

interface Food {
  id: number;
  name: string;
  description: string;
  price: number;
  thumbnail_url: string;
  formattedPrice: string;
}

export const Favorites: React.FC = () => {
  const [favorites, setFavorites] = useState<Food[]>([]);

  useEffect(() => {
    async function loadFavorites(): Promise<void> {
      const { data } = await api.get<Food[]>('favorites');
      setFavorites(
        data.map(food => ({
          ...food,
          formattedPrice: formatValue(food.price),
        })),
      );
    }

    loadFavorites();
  }, []);

  return (
    <Container>
      <Header>
        <HeaderTitle>Meus favoritos</HeaderTitle>
      </Header>

      <FoodsContainer>
        <FoodList
          data={favorites}
          keyExtractor={(item: Food) => String(item.id)}
          renderItem={({ item }: ListRenderItemInfo<Food>) => (
              <FoodImageContainer>
                <Image
                  style={{ width: 88, height: 88 }}
                  source={{ uri: item.thumbnail_url }}
                />
              </FoodImageContainer>
              <FoodContent>
                <FoodTitle>{item.name}</FoodTitle>
                <FoodDescription>{item.description}</FoodDescription>
                <FoodPricing>{item.formattedPrice}</FoodPricing>
              </FoodContent>
            </Food>
          )}
        />
      </FoodsContainer>
    </Container>
  );
};
