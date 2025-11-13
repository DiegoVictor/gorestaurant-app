import React from 'react';
import { Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@react-native-vector-icons/feather';

import Background from '../../assets/home-background.png';
import Logo from '../../assets/logo.png';
import {
  Header,
  BackgroundImage,
  Title,
  NavigationButton,
  ButtonText,
  IconContainer,
  Container,
  Content,
} from './styles';
import { StackScreenProps } from '@react-navigation/stack';
import { StackParamList } from 'src/routes/app.routes';

type NavigateProps = StackScreenProps<StackParamList>['navigation'];

export const Home: React.FC = () => {
  const navigation = useNavigation<NavigateProps>();

  async function handleNavigate(): Promise<void> {
    navigation.navigate('TabMenu', {
      screen: 'Dashboard',
    });
  }

  return (
    <Container>
      <BackgroundImage
        source={Background}
        imageStyle={{
          width: 313,
          height: 427,
        }}
      />
      <Content>
        <Header>
          <Image source={Logo} />
          <Title>Uma verdadeira experiência Italiana.</Title>
        </Header>
        <NavigationButton onPress={() => handleNavigate()}>
          <ButtonText>Entrar no Restaurante</ButtonText>
          <IconContainer>
            <Feather name="log-in" size={24} color="#7A1818" />
          </IconContainer>
        </NavigationButton>
      </Content>
    </Container>
  );
};
