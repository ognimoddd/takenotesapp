import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, Alert, Image, Share } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Fontisto, MaterialIcons, AntDesign, Entypo, FontAwesome, FontAwesome5, Feather, MaterialCommunityIcons, FontAwesome6,Ionicons } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';
import * as Print from 'expo-print';
import HandwritingRecognition from './HandwritingRecognition';
import ImageDetection from './ImageDetection';
import Toast from 'react-native-toast-message';
import PropTypes from 'prop-types';
import { summarizeNote, NoteSummaryModal } from './Notesummary';
import LoadingAnimation from './LoadingAnimation';

const TEMPLATE_OPTIONS = {
 meetingNotes: {
    title: 'Meeting Notes',
    content: '- Date:\n- Attendees:\n- Agenda:\n  1.\n  2.\n  3.\n- Action Items:\n  1.\n  2.\n  3.\n',
  },
  lectureNotes: {
    title: 'Lecture Notes',
    content: '- Subject:\n- Lecturer:\n- Main Topics:\n  1.\n  2.\n  3.\n- Key Points:\n  1.\n  2.\n  3.\n',
  },
  brainstormingSession: {
    title: 'Brainstorming Session',
    content: '- Topic:\n- Participants:\n- Ideas:\n  1.\n  2.\n  3.\n- Next Steps:\n  1.\n  2.\n  3.\n',
  },
};

const FontStylePicker = ({ fontFamily, fontSize, onFontFamilyChange, onFontSizeChange }) => (
  <View style={styles.optionsRow}>
    <RNPickerSelect
      onValueChange={onFontSizeChange}
      items={[
        { label: 'Small', value: '12' },
        { label: 'Medium', value: '14' },
        { label: 'Large', value: '16' },
      ]}
      placeholder={{
        label: 'Size',
        value: fontSize.toString(),
      }}
      style={{
        inputIOS: styles.pickerInput,
        inputAndroid: styles.pickerInput,
        iconContainer: styles.pickerIconContainer,
      }}
      useNativeAndroidPickerStyle={false}
      textInputProps={{
        style: styles.pickerText,
      }}
    />
    <View style={styles.separator} />
    <RNPickerSelect
      onValueChange={onFontFamilyChange}
      items={[
        { label: 'Arial', value: 'Arial' },
        { label: 'Verdana', value: 'Verdana' },
        { label: 'Helvetica', value: 'Helvetica' },
      ]}
      placeholder={{
        label: 'Font Family',
        value: fontFamily,
      }}
      style={{
        inputIOS: styles.pickerInput,
        inputAndroid: styles.pickerInput,
        iconContainer: styles.pickerIconContainer,
      }}
      useNativeAndroidPickerStyle={false}
      textInputProps={{
        style: styles.pickerText,
      }}
    />
  </View>
);

const ColorPicker = ({ color, backgroundColor, onColorChange, onBackgroundColorChange }) => {
  const [selectedBackgroundColor, setSelectedBackgroundColor] = useState(backgroundColor || 'default');

  const handleBackgroundColorChange = (value) => {
    setSelectedBackgroundColor(value);
    onBackgroundColorChange(value);
  };

  return (
  <View style={styles.optionsRow}>
     <View style={styles.separator} />
    <RNPickerSelect
      onValueChange={onColorChange}
      items={[
        { label: 'Black', value: 'black' },
        { label: 'Red', value: 'red' },
        { label: 'Blue', value: 'blue' },
      ]}
      placeholder={{
        label: 'Font Color',
        value: color,
      }}
      style={styles.dropdown}
      textInputProps={{
        style: styles.pickerText,
      }}
    />
    
    <View style={styles.separator} />
    <RNPickerSelect
      onValueChange={onBackgroundColorChange}
      items={[
        { label: 'Default', value: 'default' },
        { label: 'White', value: 'white' },
        { label: 'Gray', value: 'gray' },
        { label: 'Yellow', value: 'yellow' },
      ]}
      placeholder={{
        label: 'Background',
        value: selectedBackgroundColor,
      }}
      value={selectedBackgroundColor}
      style={styles.dropdown}
      textInputProps={{
        style: styles.pickerText,
      }}
    />
  </View>
);
    };
