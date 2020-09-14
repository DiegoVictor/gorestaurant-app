import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/Feather';
import { Alert } from 'react-native';

import api from '../services/api';
import TabRoutes from './tab.routes';
import Home from '../pages/Home';
import FoodDetails from '../pages/FoodDetails';

interface Params {
  id: number;
}

const App = createStackNavigator();

const AppRoutes: React.FC = () => {
  const [foodId, setFoodId] = useState<number | undefined>();
  const [loading, setLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const favoriteIconName = useMemo(
    () => (isFavorite ? 'favorite' : 'favorite-border'),
    [isFavorite],
  );

  const toggleFavorite = useCallback(
    async id => {
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
            } = await api.get(`/foods/${id}`);
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
    },
    [isFavorite, loading],
  );

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
      <App.Navigator initialRouteName="Home">
        <App.Screen
          options={{
            cardStyle: { backgroundColor: '#C72828' },
            headerShown: false,
          }}
          name="Home"
          component={Home}
        />
        <App.Screen
          name="MainBottom"
          component={TabRoutes}
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        <App.Screen
          name="FoodDetails"
          component={FoodDetails}
          options={({ navigation, route }) => ({
            headerLeft: () => (
              <Icon
                name="arrow-left"
                size={24}
                color="#FFB84D"
                onPress={() => navigation.goBack()}
              />
            ),
            headerLeftContainerStyle: {
              marginLeft: 24,
            },
            headerRight: () => {
              const { id } = route.params as Params;
              if (id !== foodId) {
                setFoodId(id);
              }

              // Add the favorite icon on the right of the header bar
              return (
                <MaterialIcon
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
              marginRight: 24,
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
      </App.Navigator>
    </NavigationContainer>
  );
};
export default AppRoutes;
