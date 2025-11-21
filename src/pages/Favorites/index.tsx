import React, { useEffect, useState } from 'react';
import { Image, ListRenderItemInfo } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { api } from '../../services/api';
import { formatValue } from '../../utils/formatValue';
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
import { StackParamList } from '../../routes/app.routes';

interface Food {
  id: number;
  name: string;
  description: string;
  price: number;
  thumbnail_url: string;
  formattedPrice: string;
}

type NavigateProps = StackScreenProps<StackParamList>['navigation'];

export const Favorites: React.FC = () => {
  const [favorites, setFavorites] = useState<Food[]>([]);
  const isFocused = useIsFocused();

  const navigation = useNavigation<NavigateProps>();
  async function handleNavigate(id: number): Promise<void> {
    navigation.navigate('FoodDetail', { id });
  }

  const loadFavorites = async (): Promise<void> => {
    const { data } = await api.get<Food[]>('favorites');
    setFavorites(
      data.map(food => ({
        ...food,
        formattedPrice: formatValue(food.price),
      })),
    );
  };

  useEffect(() => {
    loadFavorites();
  }, [isFocused]);

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
            <Food
              activeOpacity={0.6}
              onPress={() => handleNavigate(item.id)}
              testID={`food-${item.id}`}
            >
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
