import React, {useState} from 'react';

import { View, Text, Image, ActivityIndicator } from 'react-native';

import { StatusBar } from 'expo-status-bar';

import { RadioButton} from 'react-native-paper'

// Mas CPF e CNPJ
// import MaskCpfCnpj from "react-native-mask-cpf-cnpj";

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

// API client
import axios from 'axios';

const Login = ({navigation}) => {
  const [hidePassword, setHidePassword] = useState(true);
  const [checked, setChecked] = useState('laboratorio');
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();

  const handleLogin = (credentials, setSubmitting) => {
    handleMessage(null);
    const url ='http://localhost:8080/fhir/Patient';
    axios
      .post(url, credentials)
      .then((response) => {
        const result = response.data;
        const {message, status, data} = result;

        if (status !== 'SUCCESS') {
          handleMessage(message, status);
        } else {
          navigation.navigate('Exames', {...data[0]});
        }
        setSubmitting(false);
      })
      .catch(error => {
      console.log(error.JSON());
      setSubmitting(false);
      handleMessage("Ocorreu um erro. Verifique sua internet e tente novamente");
    });
  };

  const handleMessage = (message, type = 'FAILED') => {
    setMessage(message);
    setMessageType(type);
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
                onPress={() => setChecked('paciente')}
                color="#38A69D"
              />
              <Text style={{fontWeight: 'bold', fontSize: 15}}>Laboratorio</Text>
              <RadioButton
                value="laboratorio"
                status={checked === 'laboratorio' ? 'checked' : 'unchacked'}
                onPress={() => setChecked('laboratorio')}
                color="#38A69D"
              />
              <Text style={{fontWeight: 'bold', fontSize: 15}}>Paciente</Text>
            </View>
          </ContainerHeader>
          </View>
            <Formik
              initialValues={{CPF: '', password: ''}}
              // initialValues={{CPF: '',CNPJ:'', password: ''}}
              onSubmit={(values, {setSubmitting}) => {
                if (values.CPF =="" || values.password == "") {
                  handleMessage('Por favor preencha todos os campos!');
                  setSubmitting(false);
                } else {
                  handleLogin(values, setSubmitting);
                }
              }}
            >
              {({ handleChange, handleBlur, handleSubmit, values, isSubmitting}) => (
                <StyledFormArea>
                  {checked === 'paciente' ? (
                  <>                  
                  <MyTextInput
                    label="CNPJ"
                    icon="shield"
                    placeholder="XX.XXX.XXX/0001-XX"
                    placeholderTextColor={darkLight}
                    onChangeText={handleChange('CNPJ')}
                    onBlur={handleBlur('CNPJ')}
                    value={values.CNPJ}
                    keyboardType="numeric"
                    maxlength="14"
                  />
                  <MyTextInput
                    label="CPF"
                    icon="shield"
                    placeholder="XXX.XXX.XXX-XX"
                    placeholderTextColor={darkLight}
                    onChangeText={handleChange('CPF')}
                    onBlur={handleBlur('CPF')}
                    value={values.CPF}
                    keyboardType="numeric"
                    maxlength="11"
                  /></>

                  ) : (
                    <MyTextInput
                    label="CPF"
                    icon="shield"
                    placeholder="XXX.XXX.XXX-XX"
                    placeholderTextColor={darkLight}
                    onChangeText={handleChange('CPF')}
                    onBlur={handleBlur('CPF')}
                    value={values.CPF}
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
                  {/* <StyledButton google={true} onPress={handleSubmit}>
                    <Fontisto name="google" color="white" size={25} />
                    <ButtonText google={true} >Entrar com Google </ButtonText>
                  </StyledButton> */}
                  <ExtraView>
                    <ExtraText>Esqueceu sua senha?</ExtraText>
                    <TextLink onPress={() => navigation.navigate('Cadastro')}>
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