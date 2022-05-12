import * as React from 'react';

import { StatusBar } from 'expo-status-bar';

import {cnpjMask, cpfMask} from '../../pages/Login/Maskedinput';

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

const ResultadoExame = ({route}) => {
  const exames = route.params;
  const code = exames.resource.code.coding[0].code;
  const dataExame = new Date(exames.resource.effectiveDateTime);
  const data = dataExame.toLocaleDateString()
  const resultado = exames.resource.valueString;
  const laboratorio = exames.resource.performer[0].reference;
  const organization = laboratorio.replace("Organization/", '');
  const paciente = exames.resource.subject.reference;



  console.log(route.params)
    return (
      <>
        <StatusBar style="light"/>
        <InnerContainer>
          <WelcomeContainer>     
            <StyledFormArea>
              <PageTitleExame welcome={true}>RESULTADO DE EXAMES</PageTitleExame>
              <SubTitleExame welcome={true}>{data || 'Data Realizada'}</SubTitleExame>
            </StyledFormArea>
            <Line/>
            <StyledFormAreaExames>
              <CardContainer>
                <TitleExame>Exame</TitleExame>
                <TextExame>{code || 'Código'}</TextExame>
              </CardContainer>
              <CardContainer>
                <TitleExame>Tipo</TitleExame>
                <TextExame>Teste Rápido Covid 19</TextExame>
              </CardContainer>
              <CardContainer>
                <TitleExame>Paciente</TitleExame>
                <TextExame>{cpfMask(paciente) || 'Paciente'}</TextExame>
              </CardContainer>
                <TitleExame>Laboratório</TitleExame>
                <TextExame>{cnpjMask(organization) || 'Laboratório'}</TextExame>
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

export default ResultadoExame;