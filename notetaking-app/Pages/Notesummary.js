import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';

export async function summarizeNote(noteText) {
  const apiKey = process.env.API_KEY || '';
  const apiURL = `https://language.googleapis.com/v1/documents:analyzeSyntax?key=${apiKey}`;

  const requestData = {
    document: {
      type: 'PLAIN_TEXT',
      content: noteText,
    },
    encodingType: 'UTF8',
  };

  try {
    const response = await fetch(apiURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    const data = await response.json();

    if (data.sentences) {
      const sentences = data.sentences.map(sentence => sentence.text.content);
      const summarizedText = await generateSummary(noteText, sentences);
      return summarizedText;
    } else {
      throw new Error('Invalid response from the Natural Language API');
    }
  } catch (error) {
    console.error('Error generating note summary:', error);
    throw error;
  }
}

async function generateSummary(text, sentences) {
  const apiKey = 'AIzaSyC92XWJ3G4iPAWtOdHU0-FFTWA-NCI--FA';
  const apiURL = `https://language.googleapis.com/v1/documents:analyzeSentiment?key=${apiKey}`;

  const requestData = {
    document: {
      type: 'PLAIN_TEXT',
      content: text,
    },
    encodingType: 'UTF8',
  };

  try {
    const response = await fetch(apiURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    const data = await response.json();

    if (data.sentences) {
      const sentenceScores = data.sentences.map(sentence => sentence.sentiment.score);
      const maxScore = Math.max(...sentenceScores);
      const minScore = Math.min(...sentenceScores);
      const threshold = (maxScore + minScore) / 2;

      const selectedSentences = sentences.filter((_, index) => sentenceScores[index] >= threshold);
      const summary = selectedSentences.join(' ');

      return summary;
    } else {
      throw new Error('Invalid response from the Natural Language API');
    }
  } catch (error) {
    console.error('Error generating summary:', error);
    throw error;
  }
}

export const NoteSummaryModal = ({ visible, onClose, noteSummary, onSaveSummary }) => {
  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Note Summary</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
          {noteSummary && (
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryText}>{noteSummary}</Text>
            </View>
          )}
          <TouchableOpacity style={styles.saveButton} onPress={onSaveSummary}>
            <Text style={styles.saveButtonText}>Save to Description</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

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
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
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
  summaryContainer: {
    marginBottom: 20,
  },
  summaryText: {
    fontSize: 16,
    marginBottom: 5,
  },
  saveButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
