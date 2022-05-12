import {cnpjMask} from '../../pages/Login/Maskedinput';
import React from "react";
import {FlatList} from "react-native";

import {
  PageTitleExame, 
  SubTitleExame, 
  ContainerPrincipal,
  CardDescricao,
  CardText,
  CardContainer,
  ContainerCabecalho
} from './styles';

import {
  StyledFormArea, 
  Line,
} from '../../../components/styles';

const ExamesLaboratorio = ({navigation, route}) => {
  const organization = route.params.organization;
  const nameOrganization = organization.name;
  const idCNPJ = organization.id;

  const exames = route.params.exames;
  const exames1 = route.params.exames.entry;

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
               <PageTitleExame welcome={true}>Olá, {cnpjMask(nameOrganization) || 'Nome Laboratório'} </PageTitleExame>
              <SubTitleExame welcome={true}>CNPJ: {cnpjMask(idCNPJ) || 'CNPJ Laboratório'}</SubTitleExame>
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

export default ExamesLaboratorio;