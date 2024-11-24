import { KeyboardAvoidingView, View, Text, TextInput, Image, StyleSheet, Button, Pressable, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, {useState} from 'react'
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from "@expo/vector-icons"; 
import { LinearGradient } from 'expo-linear-gradient';
import { Video } from 'expo-av';
import { string } from '@tensorflow/tfjs';

  
export default function Register() {
    const navigation = useNavigation();
  
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    
    const validateName = () => {
      let isValid = /^[a-zA-Z ]+$/.test(name);

  if(!isValid) {
    setNameError('Invalid name');
      } else {
        setNameError('');
      }
    };
  
    const validateEmail = () => {
      if (!/\S+@\S+\.\S+/.test(email)) {
        setEmailError('Enter a valid email address');
      } else {
        setEmailError('');
      }
    };
  
    const validatePassword = () => {
      if (password.length < 6) {
        setPasswordError('Password must be at least 6 characters');
      } else {
        setPasswordError('');
      }
    };
    const storeUserData = async () => {
        try {
          await AsyncStorage.setItem('user', JSON.stringify({name, email, password }));
        } catch (error) {
          console.error('Error storing user data:', error);
        }
      };
    
      const registerHandler = () => {
  // Call the validateName, validateEmail and validatePassword function to validate the name input, email input and password
        validateName();
        validateEmail();
        validatePassword();
    //Check if there are no errors in name, email and password
        if (!nameError && !emailError && !passwordError) {
          console.log('Register button pressed');
          console.log('Name:', name);
          console.log('Email:', email);
          console.log('Password:', password);
    
          // Store user data in AsyncStorage
          storeUserData();
    
          navigation.navigate('Login');
        }
      };
  
    const goLogin = () => {
      navigation.navigate('Login');
    };
  
    return (
      <KeyboardAvoidingView style={styles.container}>
        <Video source={require('./../App/Assets/Image/notetaking-appbg.mp4')} style={{ width: 450, height: 500, marginTop: 20 }} resizeMode="cover"
        shouldPlay
        isLooping
        isMuted/>
        <View style={styles.container}>
          <Text style={styles.welcomeText}>Welcome to TakeNotes</Text>
          <View style={{ marginBottom: 40 }}>
            <View>
              <View style={styles.inputShadow}>
            <View style={styles.fullnameContainer}>
            <FontAwesome 
                name="user"
                size={20}
                color="#666"
                style={{position: 'absolute',
                bottom: 10,
                left: 40}}
            />
              <TextInput
                style={styles.input}
                placeholder="Full name"
                value={name}
                onChangeText={(text) => setName(text)}
                onBlur={validateName}
              />
              </View>
              <Text style={styles.error}>{nameError}</Text>
              <View style={styles.emailContainer}>
            <FontAwesome 
                name={'envelope'}
                size={20}
                color={'#666'} 
                style={{position: 'absolute',
                bottom: -60,
                left: 40}}
            />
            </View>

              <TextInput
                style={styles.input}
                placeholder="Email Address"
                value={email}
                onChangeText={(text) => setEmail(text)}
                onBlur={validateEmail}
                autoCapitalize="none"
              />
              <Text style={styles.error}>{emailError}</Text>
                <View style={styles.passwordContainer}>
                <View style={styles.inputContainer}>
                  <FontAwesome
                    name="lock"
                    size={20}
                    color="#555"
                    style={{
                      position: 'absolute',
                      bottom: 10,
                      left: 40
                    }}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    onBlur={validatePassword}
                    secureTextEntry={!showPassword}
                  />
               <TouchableOpacity style={styles.toggle} onPress={() => setShowPassword(!showPassword)}>
                  <FontAwesome name={showPassword ? "eye-slash" : "eye"} size={20} />
                  </TouchableOpacity>
                  </View>
                  <Text style={styles.error}>{passwordError}</Text>
              </View>
            </View>
            <View style={{marginVertical: 30, alignItems: 'center', justifyContent: 'center'}}>
              <TouchableOpacity>
              <LinearGradient 
                colors={['#8bc34a', '#388e3c']} 
                start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                style={styles.button}
              >
              <Button title="Register" color="white" onPress={registerHandler} />
              </LinearGradient>
              </TouchableOpacity>
            </View>
            </View>
          </View>
          <Pressable onPress={goLogin} style={{ marginTop: -20 }}>
            <Text style={{   
                textAlign: 'center',
                fontSize: 16,
                color: '#1565c0',
                marginVertical: -34   
            }}>
                If you already signed up, login
            </Text>
            </Pressable>
        </View>
      </KeyboardAvoidingView>
    );
  }
  
  const styles = StyleSheet.create({
    container:{
        paddingTop:5,
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
      margin: 20,
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
        marginBottom: 2,
        paddingHorizontal: 35,
        width: 350,
    },
   
    error:{
        color: 'red',
        marginLeft:30
    },
    emailContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
      },  
      emailIcon: {
        marginLeft: 20,
      },
      fullnameContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
      },  
      inputContainer: {
        flexDirection: "row",
        alignItems: "center",
      },
      toggle: {
        marginLeft: -60, 
        marginTop: 20
      },
      errorBorder: {
        borderWidth: 1,
        borderRadius: 4,
        padding: 12   
      }


});