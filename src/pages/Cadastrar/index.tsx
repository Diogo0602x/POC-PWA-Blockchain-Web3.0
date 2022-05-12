import React, {useState} from 'react';

import { View, TouchableOpacity, Image, ActivityIndicator } from 'react-native';

import { StatusBar } from 'expo-status-bar';

// formik
import { Formik } from 'formik';

// icons
import {Octicons, Ionicons} from '@expo/vector-icons';

// api client
import axios from 'axios';

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

// colors
const {brand, darkLight, primary} = Colors;

// keyboard avoiding view
import KeyboardAvoidingWrapper from '../../../components/KeyboardAvoidingWrapper';

// Datetimepicker
import DateTimePicker from '@react-native-community/datetimepicker';

const Cadastrar = ({navigation}) => {
  const [hidePassword, setHidePassword] = useState(true);
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date(2022, 0,1)) ;

  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();
  const now = Date.now()

  // Data de nascinemto a ser enviada
  const [dab, setDab] = useState();

  const onChange = (event,selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
    setDab(currentDate);
  }

  const showDatePicker = () => {
    setShow(true);
  }
// form handling
const handlelSingup = (credentials, setSubmitting) => {
 handleMessage (null);
  const url = 'http://lima.tarea.lan:8080/fhir/Patient/' + CPF;
  axios
    .post(url, credentials)
    .then((response) => {
      const result = response.data;
      const { message, status, data } = result;

      if (status !== 'SUCCESS') {
        handleMessage (message, status);
       } else {
        navigation.navigate('ExamesPaciente', {result});
      }
      setSubmitting(false);
    })
    .catch((error) => {
      console.log(error.JSON());
      setSubmitting(false);
      handleMessage('An error occurred. Check your network and try again');
    });
};
const handleMessage = (message, type = 'FAILED') => {
  setMessage (message);
  setMessageType (type);
};

  return (
    <KeyboardAvoidingWrapper>
      <StyledContainer>
        <StatusBar style="dark"/>
        <InnerContainer>
          <View>
          <ContainerHeader animation="fadeInLeft" delay={500} >
            <Image style={{width: 200, height: 200, alignSelf: 'center'}} resizeMode="contain" source={require('../../../assets/logo.png')} />
            <PageTitle>Tarea</PageTitle>
            <SubTitle>Digite suas informações</SubTitle>
            {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode= 'date'
              is24Hour={true}
              display="default"
              placeholderTextColor={darkLight}
              onChange={onChange}
              maximumDate={new Date(now)}
              minimumDate={new Date(1910, 0, 1)}
            />
          )}
          </ContainerHeader>
          </View>
          <Formik
            initialValues={{name: '',CPF: '',email:'',dateOfBirth: '', password: '', confirmPassowrd: ''}}
            onSubmit={(values, setSubmitting) => {
              values = {...values, dateOfBirth: dab}
              if (values.name === ''|| values.CPF === ''|| values.dateOfBirth === ''|| values.email === '' || values.password === '' || values.confirmPassowrd === '') {
                  handleMessage('Por favor preencha todos os campos!');
                  setSubmitting(false);
                } else if(values.password !== values.confirmPassowrd) {
                  handleMessage ('Senhas não são iguais!');
                  setSubmitting(false);
                } else {
                  handlelSingup(values, setSubmitting);
              }
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values, isSubmitting }) => (
              <StyledFormArea>
                <MyTextInput
                  label="Nome Completo"
                  icon="person"
                  placeholder="Seu nome completo"
                  placeholderTextColor={darkLight}
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  value={values.name}
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
                />
                <MyTextInput
                  label="Data de Nascimento"
                  icon="calendar"
                  placeholder="YYYY - MM - DD"
                  placeholderTextColor={darkLight}
                  onChangeText={handleChange ('dateOfBirth')}
                  onBlur={handleBlur('dateOfBirth')}
                  value={dab ? dab.toDateString() : ''}
                  isDate={true}
                  editable={false}
                  showDatePicker={showDatePicker}
                />
                <MyTextInput
                  label="Email"
                  icon="mail"
                  placeholder="seu@email.com"
                  placeholderTextColor={darkLight}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  keyboardType="email-address"
                />

                <MyTextInput
                  label="Digite sua senha"
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
                <MyTextInput
                  label="Confirme sua senha"
                  icon="lock"
                  placeholder="* * * * * * * * *"
                  placeholderTextColor={darkLight}
                  onChangeText={handleChange('confirmPassowrd')}
                  onBlur={handleBlur('confirmPassowrd')}
                  value={values.confirmPassowrd}
                  secureTextEntry={hidePassword}
                  isPassword={true}
                  hidePassword={hidePassword}
                  setHidePassword={setHidePassword}
                />
                <MsgBox type={messageType}>{message}</MsgBox>
                {!isSubmitting && (
                  <StyledButton onPress={handleSubmit}>
                    <ButtonText>Cadastrar</ButtonText>
                  </StyledButton>
                )}

                {isSubmitting && (
                  <StyledButton disabled={true}>
                    <ActivityIndicator size="large" color={primary} />
                  </StyledButton>
                )}
                <ExtraView>
                  <ExtraText>Já possui uma conta ?</ExtraText>
                  <TextLink>
                    <TextLinkContent onPress={ () => navigation.navigate('Login')}>Login</TextLinkContent>
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

const MyTextInput = ({ label, icon, isPassword, hidePassword, setHidePassword, isDate, showDatePicker,...props}) => {
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
        {isPassword && (
          <RightIcon onPress={() => setHidePassword(!hidePassword)}>
            <Ionicons name={hidePassword ? 'md-eye-off' : 'md-eye'} size={30} color={darkLight} height={5} />
          </RightIcon>
        ) }
      </Container>
    </>
  );
};

export default Cadastrar;