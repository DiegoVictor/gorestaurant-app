import React from 'react';
import { Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

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

const Home: React.FC = () => {
  const navigation = useNavigation();

  async function handleNavigate(): Promise<void> {
    navigation.navigate('MainBottom', {
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
            <Icon name="log-in" size={24} color="#7A1818" />
          </IconContainer>
        </NavigationButton>
      </Content>
    </Container>
  );
};

export default Home;
