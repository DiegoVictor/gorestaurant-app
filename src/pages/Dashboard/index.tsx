import React, { useEffect, useState } from 'react';
import { Image, ScrollView } from 'react-native';
import { Feather } from '@react-native-vector-icons/feather';
import { useNavigation } from '@react-navigation/native';

import Logo from '../../assets/logo-header.png';
import SearchInput from '../../components/SearchInput';
import api from '../../services/api';
import formatValue from '../../utils/formatValue';

import {
  Container,
  Header,
  FilterContainer,
  Title,
  CategoryContainer,
  CategorySlider,
  CategoryItem,
  CategoryItemTitle,
  FoodsContainer,
  FoodList,
  Food,
  FoodImageContainer,
  FoodContent,
  FoodTitle,
  FoodDescription,
  FoodPricing,
} from './styles';
import { StackScreenProps } from '@react-navigation/stack';
import { StackParamList } from 'src/routes/app.routes';

interface Food {
  id: number;
  name: string;
  description: string;
  price: number;
  thumbnail_url: string;
  formattedPrice: string;
}

interface Category {
  id: number;
  title: string;
  image_url: string;
}

interface FoodRequest {
  category_like?: number;
  name_like?: string;
}

type NavigateProps = StackScreenProps<StackParamList>['navigation'];

const Dashboard: React.FC = () => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<
    number | undefined
  >();
  const [searchValue, setSearchValue] = useState('');

  const navigation = useNavigation<NavigateProps>();

  async function handleNavigate(id: number): Promise<void> {
    navigation.navigate('Food', { id });
  }

  useEffect(() => {
    async function loadFoods(): Promise<void> {
      const params: FoodRequest = {};

      if (selectedCategory) {
        params.category_like = selectedCategory;
      }

      if (searchValue.length > 0) {
        params.name_like = searchValue;
      }

      const { data } = await api.get<Food[]>('foods', {
        params,
      });
      setFoods(
        data.map(food => ({
          ...food,
          formattedPrice: formatValue(food.price),
        })),
      );
    }

    if (categories.length > 0) {
      loadFoods();
    }
  }, [selectedCategory, searchValue, categories]);

  useEffect(() => {
    (async () => {
      const { data } = await api.get<Category[]>('categories');
      setCategories(data);
    })();
  }, []);

  function handleSelectCategory(id: number): void {
    setSelectedCategory(state => (state === id ? undefined : id));
  }

  return (
    <Container>
      <Header>
        <Image source={Logo} />
        <Feather
          testID="back"
          name="log-out"
          size={24}
          color="#FFB84D"
          onPress={() => navigation.navigate('Home')}
        />
      </Header>
      <FilterContainer>
        <SearchInput
          value={searchValue}
          onChangeText={setSearchValue}
          placeholder="Qual comida você procura?"
        />
      </FilterContainer>
      <ScrollView>
        <CategoryContainer>
          <Title>Categorias</Title>
          <CategorySlider
            contentContainerStyle={{
              paddingHorizontal: 20,
            }}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {categories.map(category => (
              <CategoryItem
                key={category.id}
                isSelected={category.id === selectedCategory}
                onPress={() => handleSelectCategory(category.id)}
                activeOpacity={0.6}
                testID={`category-${category.id}`}
              >
                <Image
                  style={{ width: 56, height: 56 }}
                  source={{ uri: category.image_url }}
                />
                <CategoryItemTitle testID={`category-title-${category.id}`}>
                  {category.title}
                </CategoryItemTitle>
              </CategoryItem>
            ))}
          </CategorySlider>
        </CategoryContainer>
        <FoodsContainer>
          <Title>Pratos</Title>
          <FoodList>
            {foods.map(food => (
              <Food
                key={food.id}
                onPress={() => handleNavigate(food.id)}
                activeOpacity={0.6}
                testID={`food-${food.id}`}
              >
                <FoodImageContainer>
                  <Image
                    style={{ width: 88, height: 88 }}
                    source={{ uri: food.thumbnail_url }}
                  />
                </FoodImageContainer>
                <FoodContent>
                  <FoodTitle>{food.name}</FoodTitle>
                  <FoodDescription>{food.description}</FoodDescription>
                  <FoodPricing>{food.formattedPrice}</FoodPricing>
                </FoodContent>
              </Food>
            ))}
          </FoodList>
        </FoodsContainer>
      </ScrollView>
    </Container>
  );
};

export default Dashboard;
