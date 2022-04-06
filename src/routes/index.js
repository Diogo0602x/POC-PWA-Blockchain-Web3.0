import { createNativeStackNavigator } from "@react-navigation/native-stack";

import TelaInicial from '../pages/TelaInicial';
import Login from '../pages/Login';
import Cadastro from '../pages/Cadastro';
import Exames from '../pages/Exames';

const Stack = createNativeStackNavigator();

export default function Routes(){
  return(
    <Stack.Navigator>
      <Stack.Screen
        name="TelaInicial"
        component={TelaInicial}
        options={{ headerShown: false}}
      />

      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false}}
      />

      <Stack.Screen
        name="Cadastro"
        component={Cadastro}
        options={{ headerShown: false}}
      />  
      <Stack.Screen
        name="Exames"
        component={Exames}
        options={{ headerShown: false}}
      />  
    </Stack.Navigator>
  )
}