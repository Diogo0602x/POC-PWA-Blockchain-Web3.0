import React, {useState} from 'react';

import { View, TouchableOpacity, Image, ScrollView } from 'react-native';

import { StatusBar } from 'expo-status-bar';

import { useNavigation } from '@react-navigation/native'

import { RadioButton} from 'react-native-paper'

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

// colors
const {brand, darkLight, primary} = Colors;

// Datetimepicker
import DateTimePicker from '@react-native-community/datetimepicker';

const AtualizarCadastro = () => {
  const [hidePassword, setHidePassword] = useState(true);
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date(2000, 0,1));

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

  const navigation = useNavigation();

  return (
    <ScrollView>
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
            onChange={onChange}
          />
        )}
        </ContainerHeader>
        </View>

          <Formik
            initialValues={{fullName: '',CPF: '',email:'',dateOfBirth: '', password: '', confirmPassowrd: ''}}
            onSubmit={(values) => {
              console.log(values);
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values }) => (
              <StyledFormArea>
                <MyTextInput
                  label="Nome Completo"
                  icon="person"
                  placeholder="Seu nome completo"
                  placeholderTextColor={darkLight}
                  onChangeText={handleChange('fullName')}
                  onBlur={handleBlur('fullName')}
                  value={values.fullName}
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
                <MsgBox>...</MsgBox>
                <StyledButton onPress={handleSubmit}>
                  <ButtonText onPress={ () => navigation.navigate('Login')}>Atualizar</ButtonText>
                </StyledButton>
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
    </ScrollView>
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

export default AtualizarCadastro;