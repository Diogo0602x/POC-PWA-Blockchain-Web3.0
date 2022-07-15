import React, {useState} from 'react';

import { StatusBar } from 'expo-status-bar';

import {cpfMask} from '../../pages/Login/Maskedinput';

import { format} from 'date-fns'

import { View } from 'react-native-animatable';

import { DeletarExame } from '../../../service/DeletarExameService';

import { Entypo, FontAwesome } from '@expo/vector-icons'; 

import {
  PageTitleExame, 
  SubTitleExame, 
  WelcomeContainer,
  StyledFormAreaExames, 
  TitleExame,
  TextExame,
  CardContainer,
  LineExame,
  ButtonExam,
} from './styles';

import {
  InnerContainer, 
  StyledFormArea, 
  ButtonText,
  MsgBox,
} from '../../../components/styles';

const ResultadoExameLaboratorio = ({route, navigation}) => {
  const exames = route.params;
  const code = exames.resource.code.coding[0].display;
  const dataExame = new Date(exames.resource.effectiveDateTime);
  const dataFormated = format(new Date(dataExame), 'dd/MM/yyyy')
  const resultado = exames.resource.valueString;
  const paciente = exames.resource.subject.display;
  const idCPF = exames.resource.subject.reference;
  const id = exames.resource.id;

  function deletarExame({}) {
    DeletarExame.deletarExame(id)    
    .then((response) => { 
      if (response.status !== 204){
        alert("Cheque os dados e teve novamente!")
      }
      alert("Exame deletado com sucesso!")    
      navigation.navigate('TelaInicial');
    })
    .catch((err) => {alert("Cheque os dados e tente novamente!")})
  }
  
  const handleMessage = (message, type = 'FAILED') => {
    setMessage (message);
    setMessageType(type);
  };

    return (
      <>
        <StatusBar style="light"/>
        <InnerContainer style={{backgroundColor: "#FFF"}}>
          <WelcomeContainer>     
            <StyledFormArea>
              <PageTitleExame welcome={true}>RESULTADO DE EXAMES</PageTitleExame>
              <SubTitleExame welcome={true}>{dataFormated || 'Data Realizada'}</SubTitleExame>
            </StyledFormArea>
            <LineExame/>
            <StyledFormAreaExames>
              <CardContainer>
                <TitleExame>Teste Rápido Covid 19</TitleExame>
              </CardContainer>
              <CardContainer>
                <TitleExame>Exame</TitleExame>
                <TextExame>{code || 'Código'}</TextExame>
              </CardContainer>
                <TitleExame>Paciente</TitleExame>
                <TextExame>{paciente || 'Paciente'}</TextExame>
                <TextExame>CPF: {cpfMask(idCPF) || 'CPF'}</TextExame>
              <CardContainer>
              </CardContainer>
              <CardContainer>
                <TitleExame>Resultado</TitleExame>
                <TextExame>{resultado || 'Resultado Exame'}</TextExame>         
              </CardContainer>
              <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                <ButtonExam style={{backgroundColor: "#38A69D"}} onPress={() => navigation.navigate('EditarExame', {exames})}>
                  <ButtonText><FontAwesome name="edit" size={22} color="white" style={{paddingRight: '15px'}} />Editar Exame</ButtonText>
                </ButtonExam>
                <ButtonExam style={{backgroundColor: "#EF4444"}} onPress={deletarExame} onClick="window.location.reload()">
                  <ButtonText><Entypo  name="trash" size={22} color="white" style={{paddingRight: '15px'}} />Deletar Exame</ButtonText>
                </ButtonExam>
              </View>
            </StyledFormAreaExames>
           </WelcomeContainer>
        </InnerContainer>
      </>
    );
  };

export default ResultadoExameLaboratorio;