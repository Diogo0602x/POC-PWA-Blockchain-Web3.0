import React from 'react';
import { 
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity
 } from 'react-native';

 import * as Animatable from 'react-native-animatable'

 import { useNavigation } from '@react-navigation/native'

export default function Welcome() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>

      <View style={styles.containerLogo}> 
        <Animatable.Image
          animation="flipInY"
          source={require('../../../assets/logo.png')}
          style={{ width: '100%', height: '60%' }}
          resizeMode="contain"
        />
      </View>

      <Animatable.View delay={600} animation="fadeInUp" style={styles.containerForm}>
        <Text style={styles.title}>Veja seus exames a qualquer momento, em qualquer lugar! </Text>
        <Text style={styles.text}>Faça seu login para ver seus exames</Text>
      </Animatable.View>

      <TouchableOpacity 
      style={styles.button}
      onPress={ () => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>Acessar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#FFF'
  },
  containerLogo: {
    flex: 2,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerForm: {
    flex: 1,
    backgroundColor: '#38A69D',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingStart: '5%',
    paddingEnd: '5%',
  },
  title:{
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 28,
    marginBottom: 12,
    color: '#FFF'
  },
  text: {
    color:'#FFF'
  },
  button: {
    position: 'absolute',
    backgroundColor: '#FFF',
    borderRadius: 50,
    paddingVertical: 8,
    width: '60%',
    alignSelf: 'center',
    bottom: '9%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText:{
    fontSize: 18,
    color: '#38A69D',
    fontWeight: 'bold'
  }
})