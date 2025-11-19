import React, { useMemo, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { MaterialIcons } from '@react-native-vector-icons/material-icons';
import { Feather } from '@react-native-vector-icons/feather';
import { api } from '../services/api';
import { BottomTabParamList, TabRouter } from './tab.routes';
import { Home } from '../pages/Home';
import { FoodDetail } from '../pages/FoodDetail';

interface Params {
  id: number;
}

interface FoodDetail {
  id: number;
  name: string;
  description: string;
  price: number;
  category: number;
  image_url: string;
  thumbnail_url: string;
}

export type StackParamList = {
  Home: undefined;
  TabMenu: {
    screen: keyof BottomTabParamList;
  };
  FoodDetail: {
    id: number;
  };
};

const Stack = createStackNavigator<StackParamList>();

export const App: React.FC = () => {
  const [foodId, setFoodId] = useState<number | undefined>();
  const [loading, setLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const favoriteIconName = useMemo(
    () => (isFavorite ? 'favorite' : 'favorite-border'),
    [isFavorite],
  );

  const toggleFavorite = async (id: number) => {
    if (!loading) {
      setIsFavorite(state => !state);

      setLoading(true);
      if (isFavorite) {
        try {
          await api.delete(`/favorites/${id}`);
        } catch (err) {
          Alert.alert('Não foi possivel remover favorito');
          setIsFavorite(state => !state);
        }
      } else {
        try {
          const {
            data: {
              name,
              description,
              price,
              category,
              image_url,
              thumbnail_url,
            },
          } = await api.get<FoodDetail>(`/foods/${id}`);
          await api.post('favorites', {
            id,
            name,
            description,
            price,
            category,
            image_url,
            thumbnail_url,
          });
        } catch (err) {
          setIsFavorite(state => !state);
        }
      }

      setLoading(false);
    }
  };

  useEffect(() => {
    api
      .get(`/favorites/${foodId}`)
      .then(response => {
        if (response.data) {
          setIsFavorite(true);
        }
      })
      .catch(() => {
        setIsFavorite(false);
      });
  }, [foodId]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          options={{
            cardStyle: { backgroundColor: '#C72828' },
            headerShown: false,
          }}
          name="Home"
          component={Home}
        />
        <Stack.Screen
          name="TabMenu"
          component={TabRouter}
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="FoodDetail"
          component={FoodDetail}
          options={({ navigation, route }) => ({
            headerLeft: () => (
              <Feather
                name="arrow-left"
                size={24}
                color="#FFB84D"
                onPress={() => navigation.goBack()}
              />
            ),
            headerLeftContainerStyle: {
              paddingLeft: 24,
            },
            headerRight: () => {
              const { id } = route.params as Params;
              if (id !== foodId) {
                setFoodId(id);
              }

              // Add the favorite icon on the right of the header bar
              return (
                <MaterialIcons
                  name={favoriteIconName}
                  size={24}
                  color="#FFB84D"
                  onPress={() => {
                    if (foodId) {
                      toggleFavorite(foodId);
                    }
                  }}
                />
              );
            },
            headerRightContainerStyle: {
              paddingRight: 24,
            },
            headerTitle: 'Prato - Massas',
            headerTitleStyle: {
              color: '#fff',
              fontFamily: 'Poppins-Regular',
              fontSize: 16,
            },
            headerStyle: {
              backgroundColor: '#C72828',
              elevation: 0,
              borderWidth: 0,
              shadowColor: 'transparent',
            },
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
