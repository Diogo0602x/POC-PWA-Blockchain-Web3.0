import React from 'react';

import { Colors } from '../../components/styles';
<<<<<<< HEAD
const {primary, tertiary, brand} = Colors;
=======
const {primary, tertiary} = Colors;
>>>>>>> 0e651f4cea8682141c42c1e4855d2c9b52d14400

// React navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import TelaInicial from '../pages/TelaInicial';
import Login from '../pages/Login';
import Cadastro from '../pages/Cadastro';
import Exames from '../pages/Exames';
import Cadastrar from '../pages/Cadastrar';

const Stack = createStackNavigator();

const Routes = () => {
  return(
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: 'transparent'
          },
          headerTintColor: tertiary,
          headerTransparent: true,
          headerTitle: '',
          headerLeftContainerStyle: {
            paddingLeft: 20
          }
        }}
        initialRouteName="TelaInicial"
      >
        <Stack.Screen name="TelaInicial" component={TelaInicial} options={{ headerShown: false}} />
<<<<<<< HEAD
        <Stack.Screen name="Login" component={Login}  options={{ headerTintColor: brand}} />
        <Stack.Screen name="Cadastro" component={Cadastro} options={{ headerTintColor: brand}} />  
        <Stack.Screen name="Exames" component={Exames}  options={{headerTintColor: primary}}  />  
        <Stack.Screen name="Cadastrar" component={Cadastrar} options={{ headerTintColor: brand}}  />  
=======
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false}} />
        <Stack.Screen name="Cadastro" component={Cadastro} options={{ headerShown: false}} />  
        <Stack.Screen name="Exames" component={Exames} options={{headerTintColor: primary}} />  
        <Stack.Screen name="Cadastrar" component={Cadastrar} options={{ headerShown: false}} />  
>>>>>>> 0e651f4cea8682141c42c1e4855d2c9b52d14400
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Routes;