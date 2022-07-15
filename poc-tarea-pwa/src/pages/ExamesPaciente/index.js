import {cpfMask} from '../../pages/Login/Maskedinput';
import React from "react";
import {FlatList} from "react-native";
import { format} from 'date-fns'

import {
  PageTitleExame, 
  SubTitleExame, 
  CardDescricao,
  CardContainer,
  ContainerCabecalho,
  CardText,
  CardSection,
  CardSpace,
  StyledFormAreaExame,
  Line
} from '../../../components/ExamesStyle';

const ExamesPaciente = ({navigation, route}) => {
  const pacient = route.params.pacient;
  const namePacient = pacient.name[0].text;
  const idCPF = pacient.id;

  const exames = route.params.exames;
  const exames1 = route.params.exames.entry;
  const tipoTeste = exames.entry[0].resource.code.coding[0].display;

  function ExamesFeitos( {resource}) {
    const dataExame = new Date(resource.effectiveDateTime);
    const dataFormated = format(new Date(dataExame), 'dd/MM/yyyy')
    const resultadoExame = resource.valueString;
    return (
      <CardContainer onPress={ () => navigation.navigate('ResultadoExame', {resource})}>
        <CardText>{tipoTeste}</CardText>
        <CardSpace>
          <CardSection>
            <CardDescricao>Data</CardDescricao>
            <CardDescricao>{dataFormated || 'Data realizada'}</CardDescricao>
          </CardSection>
          <CardSection>
            <CardDescricao>Resultado</CardDescricao>
            <CardDescricao> {resultadoExame || 'Resultado'}</CardDescricao>
          </CardSection>
        </CardSpace>
      </CardContainer>
    );
  }

  return(
    <ContainerCabecalho style={{flexDirection:"column", backgroundColor: "#fff"}}>
      <StyledFormAreaExame>
        <PageTitleExame welcome={true}>Olá, {cpfMask(namePacient) || 'Nome Paciente'} </PageTitleExame>
        <SubTitleExame welcome={true}>CPF: {cpfMask(idCPF) || 'CPF Paciente'}</SubTitleExame>
      </StyledFormAreaExame>
      <Line/>
      <PageTitleExame styles={{}}>Exame(s)</PageTitleExame>
      <FlatList style={{backgroundColor: "#FFF"}}
        keyExtractor={item => item.resource.id}
        data={exames1}
        renderItem={({item})=> <ExamesFeitos {...item} />}
        showsVerticalScrollIndicator={false}
      />
    </ContainerCabecalho>
  );
};

export default ExamesPaciente;