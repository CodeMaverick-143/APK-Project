import React, { useState } from 'react';
import {
  Modal, View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS } from '../constants/Colors';
import { Feather } from '@expo/vector-icons';

const AddTaskModal = ({ visible, onClose, onSave }) => {
  const [text, setText] = useState('');
  const [category, setCategory] = useState("Work");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSave = () => {
    if (text.trim()) {
      onSave({
        id: Date.now().toString(),
        text: text.trim(),
        completed: false,
        category,
        priority,
        dueDate,
      });
      setText('');
      setDueDate(null);
    }
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add New Task</Text>

          <TextInput
            style={styles.input}
            placeholder="Task name (e.g., Design new mockups)"
            value={text}
            onChangeText={setText}
          />

          <Text style={styles.label}>Category</Text>
          <Picker selectedValue={category} onValueChange={setCategory}>
            <Picker.Item label="Work" value="Work" />
            <Picker.Item label="Personal" value="Personal" />
            <Picker.Item label="Study" value="Study" />
          </Picker>

          <Text style={styles.label}>Priority</Text>
          <Picker selectedValue={priority} onValueChange={setPriority}>
            <Picker.Item label="High" value="High" />
            <Picker.Item label="Medium" value="Medium" />
            <Picker.Item label="Low" value="Low" />
          </Picker>

          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Feather name="calendar" size={18} color={COLORS.gray} />
            <Text style={styles.dateButtonText}>
              {dueDate ? new Date(dueDate).toLocaleDateString() : "Select Due Date"}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker value={dueDate || new Date()} mode="date" display="default" onChange={onDateChange} />
          )}

          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
              <Text style={styles.buttonText}>Save Task</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: {
      backgroundColor: COLORS.white, padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20,
    },
    modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
    input: {
      backgroundColor: COLORS.light, borderWidth: 1, borderColor: '#e0e0e0',
      paddingHorizontal: 15, paddingVertical: 12, borderRadius: 12, fontSize: 16, marginBottom: 15,
    },
    label: { fontSize: 14, fontWeight: '500', color: COLORS.gray, marginTop: 10, marginLeft: 5 },
    dateButton: {
      flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.light, borderWidth: 1,
      borderColor: '#e0e0e0', padding: 12, borderRadius: 12, marginTop: 15,
    },
    dateButtonText: { fontSize: 16, marginLeft: 10, color: COLORS.dark },
    buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 25 },
    button: {
      flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginHorizontal: 5,
    },
    buttonText: { color: COLORS.white, fontSize: 16, fontWeight: '600' },
    saveButton: { backgroundColor: COLORS.primary },
    cancelButton: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: '#e0e0e0' },
    cancelButtonText: { color: COLORS.dark },
  });

export default AddTaskModal;