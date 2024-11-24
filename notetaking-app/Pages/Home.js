import React, { useState, useEffect, useRef } from 'react';
import {  View, Text, StyleSheet, Button, TextInput, TouchableOpacity, FlatList, Animated } from 'react-native';  
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useIsFocused, DrawerActions } from '@react-navigation/native';
import { Ionicons, AntDesign, FontAwesome  } from '@expo/vector-icons';
import { Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const screenWidth = Dimensions.get('window').width;

const formatDate = (date) => {
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false, // Use 24-hour format
  };
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return 'Invalid Date';
  }
  const formattedDate = new Date(date).toLocaleString('en-GB', options);
  return formattedDate;
};

export default function Home() {
  const [data, setData] = useState(null);
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [allNotes, setAllNotes] = useState([]);
  const isFocused = useIsFocused(); 
  const [bookmarkedNotes, setBookmarkedNotes] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [typedText, setTypedText] = useState('');
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [fadeAnim] = useState(new Animated.Value(0));
  
  const navigation = useNavigation();


  useEffect(() => {
    // Load bookmarked notes from AsyncStorage when the component mounts
    loadBookmarkedNotes();
  }, []);

  useEffect(() => {
    // Reload bookmarked notes when the state changes
    loadBookmarkedNotes();
  }, [bookmarkedNotes]);

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    // Reload notes when the screen is focused or when returning from Notes.js
    if (isFocused) {
      loadNotes();
    }
  }, [isFocused]);

  useEffect(() => {
    setAllNotes(notes); // Set allNotes when notes are loaded
  }, [notes]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadBookmarkedNotes);
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const getGreeting = () => {
      const currentHour = new Date().getHours();
      if (currentHour >= 5 && currentHour < 12) {
        return 'Good Morning';
      } else if (currentHour >= 12 && currentHour < 18) {
        return 'Good Afternoon';
      } else {
        return 'Good Evening';
      }
    };
  
    const greeting = getGreeting();
    const text = `${greeting}, ${user?.name}!`;
    const duration = 4000;
  
    Animated.timing(animatedValue, {
      toValue: text.length,
      duration,
      useNativeDriver: true,
    }).start();
  
    animatedValue.addListener(({ value }) => {
      setTypedText(text.slice(0, Math.round(value)));
    });
  
    return () => {
      animatedValue.removeAllListeners();
    };
  }, [user?.name]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);
  

  const Notes = () => {
    navigation.navigate('Notes');  
  };

  const fetchUser = async () => {
    const userInfo = await AsyncStorage.getItem('user');
    setUser(JSON.parse(userInfo));
  };



  const loadNotes = async () => {
    const notesString = await AsyncStorage.getItem('notes');
    const parsedNotes = JSON.parse(notesString) || [];
    console.log('Loaded notes:', parsedNotes); 
    setNotes(parsedNotes);
  };

  const navigateToNote = (note) => {
    navigation.navigate('Notes', { note });
  };


