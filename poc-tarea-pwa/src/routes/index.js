import React from 'react';

import { Colors } from '../../components/styles';
const {primary, tertiary, brand} = Colors;

// React navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import TelaInicial from '../pages/TelaInicial';
import Login from '../pages/Login';
import Cadastrar from '../pages/Cadastrar';
import ExamesPaciente from '../pages/ExamesPaciente';
import ExamesLaboratorio from '../pages/ExamesLaboratorio';
import RestaurarSenha from '../pages/RestaurarSenha';
import ResultadoExame from '../pages/ResultadoExame';
import ResultadoExameLaboratorio from '../pages/ResultadoExameLaboratorio';
import RoutesExamePaciente from '../pages/ExamesPaciente/RoutesExamePaciente';
import RoutesExameLaboratorio from '../pages/ExamesLaboratorio/RoutesExameLaboratorio';
import EditarExame from '../pages/EditarExame';

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
        <Stack.Screen name="Login" component={Login}  options={{ headerTintColor: brand}} />
        <Stack.Screen name="ExamesPaciente" component={ExamesPaciente}  options={{headerTintColor: primary}}  /> 
        <Stack.Screen name="ExamesLaboratorio" component={ExamesLaboratorio}  options={{headerTintColor: primary}}  /> 
        <Stack.Screen name="RestaurarSenha" component={RestaurarSenha} options={{ headerTintColor: brand}}  />  
        <Stack.Screen name="Cadastrar" component={Cadastrar} options={{ headerTintColor: brand}}  />  
        <Stack.Screen name="RoutesExamePaciente" component={RoutesExamePaciente} options={{ headerTintColor: brand}}  />  
        <Stack.Screen name="RoutesExameLaboratorio" component={RoutesExameLaboratorio} options={{ headerTintColor: brand}}  />  
        <Stack.Screen name="ResultadoExame" component={ResultadoExame} options={{ headerTintColor: brand}} />
        <Stack.Screen name="ResultadoExameLaboratorio" component={ResultadoExameLaboratorio} options={{ headerTintColor: brand}} />
        <Stack.Screen name="EditarExame" component={EditarExame} options={{ headerTintColor: brand}} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Routes;