const TemplatePicker = ({ selectedTemplate, onTemplateSelect, pickerItems }) => (
 <View style={styles.inputContainer}>
    <View style={styles.templatePickerContainer}>
      <RNPickerSelect
        onValueChange={onTemplateSelect}
        items={pickerItems}
        placeholder={{}}
        style={{
          inputIOS: styles.pickerInput,
          inputAndroid: styles.pickerInput,
          iconContainer: styles.pickerIconContainer,
        }}
        useNativeAndroidPickerStyle={false}
        textInputProps={{
          style: styles.pickerText,
        }}
      />
    </View>
  </View>
);

const TagsInput = ({ tags, onTagsChange }) => (
  <View style={styles.inputContainer}>
    <TextInput
      style={styles.tagsInput}
      placeholder="Enter tags"
      value={tags.join(', ')}
      onChangeText={(text) => onTagsChange(text.split(',').map((tag) => tag.trim()))}
    />
  </View>
);

const NotesActions = ({ onSave, onDelete, onShare, onPrint}) => (
 <View style={styles.buttonsContainer}>
    <TouchableOpacity style={styles.actionButton} onPress={onSave}>
      <Fontisto name="save" size={20} color="black" />
      <Text style={styles.actionButtonText}>Save</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
      <AntDesign name="delete" size={20} color="black" />
      <Text style={styles.actionButtonText}>Delete</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.actionButton} onPress={onShare}>
      <Fontisto name="share" size={20} color="black" />
      <Text style={styles.actionButtonText}>Share</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.actionButton} onPress={onPrint}>
      <Fontisto name="print" size={20} color="black" />
      <Text style={styles.actionButtonText}>Print</Text>
    </TouchableOpacity>
  </View>
);