const renderNoteItem = ({ item }) => {
  const isBookmarked = bookmarkedNotes.some(bookmarkedNote => bookmarkedNote.id === item.id);
  const tags = Array.isArray(item.tags) ? item.tags : []; 
  const formattedDate = item.date ? formatDate(new Date(item.date)) : 'No Date';

  return (
    <TouchableOpacity onPress={() => navigateToNote(item)}> 
      <View style={styles.noteCard}>
        <LinearGradient
          colors={['#e0f7fa', '#f3e5f5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.noteBackground}
        >
          <View style={styles.noteContent}>
            <Text style={styles.noteTitle}>{item.title}</Text>
            <Text style={styles.noteDescription} numberOfLines={2} ellipsizeMode="tail">
              {item.description}
            </Text>
            <Text style={styles.noteDate}>{formattedDate}</Text>
          </View>

          <View style={styles.noteActions}>
            <TouchableOpacity style={styles.pinButton} onPress={() => handlePin(item)}>
              <AntDesign name="pushpin" size={20} color={item.pinned ? 'red' : 'black'} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.bookmarkButton} onPress={() => handleBookmark(item)}>
              <FontAwesome
                name={isBookmarked ? 'bookmark' : 'bookmark-o'}
                size={20}
                color={isBookmarked ? 'blue' : 'black'}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteNote(item.id)}>
                <FontAwesome name="trash" size={20} color="black" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleShare(item)}>
  <FontAwesome name="share-alt" size={20} color="black" />
</TouchableOpacity>
          </View>

          <View style={styles.noteTags}>
            {tags.map((tag, index) => (
              <Text key={index} style={styles.tag}>
                {tag}
              </Text>
            ))}
          </View>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
};
const search = (text, notes) => {
  return notes.filter(
    (note) =>
      note.title.toLowerCase().includes(text.toLowerCase()) ||
      note.tags.some((tag) => tag.toLowerCase().includes(text.toLowerCase()))
  );
};
  const handlePin = async (note) => {
    try {
      const updatedNote = { ...note, pinned: !note.pinned };
      const allNotesString = await AsyncStorage.getItem('notes');
      const allNotes = allNotesString ? JSON.parse(allNotesString) : [];
      const updatedNotes = allNotes.map((n) => (n.id === updatedNote.id ? updatedNote : n));
      await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
      loadNotes();
      Toast.show({
        type: updatedNote.pinned ? 'success' : 'info',
        text1: updatedNote.pinned ? 'Note Pinned' : 'Note Unpinned',
        text2: updatedNote.pinned ? 'Your note has been pinned.' : 'Your note has been unpinned.',
      });
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const handleShare = async (note) => {
    try {
      const noteContent = `Title: ${note.title}\n\nDescription: ${note.description}`;
      const fileName = `${note.title.replace(/ /g, '_')}.txt`;
      const fileUri = `${FileSystem.cacheDirectory}${fileName}`;
  
      await FileSystem.writeAsStringAsync(fileUri, noteContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });
  
      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/plain',
        dialogTitle: 'Share note as text',
      });
  
      // Display success message
      Toast.show({
        type: 'success',
        text1: 'Note Shared',
        text2: 'Your note has been successfully shared.',
      });
    } catch (error) {
      // Display error message
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: `An error occurred while sharing the note: ${error.message}`,
      });
    }
  };
  const handleDeleteNote = async (noteId) => {
    try {
      // Filter out the note being deleted from the notes array
      const updatedNotes = notes.filter(note => note.id !== noteId);
      setNotes(updatedNotes);
  
      // Filter out the note being deleted from the bookmarkedNotes array
      const bookmarkedNotesString = await AsyncStorage.getItem('bookmarkedNotes');
      const bookmarkedNotes = JSON.parse(bookmarkedNotesString) || [];
      const updatedBookmarkedNotes = bookmarkedNotes.filter(note => note.id !== noteId);
      await AsyncStorage.setItem('bookmarkedNotes', JSON.stringify(updatedBookmarkedNotes));
  
      // Update the bookmarkedNotes state
      setBookmarkedNotes(updatedBookmarkedNotes);
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const loadBookmarkedNotes = async () => {
    const bookmarkedNotesString = await AsyncStorage.getItem('bookmarkedNotes');
    const bookmarkedNotes = JSON.parse(bookmarkedNotesString) || [];
    setBookmarkedNotes(bookmarkedNotes);
  };

  const handleBookmark = async (note) => {
    try {
      const updatedBookmarkedNotes = bookmarkedNotes.some(
        (bookmarkedNote) => bookmarkedNote.id === note.id
      )
        ? bookmarkedNotes.filter(
            (bookmarkedNote) => bookmarkedNote.id !== note.id
          )
        : [...bookmarkedNotes, note];
  
      setBookmarkedNotes(updatedBookmarkedNotes);
      await AsyncStorage.setItem(
        'bookmarkedNotes',
        JSON.stringify(updatedBookmarkedNotes)
      );
      loadNotes();
      loadBookmarkedNotes(); // Call loadBookmarkedNotes to update the CustomDrawer
      Toast.show({
        type: updatedBookmarkedNotes.some((bookmarkedNote) => bookmarkedNote.id === note.id)
          ? 'success'
          : 'info',
        text1: updatedBookmarkedNotes.some((bookmarkedNote) => bookmarkedNote.id === note.id)
          ? 'Note Bookmarked'
          : 'Bookmark Removed',
        text2: updatedBookmarkedNotes.some((bookmarkedNote) => bookmarkedNote.id === note.id)
          ? 'Your note has been bookmarked.'
          : 'The bookmark has been removed from your note.',
      });
    } catch (error) {
      console.error('Error updating bookmarked notes:', error);
    }
  };
 
  return (
    <LinearGradient
    colors={['#C5FAD5', '#FFFACD']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.container}
  >
      <TouchableOpacity onPress={openDrawer} style={styles.drawerButton}>
        <Ionicons name="menu" size={30} color="black" />
      </TouchableOpacity>
      
      <Animated.Text style={styles.title}>
        {typedText}
      </Animated.Text>


      <View style={styles.searchArea}>
      <AntDesign name="search1" size={20} color="#ccc" style={styles.searchicon}/>
      <TextInput 
        placeholder="Search Notes...." 
        maxLength={70}  
        onChangeText={(text) => {
          setData(text);
          const filteredNotes = search(text, allNotes);
          setNotes(filteredNotes);
        }}
        value={data}
        onClear={() => {
          setData('');
          setNotes(allNotes);
        }}
      />
      </View>

      <View style={styles.container}>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>  
      <FlatList
        data={[...notes.filter((n) => n.pinned), ...notes.filter((n) => !n.pinned)]}
        renderItem={renderNoteItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.noteList}
      />
      </Animated.View>
    </View>

      <TouchableOpacity onPress={Notes} style={[styles.notesIcon, { borderRadius: 30 }]}>
        <Ionicons name="create-outline" size={30} color='white'/>
      </TouchableOpacity>
          <Toast />
      </LinearGradient>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center',
    padding: 20,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 10,
      height: 5,
      
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,  
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'System',
    marginVertical: 40  
  },
  noteContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    width: '100%',
  },
  noteItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 10,
    paddingBottom: 30,
    paddingHorizontal: 10,
    width: 300,
    height: 100,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
    searchArea:{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white', 
        borderRadius:20,
        margin: 5,
        paddingHorizontal: 10,
        paddingVertical: 10,
        elevation:6,
       borderWidth: 7, 
        borderColor: '#6087a8',
      width: '90%',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    Searchicon: {
      marginRight: 10
    },
    notesIcon: {
     marginLeft: 350,
     backgroundColor: "#506f8a",
     borderRadius: 30,
     padding: 8,
     top:-10,
     elevation: 5, 
     shadowColor: "#blue",
     shadowOffset: {
      width: 4,
      height: 6
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  titleContainer: {
    flexDirection: 'row',
    overflow: 'hidden'
  },
  letter: {
    fontSize: 24,
    fontFamily: 'serif',
    color: 'purple'
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  noteDescription: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'System',
    marginBottom: 8,
    lineHeight: 20,
  },
  noteDate: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'System',
    marginTop: 5, 
  },
  pinButton: {
    marginRight: 8,
  },
  drawerButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    Index: 1,
  }, 
  bookmarkButton: {
    marginRight: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  tag: {
    backgroundColor: '#eee',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 5,
    marginBottom: 5,
  },
  noteContent: {
    marginBottom: 8,
  },
  noteActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  noteCard: {
    borderRadius: 10,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  noteBackground: {
    borderRadius: 10,
    padding: 16,
  },
  noteContent: {
    marginBottom: 8,
  },
  deleteButton: {
    marginLeft: 10,
  },
  pinButton: {
    marginRight: 10,
  },
  bookmarkButton: {
    marginRight: 10,
  },

});
