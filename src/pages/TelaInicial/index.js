import React from 'react';

import {
  Container,
  Acessar,
  Button,
  Title,
  SubTitle,
  ContainerLogo,
  ContainerForm,
} from './styles';

import * as Animatable from 'react-native-animatable'

export default function TelaInicial({navigation}) {

  return (
    <Container>
      <ContainerLogo> 
        <Animatable.Image
          animation="flipInY"
          source={require('../../../assets/logo.png')}
          style={{ width: '100%', height: '60%' }}
          resizeMode="contain"
        />
      </ContainerLogo>

      <ContainerForm delay={600} animation="fadeInUp">
        <Title>Veja seus exames a qualquer momento, em qualquer lugar! </Title>
        <SubTitle>Faça seu login para ver seus exames</SubTitle>
      </ContainerForm>

      <Button onPress={ () => navigation.navigate('Login')}>
        <Acessar>Acessar</Acessar>
      </Button>
    </Container>
  );
}