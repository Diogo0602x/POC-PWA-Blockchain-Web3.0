import React, {useState} from 'react';

import { View, ScrollView } from 'react-native';

import { StatusBar } from 'expo-status-bar';

import { useNavigation } from '@react-navigation/native'

import {
  StyledContainer, 
  InnerContainer, 
  ContainerHeader,
  PageTitle, 
  SubTitle, 
  Colors,
} from '../../../components/styles';

// colors
const {brand, darkLight, primary} = Colors;

const Exames = () => {

  return (
    <ScrollView>
    <StyledContainer>
      <StatusBar style="dark"/>
      <InnerContainer>
        <View>
        <ContainerHeader animation="fadeInLeft" delay={500}>
          <PageTitle>Tarea</PageTitle>
          <SubTitle>Digite suas informações</SubTitle>
        </ContainerHeader>
        </View>
        </InnerContainer>
    </StyledContainer>
    </ScrollView>
  );
};

export default Exames;