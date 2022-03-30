import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

import * as Animatable from 'react-native-animatable'
import { Touchable } from 'react-native-web';

export default function SignIn() {
  return (
    <View style={styles.container}>
      <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
        <Text style={styles.message}>Bem-vindo(a)</Text>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" style={styles.containerForm}>
        <Text style={styles.title}>CPF</Text>
        <TextInput
          placeholder="Digite seu CPF"
          style={styles.input}
        />

        <Text style={styles.title}>Senha</Text>
        <TextInput
          placeholder="Digite sua senha"
          style={styles.input}
        />

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Acessar</Text>
        </TouchableOpacity>  

        <TouchableOpacity style={styles.buttonRegister}>
          <Text style={styles.registerText}>Não possui uma conta? Cadastre-se</Text>
        </TouchableOpacity>  
        
      </Animatable.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#38A69D'
  },
  containerHeader:{
    marginTop: '14%',
    marginBottom: '8%',
    paddingStart: '5%',
   },
   message:{
     fontSize: 28,
      fontWeight: 'bold',
      color: '#FFF'
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
     backgroundColor: '#39A69D',
     width: '100%',
     borderRadius: 4,
     paddingVertical: 8,
     marginTop: 14,
     justifyContent: 'center',
     alignItems: 'center'
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
   registerText: {
     color: '#a1a1a1'
   }
})