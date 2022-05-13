import * as React from 'react';

import { StatusBar } from 'expo-status-bar';

import {cpfMask} from '../../pages/Login/Maskedinput';

import { format} from 'date-fns'

import {
  PageTitleExame, 
  SubTitleExame, 
  WelcomeContainer,
  StyledFormAreaExames, 
  TitleExame,
  TextExame,
  CardContainer
} from './styles';

import {
  InnerContainer, 
  StyledFormArea, 
  Line,
} from '../../../components/styles';

const ResultadoExameLaboratorio = ({route}) => {
  const exames = route.params;
  const code = exames.resource.code.coding[0].display;
  const dataExame = new Date(exames.resource.effectiveDateTime);
  const dataFormated = format(new Date(dataExame), 'dd/MM/yyyy')
  const resultado = exames.resource.valueString;
  const paciente = exames.resource.subject.display;
  const idCPF = exames.resource.subject.reference;

  console.log(route.params)
    return (
      <>
        <StatusBar style="light"/>
        <InnerContainer style={{backgroundColor: "#FFF"}}>
          <WelcomeContainer>     
            <StyledFormArea>
              <PageTitleExame welcome={true}>RESULTADO DE EXAMES</PageTitleExame>
              <SubTitleExame welcome={true}>{dataFormated || 'Data Realizada'}</SubTitleExame>
            </StyledFormArea>
            <Line/>
            <StyledFormAreaExames>
            <CardContainer>
                <TitleExame>Teste Rápido Covid 19</TitleExame>
              </CardContainer>
              <CardContainer>
                <TitleExame>Exame</TitleExame>
                <TextExame>{code || 'Código'}</TextExame>
              </CardContainer>
                <TitleExame>Paciente</TitleExame>
                <TextExame>{paciente || 'Laboratório'}</TextExame>
                <TextExame>CPF: {cpfMask(idCPF) || 'Laboratório'}</TextExame>
              <CardContainer>
              </CardContainer>
              <CardContainer>
                <TitleExame>Resultado</TitleExame>
                <TextExame>{resultado || 'Resultado Exame'}</TextExame>         
              </CardContainer>
            </StyledFormAreaExames>
          </WelcomeContainer>
        </InnerContainer>
      </>
    );
  };

export default ResultadoExameLaboratorio;