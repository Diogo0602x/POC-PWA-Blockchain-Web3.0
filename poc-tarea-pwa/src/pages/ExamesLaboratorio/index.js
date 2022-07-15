import {cnpjMask} from '../../pages/Login/Maskedinput';
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
  Line
} from '../../../components/ExamesStyle';

import {
  StyledFormArea, 
} from '../../../components/styles';

const ExamesLaboratorio = ({navigation, route}) => {
  const organization = route.params.organization;
  const nameOrganization = organization.name;
  const idCNPJ = organization.id;

  const exames = route.params.exames;
  const exames1 = route.params.exames.entry;
  const tipoTeste = exames.entry[0].resource.code.coding[0].display;

  function ExamesFeitos( {resource}) {
    const dataExame = new Date(resource.effectiveDateTime);
    const dataFormated = format(new Date(dataExame), 'dd/MM/yyyy')
    const resultadoExame = resource.valueString;
    return (
      <CardContainer onPress={ () => navigation.navigate('ResultadoExameLaboratorio', {resource})}>
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
      <StyledFormArea>
        <PageTitleExame welcome={true}>Olá, {cnpjMask(nameOrganization) || 'Nome Laboratório'} </PageTitleExame>
        <SubTitleExame welcome={true}>CNPJ: {cnpjMask(idCNPJ) || 'CNPJ Laboratório'}</SubTitleExame>
      </StyledFormArea>
      <Line/>
      <PageTitleExame>Exame(s)</PageTitleExame>
      <FlatList style={{backgroundColor: "#FFF"}}
        keyExtractor={item => item.resource.id}
        data={exames1}
        renderItem={({item})=> <ExamesFeitos {...item} />}
        showsVerticalScrollIndicator={false}
      />
    </ContainerCabecalho>
  );
};

export default ExamesLaboratorio;