import React, {useState} from 'react';

import { View, Text, Image, ActivityIndicator } from 'react-native';

import { StatusBar } from 'expo-status-bar';

import { RadioButton} from 'react-native-paper';

import {cnpjMask, cpfMask} from './Maskedinput';

// formik
import { Formik } from 'formik';

// icons
import {Octicons, Ionicons, Fontisto} from '@expo/vector-icons';

import {
  StyledContainer, 
  InnerContainer, 
  Label,
  LeftIcon,
  RightIcon,
  Container,
  ContainerHeader,
  PageTitle, 
  SubTitle, 
  StyledFormArea, 
  StyledButton, 
  StyledTextInput,
  ButtonText,
  Colors,
  MsgBox,
  Line,
  ExtraView,
  ExtraText,
  TextLink,
  TextLinkContent,
} from '../../../components/styles';

// Colors
const {brand, darkLight, primary} = Colors;

// keyboard avoiding view
import KeyboardAvoidingWrapper from '../../../components/KeyboardAvoidingWrapper';
import RoutesExamePaciente from '../ExamesPaciente'
import RoutesExameLaboratorio from '../ExamesPaciente';


// API client
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const Login = () => {
  const [hidePassword, setHidePassword] = useState(true);
  const [checked, setChecked] = useState('paciente');
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();
  const navigation = useNavigation();

  const handleLoginPaciente = (credentials, setSubmitting) => {
    const CPF = credentials.CPF;
    const cpfLimpo = CPF.replace(/[\.\-]/g, '');
    handleMessage(null);
    const url ='http://lima.tarea.lan:8080/fhir/Patient/' + cpfLimpo;    
    axios
      .get(url)
      .then((response) => {
        const result = response.data;
        navigation.navigate('RoutesExamePaciente', {result});
        setSubmitting(false);
      })
      .catch(error => {
        console.log(error);
        setSubmitting(false);
        handleMessage("Verifique os dados e tente novamente!");
    });
  };

  const senhaPadrao = "a"

  const handleLoginLaboratorio = (credentials, setSubmitting) => {
    const CNPJ = credentials.CNPJ;
    const cnpjLimpo = CNPJ.replace(/[\.\/\-]/g, '');
    handleMessage(null);
    const url2 ='http://lima.tarea.lan:8080/fhir/Organization/' + cnpjLimpo;
    axios
      .get(url2)
      .then((response) => {
        const result = response.data;
        navigation.navigate('RoutesExameLaboratorio', {result});
        setSubmitting(false);
      })
      .catch(error => {
        console.log(error);
        setSubmitting(false);
        handleMessage("Verifique os dados e tente novamente!");
    });
  };
  const handleMessage = (message, type = 'FAILED') => {
    setMessage(message);
    setMessageType(type);
  }

  let initialValues = {};
  function verifica() {
    if (checked === "paciente") {
      initialValues={CPF: '', password: ''}
      return initialValues
    } else if (checked === "laboratorio"){
      initialValues={CNPJ: '', password: ''}
      return initialValues
    }
  }

  return (
    <KeyboardAvoidingWrapper>
      <StyledContainer>
        <StatusBar style="dark"/>
        <InnerContainer>
          <View>
          <ContainerHeader animation="fadeInLeft" delay={500}>
            <Image style={{width: 200, height: 200, alignSelf: 'center'}} resizeMode="contain" source={require('../../../assets/logo.png')} />
            <PageTitle>Tarea</PageTitle>
            <SubTitle>Você é:</SubTitle>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <RadioButton
                value="paciente"
                status={checked === 'paciente' ? 'checked' : 'unchacked'}
                onPress={() => {setChecked('paciente'); verifica()}}
                color="#38A69D"
              />
              <Text style={{fontWeight: 'bold', fontSize: 15}}>Paciente</Text>
              <RadioButton
                value="laboratorio"
                status={checked === 'laboratorio' ? 'checked' : 'unchacked'}
                onPress={() => {setChecked('laboratorio'); verifica()}}
                color="#38A69D"
              />
              <Text style={{fontWeight: 'bold', fontSize: 15}}>Laboratório</Text>
            </View>
          </ContainerHeader>
          </View>
            <Formik
              initialValues={ initialValues }
              onSubmit={(values, {setSubmitting}) => {
                switch(checked) {
                  case 'paciente':
                    if (values.CPF === "" || values.password === "") {
                       handleMessage('Por favor preencha todos os campos!');
                       setSubmitting(false);
                     } else {
                      if (values.password === senhaPadrao){
                        handleLoginPaciente(values, setSubmitting);
                      }
                      else {
                        alert('Senha incorreta!');
                      }
                   }
                    break
                  case 'laboratorio':
                    if (values.CNPJ === "" || values.password === "") {
                       handleMessage('Por favor preencha todos os campos!');
                       setSubmitting(false);
                     } else {
                       if (values.password === senhaPadrao){
                         handleLoginLaboratorio(values, setSubmitting);
                       }
                       else {
                         alert('Senha incorreta!');
                       }
                    }
                    break
                  }
                }
              }
            >
              {({ handleChange, handleBlur, handleSubmit, values, isSubmitting}) => (
                <StyledFormArea>
                  {checked === 'laboratorio' ? (
                  <>                  
                  <MyTextInput
                    label="CNPJ"
                    icon="shield"
                    placeholder="XX.XXX.XXX/XXXX-XX"
                    placeholderTextColor={darkLight}
                    onChangeText={handleChange('CNPJ')}
                    onBlur={handleBlur('CNPJ')}
                    value={cnpjMask(values.CNPJ)}
                    keyboardType="numeric"
                    maxlength="14"
                  />
                  </>
                  ) : (
                    <MyTextInput
                    label="CPF"
                    icon="shield"
                    placeholder="XXX.XXX.XXX-XX"
                    placeholderTextColor={darkLight}
                    onChangeText={handleChange('CPF')}
                    onBlur={handleBlur('CPF')}
                    value={cpfMask(values.CPF)}
                    keyboardType="numeric"
                    maxlength="11"
                  />
                  )} 
                  <MyTextInput
                    label="Password"
                    icon="lock"
                    placeholder="* * * * * * * * *"
                    placeholderTextColor={darkLight}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                    secureTextEntry={hidePassword}
                    isPassword={true}
                    hidePassword={hidePassword}
                    setHidePassword={setHidePassword}
                  />
                  <MsgBox type={messageType}>{message}</MsgBox>
                  {!isSubmitting && (
                    <StyledButton onPress={handleSubmit}>
                      <ButtonText>Login</ButtonText>
                    </StyledButton>
                  )}
                  {isSubmitting && (
                    <StyledButton disabled={true}>
                      <ActivityIndicator size="large" color={primary} />
                    </StyledButton>
                  )}
                  <Line/>
                  <ExtraView>
                    <ExtraText>Esqueceu sua senha?</ExtraText>
                    <TextLink onPress={() => navigation.navigate('RestaurarSenha')}>
                      <TextLinkContent>Recuperar</TextLinkContent>
                    </TextLink>
                  </ExtraView>
                  <ExtraView>
                    <ExtraText>Não possui conta?</ExtraText>
                    <TextLink onPress={() => navigation.navigate('Cadastrar')}>
                      <TextLinkContent>Cadastrar</TextLinkContent>
                    </TextLink>
                  </ExtraView>
                </StyledFormArea>
              )}
            </Formik>
        </InnerContainer>
      </StyledContainer>
    </KeyboardAvoidingWrapper>
  );
};

const MyTextInput = ({ label, icon, isPassword, hidePassword, setHidePassword, ...props}) => {
  return (
    <>
      <Label>{label}</Label>
      <Container>
        <LeftIcon>
          <Octicons name={icon} size={30} color={brand} />
        </LeftIcon>
        <StyledTextInput {...props} />
        {isPassword && (
          <RightIcon onPress={() => setHidePassword(!hidePassword)}>
            <Ionicons name={hidePassword ? 'md-eye-off' : 'md-eye'} size={30} color={darkLight} height={5} />
          </RightIcon>
        ) }
      </Container>
    </>
  );
};

export default Login;