export default function Notes() {
  const navigation = useNavigation();
  const route = useRoute();
  const isEditing = route.params?.note;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontSize, setFontSize] = useState(14);
  const [color, setColor] = useState('black');
  const [backgroundColor, setBackgroundColor] = useState(null);
  const [tags, setTags] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isHandwritingEnabled, setIsHandwritingEnabled] = useState(false);
  const [isHandwritingMode, setIsHandwritingMode] = useState(false);
  const [isImageDetectionVisible, setIsImageDetectionVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [labels, setLabels] = useState([]);
  const [noteSummary, setNoteSummary] = useState(null);
  const [isSummaryModalVisible, setIsSummaryModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (isEditing) {
      setTitle(isEditing.title);
      setDescription(isEditing.description);
      setFontFamily(isEditing.fontFamily || 'Arial');
      setFontSize(isEditing.fontSize || 14);
      setColor(isEditing.color || 'black');
      setBackgroundColor(isEditing.backgroundColor || null);
      setTags(isEditing.tags || []);
    }
  }, [isEditing]);

  const handleTemplateSelect = useCallback((value) => {
    if (value) {
      const template = TEMPLATE_OPTIONS[value];
      setSelectedTemplate(template);
      setTitle(template.title);
      setDescription(template.content);
    } else {
      setSelectedTemplate(null);
      setTitle('');
      setDescription('');
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    try {
      setIsLoading(true);
      const note = {
        id: isEditing?.id || Date.now().toString(),
        title,
        description,
        fontFamily,
        fontSize,
        color,
        backgroundColor,
        tags,
        date: new Date().toISOString(),
      };

      const notes = await AsyncStorage.getItem('notes');
      const parsedNotes = notes ? JSON.parse(notes) : [];

      if (isEditing) {
        const updatedNotes = parsedNotes.map((n) => (n.id === note.id ? note : n));
        await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
      } else {
        await AsyncStorage.setItem('notes', JSON.stringify([...parsedNotes, note]));
      }

      Toast.show({
        type: 'success',
        text1: 'Note Saved',
        text2: 'Your note has been successfully saved.',
      });

      navigation.goBack();
      setIsLoading(false);
    } catch (error) {
      console.error('Error saving note:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'An error occurred while saving the note.',
      });
      setIsLoading(false);
    }
  }, [title, description, fontFamily, fontSize, color, backgroundColor, tags, isEditing]);

  const handleCancel = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleDelete = useCallback(async () => {
    try {
      if (isEditing) {
        const notes = await AsyncStorage.getItem('notes');
        const parsedNotes = notes ? JSON.parse(notes) : [];
        const updatedNotes = parsedNotes.filter((n) => n.id !== isEditing.id);
        await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));

        Toast.show({
          type: 'success',
          text1: 'Note Deleted',
          text2: 'Your note has been successfully deleted.',
        });

        navigation.goBack();
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error deleting note:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'An error occurred while deleting the note.',
      });
      setIsLoading(false);
    }
  }, [isEditing, navigation]);

  const handleShare = useCallback(async () => {
    try {
      const note = {
        title,
        description,
        fontFamily,
        fontSize,
        color,
        backgroundColor,
        tags,
        date: new Date().toISOString(),
      };
  
      const noteContent = `Title: ${note.title}\n\nDescription: ${note.description}\n\nTags: ${note.tags.join(', ')}`;
      const fileName = 'note.txt';
      const fileUri = `${FileSystem.cacheDirectory}${fileName}`;
  
      // Write the content to a temporary file
      await FileSystem.writeAsStringAsync(fileUri, noteContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });
  
      // Check if sharing is available
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'text/plain',
          dialogTitle: 'Share your note',
        });
  
        Toast.show({
          type: 'success',
          text1: 'Note Shared',
          text2: 'Your note has been successfully shared.',
        });
      } else {
        throw new Error('Sharing not available on this platform');
      }
    } catch (error) {
      console.error('Error sharing note:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'An error occurred while sharing the note.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [title, description, fontFamily, fontSize, color, backgroundColor, tags, setIsLoading]);

  const handleTextToSpeech = useCallback(async () => {
    try {
      if (isSpeaking) {
        await Speech.stop();
        setIsSpeaking(false);
      } else {
        await Speech.speak(description, {
          onDone: () => setIsSpeaking(false),
          onStopped: () => setIsSpeaking(false),
        });
        setIsSpeaking(true);
      }
    } catch (error) {
      console.error('Error with text-to-speech:', error);
    }
  }, [description, isSpeaking]);

  const toggleHandwriting = useCallback(() => {
    setIsHandwritingEnabled(!isHandwritingEnabled);
    setIsHandwritingMode(!isHandwritingMode);
  }, [isHandwritingEnabled, isHandwritingMode]);

  const handleHandwritingResult = useCallback((recognizedText) => {
    setDescription((prevDescription) => prevDescription + ' ' + recognizedText);
  }, []);

  const handleImageDetectionResult = useCallback((detectedLabels) => {
    setLabels(detectedLabels);
  }, []);

  const handleSaveImageAndLabels = useCallback((imageUri, labels) => {
    const labelText = labels.map((label) => label.description).join(', ');
    setDescription((prevDescription) => prevDescription + '\n\nDetected labels: ' + labelText);
    setSelectedImage(imageUri);
    setIsImageDetectionVisible(false);
  }, []);

  useEffect(() => {
    if (route.params?.labels && route.params?.imageUri) {
      handleImageDetectionResult(route.params.imageUri, route.params.labels);
    }
  }, [route.params?.labels, route.params?.imageUri, handleImageDetectionResult]);

  const printNote = useCallback(async () => {
    try {
      const { uri } = await Print.printToFileAsync({
        html: `
          <html>
            <head>
              <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
            </head>
            <body style="text-align: center;">
              <h1 style="font-size: 24px; font-family: Helvetica Neue; font-weight: normal;">
                ${title}
              </h1>
              <p>${description}</p>
            </body>
          </html>
        `,
      });

      await Share.share({ url: uri, message: 'Printed note' });
    } catch (error) {
      console.error('Error printing note:', error);
    }
  }, [title, description]);

  const changeBackgroundColor = (color) => {
    if (color === 'default') {
      setBackgroundColor(null);
    } else {
      setBackgroundColor(color);
    }
  };

  const memoizedPickerItems = useMemo(
    () => [
      { label: 'Select a template', value: '' },
      ...Object.entries(TEMPLATE_OPTIONS).map(([key, template]) => ({
        label: template.title,
        value: key,
      })),
    ],
    []
  );

  const handleSummarizeNote = useCallback(async () => {
    try {
      setIsLoading(false);
      const summary = await summarizeNote(description);
      setNoteSummary(summary);
      setIsSummaryModalVisible(true);
      setIsLoading(false);
    } catch (error) {
      console.error('Error summarizing note:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'An error occurred while summarizing the note.',
      });
      setIsLoading(false);
    }
  }, [description]);

  const handleSaveSummary = useCallback(() => {
    if (noteSummary) {
      setDescription((prevDescription) =>
        prevDescription +
        '\n\nNote Summary:\n' +
        noteSummary
      );
  
      setIsSummaryModalVisible(false);
    }
  }, [noteSummary]);
  

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <LinearGradient
    colors={backgroundColor ? [backgroundColor, backgroundColor] : ['#C5FAD5', '#FFFACD']}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
  style={styles.container}
    >
        {isLoading && <LoadingAnimation />} 
        <View style={styles.headerContainer}>
  <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
    <Ionicons name="arrow-back" size={24} color="black" />
  </TouchableOpacity>
      <TextInput
        style={styles.titleInput}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
  </View>
      <View style={styles.inputContainertwo}>
        <TemplatePicker
          selectedTemplate={selectedTemplate}
          onTemplateSelect={handleTemplateSelect}
          pickerItems={memoizedPickerItems}
        />
        <TagsInput tags={tags} onTagsChange={setTags} />
      </View>

      <View style={styles.optionsContainer}>
        <FontStylePicker
          fontFamily={fontFamily}
          fontSize={fontSize}
          onFontFamilyChange={setFontFamily}
          onFontSizeChange={(size) => setFontSize(parseInt(size))}
        />
        <ColorPicker
          color={color}
          backgroundColor={backgroundColor}
          onColorChange={setColor}
          onBackgroundColorChange={changeBackgroundColor}
        />
      </View>

      <View>
        <View style={{ flexDirection: 'row' }}>
          <View style={[styles.descriptionContainer, { backgroundColor, flex: 1 }]}>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#ddd',
                backgroundColor: '#fff',
                padding: 30,
                textAlignVertical: 'top',
                width:'100',
                shadowOpacity: 0.1,
                shadowRadius: 10,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 5 },
                fontFamily: fontFamily,
                fontSize: fontSize,
                color: color,
                fontFamily: isHandwritingMode ? 'Verdana' : fontFamily,
                //height:200,
                //lineHeight:20,
                height: isHandwritingEnabled ? 300 : 340,
              }}
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
              multiline={true}
              //blurOnSubmit={true} 
              
            />
            {selectedImage && (
              <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
            )}
          </View>
          {isHandwritingEnabled && (
            <View style={styles.handwritingContainer}>
              <HandwritingRecognition onResult={handleHandwritingResult} />
            </View>
          )}
        </View>
      </View>


      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionAIButton, { backgroundColor: isSpeaking ? 'red' : 'purple' }]}
          onPress={handleTextToSpeech}
        >
            {isSpeaking ? (
           <MaterialCommunityIcons name="text-to-speech-off" size={24} color="black" />
            ) : (
              <MaterialCommunityIcons name="text-to-speech" size={24} color="white" />
            )}
        </TouchableOpacity>

        <TouchableOpacity
 style={[styles.actionAIButton, { backgroundColor: 'orange' }]}
 onPress={toggleHandwriting}
