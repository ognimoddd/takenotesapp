import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Home from './Pages/Home';
import Notes from './Pages/Notes';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawer from './Pages/CustomDrawer';
import React, { useState } from 'react';
import { LogBox } from 'react-native';

// Ignore log notification by message
LogBox.ignoreLogs(['Warning: ...']);

// Ignore all log notifications
LogBox.ignoreAllLogs();

console.disableYellowBox = true;

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function HomeScreen({ navigation, route }) {
  const { bookmarkedNotes } = route.params;

  const navigateToNote = (note) => {
    navigation.navigate('Notes', { note });
  };

  return (
    <Drawer.Navigator
    screenOptions={{ headerShown: false }}
    drawerContent={(props) => (
      <CustomDrawer
        {...props}
        bookmarkedNotes={bookmarkedNotes}
        navigateToNote={navigateToNote}
    
      />
    )}
  >
   <Drawer.Screen name="HomeDrawer">
        {(props) => (
          <Home
            {...props}
            bookmarkedNotes={bookmarkedNotes}
            navigateToNote={navigateToNote}
            />
        )}
      </Drawer.Screen>
    </Drawer.Navigator>
);
}

export default function App() {
  const [bookmarkedNotes, setBookmarkedNotes] = useState([]);
  return (
    <NavigationContainer>
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen  
        name="Login"
        component={Login}
      />
      <Stack.Screen
        name="Register"
        component={Register} 
      />
     <Stack.Screen screenOptions={{headerShown: false}}
        name="Home"
        component={HomeScreen} 
        initialParams={{ bookmarkedNotes }}
      />
      <Stack.Screen screenOptions={{headerShown: true}}
      name="Notes"
      component={Notes}
      />
      </Stack.Navigator>
  </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    homeBackground: "",
    noteBackground: "white",
    notes: "fff",
    header:"blue",
    headerButtons: "blue",
    addButton: "black",
    loading: "white",
  },
});
