import React, { useContext, useState } from "react";
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { ScreenHome } from './src/screens/ScreenHome';
import { ScreenHabitAdd } from './src/screens/ScreenHabitAdd';
import { ScreenSettings } from './src/screens/ScreenSettings';
import { createDrawerNavigator } from "@react-navigation/drawer";
import { ComponentDrawer } from "./src/components/ComponentDrawer";
import { ContextStrings, strings } from "./src/utils/strings";

const Stack = createStackNavigator(); // abstract factory
// Stack with capital because its a class, not an instance
const Drawer = createDrawerNavigator();

function HomeScreenWrapper() {
  // const contextStrings = useContext(ContextStrings);
  return (
    <Drawer.Navigator
      initialRouteName='ScreenHome'
      drawerContent={(props) => <ComponentDrawer {...props} />}
    >
      <Drawer.Screen
        name='ScreenHome'
        component={ScreenHome}
        options={{title: 'Home'}}
      />
      <Drawer.Screen
        name='ScreenSettings'
        component={ScreenSettings}
        options={{title: 'Settings'}}
      />

    </Drawer.Navigator>
  )
}


function AppStack() {
  return (
    <Stack.Navigator
      initialRouteName='HomeScreenWrapper'
    >
      <Stack.Screen
        name='HomeScreenWrapper'
        component={HomeScreenWrapper}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='ScreenHabitAdd'
        component={ScreenHabitAdd}
        options={{title: 'Add new habit'}}
      />
    </Stack.Navigator>
  )
}

export function App() {
  const [currentLanguage, setCurrentLanguage] = useState(strings.getLanguage());
  return (
    <ContextStrings.Provider
      value={{
        currentLanguage: currentLanguage,
        setCurrentLanguage: setCurrentLanguage
      }}
    >
      <NavigationContainer>
        <AppStack/>
      </NavigationContainer>
    </ContextStrings.Provider>
  )
}
