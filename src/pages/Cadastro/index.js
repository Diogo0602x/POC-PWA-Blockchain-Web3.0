import React, {useState} from 'react';

import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';

import * as Animatable from 'react-native-animatable'
import { Touchable } from 'react-native-web';

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
  PageLogo, 
  PageTitle, 
  SubTitle, 
  StyledFormArea, 
  LeftIcon, 
  StyledInputLabel, 
  StyledTextInput, 
  RightIcon,
  StyledButton, 
  ButtonText,
  Colors,
  MsgBox,
  Line,
  ExtraView,
  ExtraText,
  TextLink,
  TextLinkContent
} from '../../../components/styles';

import MyTextInput from '../MyTextInput';

// colors
const {brand, darkLight, primary} = Colors;

const Login = () => {
  const [hidePassword, setHidePassword] = useState(true);
  const [checked, setChecked] = useState('laboratorio')
  const navigation = useNavigation();

  return (
    <ScrollView>
    <StyledContainer>
      <StatusBar style="dark"/>
      <InnerContainer>
        <View>
        <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
          <Image style={{width: 200, height: 200, alignSelf: 'center'}} resizeMode="contain" source={require('../../../assets/logo.png')} />
          <PageTitle>Medicine Labs</PageTitle>
          <SubTitle>Digite suas informações</SubTitle>
        </Animatable.View>
        </View>

          <Formik
            initialValues={{CPF: '',CNPJ:'', password: '', passwordConfirm: ''}}
            onSubmit={(values) => {
              console.log(values);
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values }) => (
              <StyledFormArea>
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
                  label="Digite sua nova senha"
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
                  onChangeText={handleChange('passwordConfirm')}
                  onBlur={handleBlur('passwordConfirm')}
                  value={values.passwordConfirm}
                  secureTextEntry={hidePassword}
                  isPassword={true}
                  hidePassword={hidePassword}
                  setHidePassword={setHidePassword}
                />
                <MsgBox>...</MsgBox>
                <StyledButton onPress={handleSubmit}>
                  <ButtonText>Recuperar</ButtonText>
                </StyledButton>
              </StyledFormArea>
            )}
          </Formik>
        </InnerContainer>
    </StyledContainer>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#38A69D',
    justifyContent: 'center'
  },
  containerHeader:{
    marginTop: '5%',
    marginBottom: '8%',
    paddingStart: '5%',
    flexDirection: 'column',
  },
  message:{
    fontSize: 22,
     fontWeight: 'bold',
     color: '#FFF',
     alignItems: 'center',
     marginLeft: 7
  },
})

export default Login;