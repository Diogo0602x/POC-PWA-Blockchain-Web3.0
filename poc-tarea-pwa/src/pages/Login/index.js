import React, {useCallback, useState} from 'react';

import { View, Text, Image, ActivityIndicator, Alert, Platform } from 'react-native';

import { StatusBar } from 'expo-status-bar';

import { RadioButton} from 'react-native-paper';

import {cnpjMask, cpfMask} from './Maskedinput';
// import { ToastContainer, toast } from 'react-toastify';

// formik
import { Formik} from 'formik';

// icons
import {Octicons, Ionicons} from '@expo/vector-icons';

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
} from '../../../components/styles';

// Colors
const {brand, darkLight, primary} = Colors;

// keyboard avoiding view
import KeyboardAvoidingWrapper from '../../../components/KeyboardAvoidingWrapper';

// API client
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const Login = () => {
  const [hidePassword, setHidePassword] = useState(true);
  const [checked, setChecked] = useState('paciente');
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();
  const navigation = useNavigation();

  const [pacient, setPacient] = useState({});
  const [organization, setOrganization] = useState({});
  const [exames, setExames] = useState({});

  const handleSubmit = useCallback((setSubmitting, url, url2) => {
    axios
      .get(url)
      .then((response) => {
        setPacient(response.data);
      })
      .catch(error => {
        console.log(error);
        handleMessage("Verifique os dados e tente novamente!");
    }).finally(() => {
      axios
      .get(url2)
      .then((response) => {
        setExames(response.data);
      })
      .catch(error => {
        console.log(error);
        handleMessage("Verifique os dados e tente novamente!");
      }).finally(() => setSubmitting(false));
    });
  }, [])

  const handleSubmitCNPJ = useCallback((setSubmitting, url, url2) => {
    axios
      .get(url)
      .then((response) => {
        setOrganization(response.data);
      })
      .catch(error => {
        console.log(error);
        handleMessage("Verifique os dados e tente novamente!");
    }).finally(() => {
      axios
      .get(url2)
      .then((response) => {
        setExames(response.data);
      })
      .catch(error => {
        console.log(error);
        handleMessage("Verifique os dados e tente novamente!");
      }).finally(() => setSubmitting(false));
    });
  }, [])

  const senhaPadrao = "tarea";

  const handleLoginPaciente =  (credentials, setSubmitting) => {
    const CPF = credentials.CPF;
    const cpfLimpo = CPF.replace(/[\.\-]/g, '');
    const url ='http://lima.tarea.lan:8080/fhir/Patient/' + cpfLimpo;  
    const url2 ='http://lima.tarea.lan:8080/fhir/Observation?subject=Patient/' + cpfLimpo;

     handleMessage(null);
     handleSubmit(setSubmitting, url, url2);
  };

  const handleLoginLaboratorio = (credentials, setSubmitting) => {
    const CNPJ = credentials.CNPJ;
    const cnpjLimpo = CNPJ.replace(/[\.\/\-]/g, '');
    const url ='http://lima.tarea.lan:8080/fhir/Organization/' + cnpjLimpo;
    const url2 ='http://lima.tarea.lan:8080/fhir/Observation?performer=Observation/' + cnpjLimpo;

    handleMessage(null);
    handleSubmitCNPJ(setSubmitting, url, url2);
  };

  const handleMessage = async (message, type = 'FAILED') => {
    setMessage(message);
    setMessageType(type);
  }

  let initialValues = {CPF: '', password: ''};

  function verifica() {
    if (checked === "paciente") {
      initialValues = {CPF: '', password: ''}
    } if (checked === "laboratorio") {
      initialValues = {CNPJ: '', password: ''}
    }
  }

  function focus() {
    if (Platform.OS === "web") {
      return "onFocus={this.onFocus}";
    }
  }

  if (pacient?.id && exames?.id) {
    navigation.navigate('RoutesExamePaciente', {pacient, exames});
  }

  if (organization?.id && exames?.id) {
    navigation.navigate('RoutesExameLaboratorio', {organization, exames});
  }

  return (
    <KeyboardAvoidingWrapper>
      <StyledContainer>
        <StatusBar style="dark"/>
        <InnerContainer >
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
                    console.log(values);
                    if (values.CPF === "" || values === "") {
                       handleMessage('Por favor preencha todos os campos!');
                       setSubmitting(false);
                     } else {
                      if (values.password === senhaPadrao){
                        handleLoginPaciente(values, setSubmitting);
                      } else {
                        alert(
                          "Senha Incorreta ou vazia!", 
                          "Aperte OK para voltar", 
                          [
                            { text: "OK", onPress: () => {navigation.goBack()} }
                          ]
                        )
                        setSubmitting(false);
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
                       } else {
                        Alert.alert(
                          "Dados incorretos ou vazios", 
                          "Aperte OK para voltar", 
                          [
                            { text: "OK", onPress: () => {navigation.goBack()} }
                          ]
                        );
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
                    onFocus={focus()}
                    autoFocus={true}
                    label="CNPJ"
                    icon="shield"
                    placeholder="XX.XXX.XXX/XXXX-XX"
                    placeholderTextColor={darkLight}
                    onChangeText={handleChange('CNPJ')}
                    onBlur={handleBlur('CNPJ')}
                    value={cnpjMask(values.CNPJ)}
                    keyboardType="numeric"
                    maxlength="18"                                       
                  />
                  </>
                  ) : (
                    <>
                      <MyTextInput
                      onFocus={focus()}
                      label="CPF"
                      icon="shield"
                      placeholder="XXX.XXX.XXX-XX"
                      placeholderTextColor={darkLight}
                      onChangeText={handleChange('CPF')}
                      onBlur={handleBlur('CPF')}
                      value={cpfMask(values.CPF)}
                      keyboardType="numeric"
                      maxlength="14"
                    />
                  </>
                  )} 
                  <MyTextInput
                    onFocus={focus()}
                    label="Password"
                    icon="lock"
                    placeholder="* * * * * * * * *"
                    placeholderTextColor={darkLight}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                    secureTextEntry={hidePassword}
                    isPassword={true}
                    autoCapitalize="none"
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
        <StyledTextInput {...props}/>
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