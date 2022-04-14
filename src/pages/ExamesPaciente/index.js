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

const ExamesPaciente = ({navigation, route}) => {
const paciente = route.params;
const idCPF = paciente.result.id;
const namePaciente = paciente.result.name[0].text
console.log(route.params)
  return (
    <>
      <StatusBar style="light"/>
      <InnerContainer>
        <WelcomeImage resizeMode="cover" source={require('../../../assets/img.jpg')} />
        <WelcomeContainer>
          <PageTitle welcome={true}>Seja bem vindo(a) </PageTitle>
          <SubTitle welcome={true}> {namePaciente || 'Nome Paciente'}</SubTitle>
          <SubTitle welcome={true}>CPF: {idCPF || 'CPF Paciente'}</SubTitle>
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

export default ExamesPaciente;