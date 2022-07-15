import * as React from 'react';

import { StatusBar } from 'expo-status-bar';

import { format} from 'date-fns'

import {
  PageTitleExame, 
  SubTitleExame, 
  WelcomeContainer,
  StyledFormAreaExames, 
  TitleExame,
  TextExame,
  CardContainer,
  ExamesContainer,
  LineExame
} from './styles';

import {
  StyledFormArea, 
} from '../../../components/styles';

import { cnpjMask} from '../../pages/Login/Maskedinput';

const ResultadoExame = ({route}) => {
  const exames = route.params;
  const code = exames.resource.code.coding[0].display;
  const dataExame = new Date(exames.resource.effectiveDateTime);
  const dataFormated = format(new Date(dataExame), 'dd/MM/yyyy')
  const resultado = exames.resource.valueString;
  const laboratorioNotFormated = exames.resource.identifier[0].system;
  const laboratorio = cnpjMask(laboratorioNotFormated.slice(-14));
    return (
      <>
        <StatusBar style="light"/>
        <ExamesContainer style={{backgroundColor: "#FFF"}}>
          <WelcomeContainer>     
            <StyledFormArea>
              <PageTitleExame welcome={true}>RESULTADO DE EXAMES</PageTitleExame>
              <SubTitleExame welcome={true}>{dataFormated || 'Data Realizada'}</SubTitleExame>
            </StyledFormArea>
            <LineExame/>
            <StyledFormAreaExames>
            <CardContainer>
                <TitleExame style={{textAlign: 'center'}}>Teste Rápido Covid 19</TitleExame>
              </CardContainer>
              <CardContainer>
                <TitleExame>Exame</TitleExame>
                <TextExame>{code || 'Código'}</TextExame>
              </CardContainer>
                <TitleExame>Laboratório</TitleExame>
                <TextExame>{laboratorio || 'Laboratório'}</TextExame>
              <CardContainer>
              </CardContainer>
              <CardContainer>
                <TitleExame>Resultado</TitleExame>
                <TextExame>{resultado || 'Resultado Exame'}</TextExame>         
              </CardContainer>
            </StyledFormAreaExames>
          </WelcomeContainer>
        </ExamesContainer>
      </>
    );
  };

export default ResultadoExame;