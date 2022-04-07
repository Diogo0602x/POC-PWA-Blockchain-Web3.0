import React from 'react';

import { StatusBar } from 'expo-status-bar';

import {
  InnerContainer, 
  PageTitle, 
  SubTitle, 
  StyledFormArea, 
  StyledButton, 
  ButtonText,
  Line,
} from '../../../components/styles';

import {
  WelcomeContainer,
  Avatar,
  WelcomeImage
} from './styles';

// keyboard avoiding view
import KeyboardAvoidingWrapper from '../../../components/KeyboardAvoidingWrapper';

const Exames = ({navigation}) => {

  return (
    <>
      <StatusBar style="light"/>
      <InnerContainer>
        <WelcomeImage resizeMode="cover" source={require('../../../assets/img.jpg')} />
        <WelcomeContainer>
          <PageTitle welcome={true}>Seja bem vindo(a) </PageTitle>
          <SubTitle welcome={true}>Pessoa</SubTitle>
          <SubTitle welcome={true}>seu@email.com</SubTitle>
          <StyledFormArea>
            <Avatar resizeMode="cover" source={require('../../../assets/logo.png')} />
            <Line/>
            <StyledButton  onPress={ () => navigation.navigate('TelaInicial')}>
              <ButtonText>Logout</ButtonText>
            </StyledButton>
          </StyledFormArea>
        </WelcomeContainer>
      </InnerContainer>
    </>
  );
};

export default Exames;