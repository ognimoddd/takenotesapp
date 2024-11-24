import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CustomDrawer(props) {
  const [bookmarkedNotes, setBookmarkedNotes] = useState([]);

  useEffect(() => {
    loadBookmarkedNotes();
  }, []);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('drawerOpen', loadBookmarkedNotes);
    return unsubscribe;
  }, [props.navigation]);

  const loadBookmarkedNotes = async () => {
    const bookmarkedNotesString = await AsyncStorage.getItem('bookmarkedNotes');
    const bookmarkedNotes = JSON.parse(bookmarkedNotesString) || [];
    const filteredBookmarkedNotes = bookmarkedNotes.filter(
      (note) => note !== null && note !== undefined
    );
    setBookmarkedNotes(filteredBookmarkedNotes);
    console.log('Bookmarked notes:', filteredBookmarkedNotes);
  };
  const handleLogout = async () => {
    await AsyncStorage.removeItem('user');
    props.navigation.navigate('Login');
  };

  const navigateToNote = (note) => {
    if (note && note.id) {
      props.navigation.navigate('Notes', { note });
      props.navigation.closeDrawer();
    } else {
      console.error('Invalid note object:', note);
    }
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerHeader}>
        <Image source={require('./../App/Assets/Image/notetaking-applogo.png')} style={styles.logo} />
        <Text style={styles.drawerTitle}>My Notes App</Text>
      </View>
      <DrawerItemList {...props} />
      <View style={styles.bookmarksContainer}>
        <Text style={styles.bookmarksTitle}>Bookmarked Notes</Text>
        {bookmarkedNotes.filter(note => note && note.title).map((note) => (
          <TouchableOpacity
            key={note.id}
            style={styles.bookmarkedNoteItem}
            onPress={() => navigateToNote(note)}
          >
            <Text style={styles.bookmarkedNoteTitle}>{note.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  drawerHeader: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    borderRadius: 50,
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  bookmarksContainer: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  bookmarksTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  bookmarkedNoteItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  bookmarkedNoteTitle: {
    fontSize: 16,
  },
  logoutButton: {
    marginTop: 'auto',
    marginBottom: 20,
    marginHorizontal: 20,
    padding: 10,
    backgroundColor: '#ff0000',
    borderRadius: 5,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});