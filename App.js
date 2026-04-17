import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import InventarioScreen from './src/screens/InventarioScreen';
import AgregarScreen from './src/screens/AgregarScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Inventario') {
              iconName = 'list';
            } else if (route.name === 'Agregar') {
              iconName = 'add-circle';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#007BFF',
          tabBarStyle: { height: 60, paddingBottom: 10, paddingTop: 5 },
          headerTitleAlign: 'center',
        })}
      >
        <Tab.Screen name="Inventario" component={InventarioScreen} />
        <Tab.Screen name="Agregar" component={AgregarScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}