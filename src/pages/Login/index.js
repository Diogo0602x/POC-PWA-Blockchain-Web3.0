import React, {useState} from 'react';

import { View, Text, Image, ScrollView } from 'react-native';

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
        <ContainerHeader animation="fadeInLeft" delay={500}>
          <Image style={{width: 200, height: 200, alignSelf: 'center'}} resizeMode="contain" source={require('../../../assets/logo.png')} />
          <PageTitle>Tarea</PageTitle>
          <SubTitle>Você é:</SubTitle>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <RadioButton
              value="laboratorio"
              status={checked === 'laboratorio' ? 'checked' : 'unchacked'}
              onPress={() => setChecked('laboratorio')}
              color="#38A69D"
            />
            <Text style={{fontWeight: 'bold', fontSize: 15}}>Laboratorio</Text>
            <RadioButton
              value="paciente"
              status={checked === 'paciente' ? 'checked' : 'unchacked'}
              onPress={() => setChecked('paciente')}
              color="#38A69D"
            />
            <Text style={{fontWeight: 'bold', fontSize: 15}}>Paciente</Text>
          </View>
        </ContainerHeader>
        </View>

          <Formik
            initialValues={{CPF: '',CNPJ:'', password: ''}}
            onSubmit={(values) => {
              console.log(values);
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values }) => (
              <StyledFormArea>
                {checked === 'laboratorio' ? (
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
                <MsgBox>...</MsgBox>
                <StyledButton onPress={handleSubmit}>
                  <ButtonText onPress={ () => navigation.navigate('Exames')}>Login </ButtonText>
                </StyledButton>
                <Line/>
                {/* <StyledButton google={true} onPress={handleSubmit}>
                  <Fontisto name="google" color="white" size={25} />
                  <ButtonText google={true} >Entrar com Google </ButtonText>
                </StyledButton> */}
                <ExtraView>
                  <ExtraText>Esqueceu sua senha?</ExtraText>
                  <TextLink>
                    <TextLinkContent onPress={ () => navigation.navigate('Cadastro')}>Recuperar</TextLinkContent>
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