import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Modal } from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import LoadingAnimation from './LoadingAnimation';

const ImageDetection = ({  onClose, onDetectedLabels, onSave }) => {
  const [imageUri, setImageUri] = useState(null);
  const [labels, setLabels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
      console.log(result);
    } catch (error) {
      console.error('Error picking image: ', error);
    }
  };
//This function analyses the selected image using the Google Cloud Vision API
  const analyzeImage = async () => {
    try {
      if (!imageUri) {
        alert('Please select an image first!');
        return;
      }

      setIsLoading(true); // Set isLoading to true before starting the image analysis process
    console.log('isLoading:', isLoading);
      //Google Cloud Vision API key
      const apiKey = process.env.API_KEY || '';
      const apiURL = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;
  
      const base64ImageData = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
  //Prepare the request data
      const requestData = {
        requests: [
          {
            image: {
              content: base64ImageData,
            },
            features: [{ type: 'LABEL_DETECTION', maxResults: 5 }],
          },
        ],
      };
  //Send the request to the Cloud Vision API using Axios
      const apiResponse = await axios.post(apiURL, requestData);
      if (apiResponse.data.responses && apiResponse.data.responses[0].labelAnnotations) {
        const labels = apiResponse.data.responses[0].labelAnnotations;
        setLabels(labels);
        onDetectedLabels(labels);
      } else {
        console.error('Unexpected API response format');
        alert('Error analysing image. Please try again later.');
      }
    } catch (error) {
    console.error('Error analysing image:', error);
    alert('Error analyzing image. Please try again later.');
  } finally {
    setIsLoading(false); // Set isLoading to false after the image analysis process is complete
    console.log('isLoading:', isLoading);
  }
};

  return (
<Modal
      animationType="slide"
      transparent={true}
      visible={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Image Analysis</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
          {imageUri && <Image source={{ uri: imageUri }} style={styles.selectedImage} />}
          <TouchableOpacity onPress={pickImage} style={styles.button}>
            <Text style={styles.buttonText}>Choose an image</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={analyzeImage} style={styles.button}>
            <Text style={styles.buttonText}>Analyse Image</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onSave(imageUri, labels)} style={styles.button}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          {labels.length > 0 && (
            <View style={styles.labelsContainer}>
              <Text style={styles.labelsTitle}>Detected Labels:</Text>
              {labels.map((label) => (
                <Text key={label.mid} style={styles.labelText}>
                  {label.description}
                </Text>
              ))}
              <LoadingAnimation /> 
            </View>
          )}
          {isLoading && <LoadingAnimation />} 
        </View>
      </View>
    </Modal>
  );
};

export default ImageDetection;

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        
      },
      modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        width: '80%',
        maxHeight: '80%',
      },
      closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
      },
      closeButtonText: {
        fontSize: 18,
        color: 'blue',
      },
      selectedImage: {
        width: 200,
        height: 200,
        marginBottom: 20,
      },
      button: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
      },
      buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
      },
      labelsContainer: {
        marginTop: 20,
        alignItems: 'center',
        paddingBottom: 20,
      },
      labelsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
      },
      labelText: {
        fontSize: 16,
        marginBottom: 5,
      },
      modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
      },
      
    });
