import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute} from '@react-navigation/native';
// import Cadastrar from '../Cadastrar';
import ExamesPaciente from '../ExamesPaciente';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TelaInicial from '../TelaInicial';

const Tab = createBottomTabNavigator();

function RoutesExamePaciente({route}) {
    const paciente = route.params;
    return (
        <Tab.Navigator 
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "#38A69D",
            }}
         >
            <Tab.Screen name="Exames" component={ExamesPaciente} initialParams={paciente} options={{
                tabBarIcon: ({color, size}) => (
                    <Ionicons name="heart-outline" color={color} size={size} />
                )
            }}/>
            <Tab.Screen 
                name="Sair" 
                component={TelaInicial} 
                options={({route}) => ({
                    tabBarStyle: {display: getTabBarVisibility(route)},
                    tabBarIcon: ({color, size}) => (
                        <Ionicons name="exit-outline" color={color} size={size} />
                    ),
                })}
            />
        </Tab.Navigator>
    );
};

const getTabBarVisibility = (route) => {
    const routeName = getFocusedRouteNameFromRoute ( route ) ?? 'Sair';

    if(routeName == 'Sair') {
        return 'none';
    }
    return 'flex';
};

export default RoutesExamePaciente;