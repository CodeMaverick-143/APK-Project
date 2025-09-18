import React, { useState, useEffect } from 'react';
import {
  Modal, View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform
} from 'react-native';
import { COLORS } from '../constants/Colors';

const EditTaskModal = ({ visible, onClose, onSave, task }) => {
  const [text, setText] = useState('');

  useEffect(() => {
    if (task) {
      setText(task.text);
    }
  }, [task]);

  const handleSave = () => {
    if (text.trim()) {
      onSave({ ...task, text: text.trim() });
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Edit Task</Text>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            autoFocus
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
              <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center' },
    modalContent: {
      backgroundColor: COLORS.white, margin: 20, padding: 20, borderRadius: 12,
    },
    modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
    input: {
      backgroundColor: COLORS.light, borderWidth: 1, borderColor: '#e0e0e0',
      paddingHorizontal: 15, paddingVertical: 12, borderRadius: 12, fontSize: 16, marginBottom: 20,
    },
    buttonRow: { flexDirection: 'row', justifyContent: 'space-between' },
    button: {
      flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginHorizontal: 5,
    },
    buttonText: { color: COLORS.white, fontSize: 16, fontWeight: '600' },
    saveButton: { backgroundColor: COLORS.primary },
    cancelButton: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: '#e0e0e0' },
    cancelButtonText: { color: COLORS.dark },
});


export default EditTaskModal;