>
  <View>
    {isHandwritingEnabled ? (
      <FontAwesome6 name="text-slash" size={24} color="white" />
    ) : (
      <MaterialCommunityIcons name="text-recognition" size={24} color="white" />
    )}
 
  
  </View>
</TouchableOpacity>


        <TouchableOpacity
           style={[styles.actionAIButton, { backgroundColor: '#e9d216' }]}
           onPress={() => setIsImageDetectionVisible(true)}
        >
      <View>
      <MaterialCommunityIcons name="image-search" size={24} color="white" />
  </View>
        </TouchableOpacity>
        {isImageDetectionVisible && (
          <ImageDetection
            onClose={() => setIsImageDetectionVisible(false)}
            onDetectedLabels={handleImageDetectionResult}
            onSave={handleSaveImageAndLabels}
          />
        )}
        
        <TouchableOpacity style={[styles.actionAIButton, { backgroundColor: 'green' }]}
  onPress={handleSummarizeNote}>
  <View>

    <MaterialIcons name="summarize" size={24} color="white" />
  </View>
</TouchableOpacity>

       
      </View>

      <NoteSummaryModal
        visible={isSummaryModalVisible}
        onClose={() => setIsSummaryModalVisible(false)}
        noteSummary={noteSummary}
        onSaveSummary={handleSaveSummary}
      />


  <NotesActions
        onSave={handleSubmit}
        onDelete={handleDelete}
        onShare={handleShare}
        onPrint={printNote}
      />

      <Toast />
    </LinearGradient>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingTop: 70,
  },
  titleInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'transparent',
    padding: 10,
    height: 600,
    textAlignVertical: 'top',
    borderRadius: 1,
    shadowColor: '#000',
    flex: 1,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: 800,
  },
  saveButton: {
    backgroundColor: 'green',
    padding: 15,
    marginTop: 10,
    alignItems: 'left',
    borderRadius: 40,
    width: 100,
  },
  cancelButton: {
    backgroundColor: 'grey',
    padding: 12,
    marginTop: 10,
    alignItems: 'left',
    borderRadius: 40,
    width: 100,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 12,
    marginTop: 10,
    alignItems: 'left',
    borderRadius: 40,
    width: 100,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#C3D8B5',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  dropdown: {
    borderRadius: 5,
    backgroundColor: '#f2f2f2',
    borderColor: '#e0e0e0',
    borderWidth: 1,
    padding: 12,
  },
  dropdownText: {
    fontSize: 14,
    color: '#888',
    fontFamily: 'Lato',
  },
  normalfont: {
    fontFamily: 'Impact',
  },
  pickerInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  pickerText: {
    fontSize: 12,
    color: '#333',
  },
  pickerIconContainer: {
    top: 1,
    right: 10,
  },
  fontchangesContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  shareButton: {
    backgroundColor: 'blue',
    padding: 12,
    marginTop: 10,
    alignItems: 'left',
    borderRadius: 40,
    width: 100,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 8,
    marginHorizontal: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 13,
  },
  separator: {
    width: 1,
    height: 20,
    backgroundColor: '#ccc',
    marginHorizontal: 10,
  },
  tagsInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    width: '60%',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tagsInputContainer: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 1,
    marginTop:5,

  },
  inputContainertwo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 1,
  },
  templatePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 40,
    marginVertical: 10,
    shadowColor: '#000',
    width: 'auto',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tagsInputContainer: {
    flex: 1,
  },
  pickerInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  pickerText: {
    fontSize: 14,
    color: '#333',
  },
  actionsContainer: {
    flexDirection: 'row',
    backgroundColor: '#C7E9C0',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 40,
   paddingVertical: 10, // Added vertical padding
    paddingHorizontal: 15, // Reduced horizontal paddi
    borderRadius:30,
    shadowColor: '#000', // Shadow color
    shadowOffset: {
      width: 0,
      height: 2, // Vertical offset for the shadow
    },
    shadowOpacity: 0.50, // Opacity of the shadow
    shadowRadius: 3.84, // Blur radius for the shadow
  },
  handwritingContainer: {
    height: 400,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },

  selectedImage: {
    width: '100%',
    height: 200,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  descriptionContainer: {
    position: 'relative',
    flex: 1,
  },
  toolbarButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  toolbarButtonText: {
    fontSize: 18,
    color: '#555',
    marginTop: 5,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#C3D8B5',
    paddingVertical: 25,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  actionAIButton: {
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 40,
    width: 60,
    height: 50,
    marginHorizontal: 5,
  },
  headerContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 1,
  paddingVertical: 13,
  borderBottomWidth: 1,
  borderBottomColor: '#ccc',
},
backButton: {
  marginRight: 10,
},
});