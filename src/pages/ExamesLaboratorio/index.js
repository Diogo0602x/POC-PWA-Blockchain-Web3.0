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

const ExamesLaboratorio = ({navigation, route}) => {
const organization = route.params;
const idCNPJ = organization.result.id;
const nameCNPJ = organization.result.name;

  return (
    <>
      <StatusBar style="light"/>
      <InnerContainer>
        <WelcomeImage resizeMode="cover" source={require('../../../assets/img.jpg')} />
        <WelcomeContainer>
          <PageTitle welcome={true}>Seja bem vindo(a) </PageTitle>
          <SubTitle welcome={true}> {nameCNPJ || 'Nome organization'}</SubTitle>
          <SubTitle welcome={true}>CNPJ: {idCNPJ || 'CNPJ organization'}</SubTitle>
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

export default ExamesLaboratorio;