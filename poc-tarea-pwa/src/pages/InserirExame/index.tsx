import React, {useState} from 'react';

import { View, TouchableOpacity, Platform } from 'react-native';

import { StatusBar } from 'expo-status-bar';
import moment from 'moment';

// icons
import {Octicons} from '@expo/vector-icons';

import ExameModel from '../../../models/exameModel'
import { ExameService } from '../../../service/ExameService';

import {
  StyledContainer, 
  InnerContainer, 
  Label,
  LeftIcon,
  Container,
  PageTitle, 
  SubTitle, 
  StyledFormArea, 
  StyledButton, 
  StyledTextInput,
  ButtonText,
  Colors,
  MsgBox,
} from '../../../components/styles';
import Dropdown from "../../../components/Dropdown";
import { cpfMask, hourMask, dateMask } from '../Login/Maskedinput';

// colors
const {brand, darkLight, primary}:any = Colors;

// keyboard avoiding view
import KeyboardAvoidingWrapper from '../../../components/KeyboardAvoidingWrapper';

const InserirExame = ({navigation, route}: any) => {
  const exames = route.params.exames.entry
  const ultimo_exame_value = exames[exames.length - 1].resource.identifier[0].value
  const cnpj = route.params.organization.id

  //Dados Formulário
  const [examCode, setExamCode] = useState("");
  const [CPF, setCPF] = useState("");
  const [dateOfExam, setDateOfExam] = useState("");
  const [hourOfExam, setHourOfExam] = useState("");
  const [result, setResult] = useState("")
  
  const [tipoExames, setTipoExames] = useState<any>([])
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState("");
  const dataInsercao = moment().format();
  const dataExameTemp = dateOfExam + "" + hourOfExam
  const dataExame = moment(dataExameTemp, "DD/MM/YYYY HH:mm").format()

  function FormataStringData(data: any) {
    var dia  = data.split("/")[0];
    var mes  = data.split("/")[1];
    var ano  = data.split("/")[2];
  
    return ano + '-' + ("0"+mes).slice(-2) + '-' + ("0"+dia).slice(-2);
    // Utilizo o .slice(-2) para garantir o formato com 2 digitos.
  }

//Modelo do exame e função para inserir o exame-------------------------------------------------------------------

  const exame: ExameModel = {
      resourceType: "Observation",
      identifier: {
          system: `http://tarea.net.br/fhir/r4/NamingSystem/${cnpj}`,
          value: `${parseInt(ultimo_exame_value) + 1}`
      },
      meta: {
          profile: [
              "http://tarea.net.br/fhir/r4/StructureDefinition/TesteRapidoCovid19"
          ]
      },
      status: "final",
      code: {
          coding: [
              {
                  system: "http://tarea.net.br/fhir/r4/CodeSystem/NomeExameCovid19",
                  code: examCode
              }
          ]
      },
      subject: {
          reference: `Patient/${CPF.replace(/[\.\-]/g, '')}`
      },
      effectiveDateTime: `${dataExame}`,
      issued: `${dataInsercao}`,
      performer: [
          {
              reference: `Organization/${cnpj}`
          }
      ],
      valueString: result
  }

  function inserirExame() {
    ExameService.inserirExame(exame)
    .then((response: Response) => { 
      if (response.status !== 201){
        alert("Cheque os dados e teve novamente!")
      }
      console.log(response.status)
    })
    .catch((err) => {alert("Cheque os dados e tente novamente!")})
  }

  const dadosCodigoExame = [
    { label: '94768-9 - Anticorpos IgA ', value: '94768-9' },
    { label: '94558-4 - Antígenos Ag', value: '94558-4' },
    { label: '94507-1 - Anticorpos IgG', value: '94507-1' },
    { label: '94508-9 - Anticorpos IgM', value: '94508-9' }
  ];
//-------------------------------------------------------------------------------------------------------------

  const dadosResultadoExame = [
    { label: 'Detectável', value: 'd' },
    { label: 'Não detectável', value: 'n' },
    { label: 'Inconclusivo', value: 'i' }
  ];

  function focus() {
    if (Platform.OS === "web") {
      return "onFocus={this.onFocus}";
    }
  }

// form handling
const handleMessage = (message: any, type = 'FAILED') => {
  setMessage (message);
  setMessageType(type);
};

  return (
    <KeyboardAvoidingWrapper>
      <StyledContainer>
        <StatusBar style="dark"/>
        <InnerContainer>
          <View>
            <PageTitle>Inserir Exame</PageTitle>
            <SubTitle>Coloque os dados do exame</SubTitle>
          </View>
              <StyledFormArea>
                <Label>Código do Exame</Label>
                <Dropdown 
                    label="Selecione" 
                    data={dadosCodigoExame} 
                    onSelect={(valor)=> {setExamCode(valor.value); focus()}}
                />
                <MyTextInput
                  onFocus={focus()}
                  label="CPF do Paciente"
                  icon="person"
                  placeholder="XXX.XXX.XXX-XX"
                  placeholderTextColor={darkLight}
                  onChangeText={(valor: any)=> {setCPF(valor);}}
                  value={cpfMask(CPF)}
                  maxLength={14}
                  keyboardType="numeric"
                />
                <MyTextInput
                  onFocus={focus()}
                  label="Data do Exame"
                  icon="calendar"
                  placeholder="DD/MM/AAAA"
                  placeholderTextColor={darkLight}
                  onChangeText={(valor: any)=> {setDateOfExam(valor);}}
                  value={dateMask(dateOfExam)}
                  maxLength={10}
                  keyboardType="numeric"
                />
                <MyTextInput
                  onFocus={focus()}
                  label="Hora do Exame"
                  icon="watch"
                  placeholder="HH:MM"
                  placeholderTextColor={darkLight}
                  onChangeText={(valor: any)=> {setHourOfExam(valor);}}
                  value={hourMask(hourOfExam)}
                  maxLength={5}
                  keyboardType="numeric"
                />
                <Label>Resultado do Exame</Label>
                <Dropdown 
                    label="Selecione" 
                    data={dadosResultadoExame} 
                    onSelect={(valor)=> setResult(valor.label)} 
                />
                <MsgBox type={messageType}>{message}</MsgBox>
                {(
                  <StyledButton onPress={inserirExame}>
                    <ButtonText>Inserir Exame</ButtonText>
                  </StyledButton>
                )}
              </StyledFormArea>
        </InnerContainer>
      </StyledContainer>
    </KeyboardAvoidingWrapper>
  );
};

const MyTextInput = ({ label, icon, isDate, showDatePicker,...props}:any) => {
  return (
    <>
      <Label>{label}</Label>
      <Container>
        <LeftIcon>
          <Octicons name={icon} size={30} color={brand} />
        </LeftIcon>
        {!isDate && <StyledTextInput {...props} /> }
        {isDate && (
          <TouchableOpacity onPress={showDatePicker}>
            <StyledTextInput {...props} />
          </TouchableOpacity>
        )}
      </Container>
    </>
  );
};

export default InserirExame;