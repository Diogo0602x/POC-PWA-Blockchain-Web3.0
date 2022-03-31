import React, { useState} from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';

import * as Animatable from 'react-native-animatable'
import { Touchable } from 'react-native-web';

import { useNavigation } from '@react-navigation/native'

export default function SignIn() {
  const navigation = useNavigation();

  const [nome, setNome] = useState('');
  const [CPF, setCPF] = useState('');
  const [dataNascimento, setdataNascimento] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');

  const cadastro = () => {
    alert('Cadastro realizado com sucesso')
    navigation.navigate('SignIn')
  }

  return (
    <View style={styles.container}>
      <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
        <Image style={{width: 200, height: 200, alignSelf: 'center'}} resizeMode="contain" source={require('../../assets/logo.png')} />
        <Text style={styles.message}>Informe seus dados para cadastro:</Text>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" style={styles.containerForm}>
        <TextInput placeholder="Digite seu nome" placeholderTextColor="white" style={styles.textInput} onChangeText={text=>setNome(text)} />
        <TextInput placeholder="Digite seu CPF" placeholderTextColor="white" style={styles.textInput} onChangeText={text=>setCPF(text)} />
        <TextInput placeholder="Digite sua data de nascimento" placeholderTextColor="white" style={styles.textInput} onChangeText={text=>setdataNascimento(text)} />
        <TextInput placeholder="Digite seu email" placeholderTextColor="white" style={styles.textInput} onChangeText={text=>setEmail(text)} />
        <TextInput placeholder="Digite seu número de telefone" placeholderTextColor="white" style={styles.textInput} onChangeText={text=>setTelefone(text)} />
        <TextInput secureTextEntry={true} placeholder="Digite sua senha" placeholderTextColor="white" style={styles.textInput} onChangeText={text=>setSenha(text)} />
        <TextInput secureTextEntry={true} placeholder="Confirme sua senha" placeholderTextColor="white"  style={styles.textInput} onChangeText={text=>setSenha(text)} />
        

        <TouchableOpacity style={styles.button}  onPress={ () => cadastro()}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>  

      </Animatable.View>
    </View>
  );
}

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
  containerForm: {
    backgroundColor: '#FFF',
    flex: 1,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingStart: '5%',
    paddingEnd: '5%'
  },
  title: {
    fontSize: 20,
    marginTop: 28
  },
  input: {
    borderBottomWidth: 1,
    height: 40,
    marginBottom: 12,
    fontSize: 16
  },
  button: {
    backgroundColor: '#0f5a61',
    width: '100%',
    borderRadius: 4,
    paddingVertical: 8,
    marginTop: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10
  },
  buttonText:{
  color: '#FFF',
  fontSize: 18,
  fontWeight: 'bold',
  },
  buttonRegister: {
    marginTop: 14,
    alignSelf: 'center'
  },
  textInput: {
    width: '100%',
    height: 40,
    backgroundColor: '#39A69D',
    borderRadius: 20,
    paddingLeft: 10,
    marginBottom: 10,
    color: '#000'
  },
  buttonCadastro: {
    width: '100%',
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 20,
    justifyContent: 'center'
  },
  containerForm: {
    backgroundColor: '#FFF',
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingStart: '5%',
    paddingEnd: '5%',
    paddingTop: 25
  },
})