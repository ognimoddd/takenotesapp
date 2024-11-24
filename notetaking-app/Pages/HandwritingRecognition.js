import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const HandwritingRecognition = ({ onResult }) => {
  const apiKey = process.env.API_KEY || '';
  const apiURL = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

  const handleImagePicker = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission denied to access camera roll');
        alert('Sorry, we need camera roll permissions to select an image.');
        return;
      }
  
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      console.log('ImagePicker Result:', result);
  
      if (!result.cancelled && result.assets && result.assets.length > 0) {
        const selectedAsset = result.assets[0];
        console.log('Selected Image URI:', selectedAsset.uri);
        const base64Image = await FileSystem.readAsStringAsync(selectedAsset.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        console.log('Base64 Image:', base64Image);
        await performTextRecognition(base64Image);
      } else {
        console.error('No image selected');
      }
    } catch (error) {
      console.error('Error selecting image:', error);
    }
  };
// This function performs text recognition using the Google Cloud Vision
  const performTextRecognition = async (base64Image) => {
    try {
      const requestData = {
        requests: [
          {
            image: {
              content: base64Image,
            },
            features: [
              {
                type: 'TEXT_DETECTION',
              },
            ],
          },
        ],
      };

      console.log('Request Data:', JSON.stringify(requestData));
      // Send the request to the Cloud Vision API
      const response = await fetch(apiURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      console.log('API Response Status:', response.status);

      const responseData = await response.json();
      console.log('Response Data:', responseData);

      if (response.ok) {
        if (responseData && responseData.responses && responseData.responses.length > 0) {
          const fullTextAnnotation = responseData.responses[0].fullTextAnnotation;
          const recognizedText = fullTextAnnotation ? fullTextAnnotation.text : '';
          console.log('Recognized Text:', recognizedText);
          onResult(recognizedText);
        } else {
          console.error('Invalid response data:', responseData);
          onResult('');
        }
      } else {
        console.error('API request failed with status:', response.status);
        onResult('');
      }
    } catch (error) {
      console.error('Error recognizing text:', error);
      onResult('');
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Select Image" onPress={handleImagePicker} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HandwritingRecognition;
