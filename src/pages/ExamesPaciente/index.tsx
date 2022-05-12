import {cpfMask} from '../../pages/Login/Maskedinput';
import React from "react";
import {FlatList} from "react-native";

import {
  PageTitleExame, 
  SubTitleExame, 
  ContainerPrincipal,
  CardDescricao,
  TitleExame,
  CardContainer,
  ContainerCabecalho,
  CardText
} from './styles';

import {
  StyledFormArea, 
  Line,
} from '../../../components/styles';

const ExamesPaciente = ({navigation, route}) => {
  const pacient = route.params.pacient;
  const namePacient = pacient.name[0].text;
  const idCPF = pacient.id;

  const exames = route.params.exames;
  const exames1 = route.params.exames.entry;
  const tipoTeste = exames.entry[0].resource.meta.profile[0];
  const testeTipo = tipoTeste.replace("http://tarea.net.br/fhir/r4/StructureDefinition/", '');

  function InteressadoItem( {resource}) {
    const dataExame = new Date(resource.effectiveDateTime);
    const data = dataExame.toLocaleDateString()
    const resultadoExame = resource.valueString;
    return (
        <CardContainer onPress={ () => navigation.navigate('ResultadoExame', {resource})}>
          <CardText>Tipo: Teste Rápido Covid 19</CardText>
          <CardDescricao>Data:  {data || 'Data realizada'}</CardDescricao>
          <CardDescricao>Resultado: {resultadoExame || 'Resultado'}</CardDescricao>
        </CardContainer>
    );
  }

  return(
    <ContainerPrincipal>
      <FlatList
          ListHeaderComponent={
            <ContainerCabecalho style={{flexDirection:"column"}}>
              <StyledFormArea>
                <PageTitleExame welcome={true}>Olá, {cpfMask(namePacient) || 'Nome Paciente'} </PageTitleExame>
                <SubTitleExame welcome={true}>CPF: {cpfMask(idCPF) || 'CPF Paciente'}</SubTitleExame>
            </StyledFormArea>
            <Line/>
            <PageTitleExame>Exame COVID-19 PFIZER - COMIRNATY</PageTitleExame>
          </ContainerCabecalho>
          }
          keyExtractor={item => item.resource.id}
          data={exames1}
          renderItem={({item})=> <InteressadoItem {...item} />}
      />
    </ContainerPrincipal>
    );
  };

export default ExamesPaciente;