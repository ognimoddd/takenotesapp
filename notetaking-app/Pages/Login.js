import {KeyboardAvoidingView,Platform,View, Text, TextInput, Image, StyleSheet, Button, Pressable, TouchableOpacity, ActivityIndicator} from 'react-native'
import React, {useState, useEffect} from 'react'
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from "@expo/vector-icons"; 
import { LinearGradient } from 'expo-linear-gradient';
import { Video } from 'expo-av';

export default function Login() {

    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
  
    const validate = () => {
      let isValid = true;
  
      if (!email) {
        alert('Enter email');
        isValid = false;
      }
  
      if (!password) {
        alert('Enter password');
        isValid = false;
      }
  
      return isValid;
    }
  
    const loginHandler = async () => {
      console.log('Login button pressed');
      console.log('Email Address:', email);
      console.log('Password:', password);
  
      if (!validate()) {
        return;
      }
  
      setLoading(true);
  
      try {
        // Fetch user data directly from AsyncStorage
        const userString = await AsyncStorage.getItem('user');
        //Parse the user data string to a JavaScript object
        const registeredUser = JSON.parse(userString);
       //if there's no registered user, show an alert and return
        if (!registeredUser) {
          alert('Please register first');
          return;
        }
        //If the provided email doesn't match the registered email, show an alert and return
        if (email !== registeredUser.email) {
          alert('Email does not exist');
          return;
        }
        //If the provided password doesn't match the registerd password, show an alert and return 
        if (password !== registeredUser.password) {
          alert('Invalid password');
          return;
        }
  
        // On valid login
        navigation.navigate('Home');
        AsyncStorage.setItem('isLoggedIn', 'true');
      } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred during login');
      } finally {
        setLoading(false);
      }
    };
  
    const goRegister = () => {
      navigation.navigate('Register');
    };
  
    return (
      <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}style={styles.container}>
        
        <Video source={require('./../App/Assets/Image/notetaking-appbg.mp4')} style={{ width: 450, height: 500, marginTop: 20 }} resizeMode="cover"
        shouldPlay
        isLooping
        isMuted/>
        <View style={styles.container}>
          <Text style={styles.welcomeText}>Welcome to TakeNotes</Text>
          <View style={{ marginBottom: 50 }}>
            <View>
              {loading && (
                <ActivityIndicator size="large" color="#0000ff" />
              )}
              <View style={styles.emailContainer}>
                <FontAwesome
                  name={'envelope'}
                  size={20}
                  color={'#666'}
                  style={{
                    position: 'absolute',
                    bottom: 20,
                    left: 40
                  }}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Email Address"
                  onChangeText={setEmail}
                  value={email}
                  autoCapitalize="none"
                />
              </View>
              <View style={styles.passwordContainer}>
                <View style={styles.inputContainer}>
                  <FontAwesome
                    name="lock"
                    size={20}
                    color="#555"
                    style={{
                      position: 'absolute',
                      bottom: 20,
                      left: 40
                    }}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry={!showPassword}
                    onChangeText={setPassword}
                    value={password}
                  />
                  <TouchableOpacity style={styles.toggle} onPress={() => setShowPassword(!showPassword)}>
                    <FontAwesome name={showPassword ? "eye-slash" : "eye"} size={20} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={{marginVertical: 30, alignItems: 'center', justifyContent: 'center'}}>
         
                <TouchableOpacity>
                <LinearGradient 
                colors={['#8bc34a', '#388e3c']} 
                start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                style={styles.button}
              >
                <Button
                  title="Submit" color="white" 
                  titleStyle={{ fontWeight: 'bold' }}
                  onPress={loginHandler} />
                     </LinearGradient>
                  </TouchableOpacity>
     
            </View>
          </View>
          <Pressable onPress={goRegister} style={{ marginTop: -70 }}>
            <Text style={{
              textAlign: 'center',
              fontSize: 16,
              color: '#1565c0'
            }}>
              If you haven't registered sign up
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    )
  }
const styles = StyleSheet.create({
    container:{
        paddingTop:20,
        marginTop:-40,
        backgroundColor:'#fff',
        borderTopRightRadius:40,
        borderTopLeftRadius:40,
        marginBottom: 0,
        flex:1,
        shadowOpacity: 0.50,
    shadowRadius: 3.84,

  
        
    },
    welcomeText: {
        fontSize: 35,
        textAlign:'center',
        fontWeight:'bold', 
        color:"#388e3c"   
    },
    button:{
      padding: 5,
      borderRadius: 20,
      margin: 30,
      alignItems: 'center',
      marginVertical: 10, 
      marginHorizontal: 30,
      width: 150, 
    },
    buttonText:{
        fontWeight:500
    },
    input:{
        padding:10,
        margin:30,
        borderRadius: 15,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 35,
        width: 350,
        shadowColor: "#000",
        shadowOpacity: 0.6,
        shadowRadius: 6,
    },
    boldText:{
        fontWeight:'bold',
    },
    inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  toggle: {
    marginLeft: -60, 
    marginTop: 20
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },  
  emailIcon: {
    marginLeft: 30,
  },

  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'fletx-star',
  },

  passwordIcon: {
    marginLeft: 30,
  },


});