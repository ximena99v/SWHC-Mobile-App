import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, Button, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Agenda } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';

const currentDate = new Date().toISOString().split('T')[0];
const work = { key: 'work', color: 'red', selectedDotColor: 'blue' };
const massage = { key: 'massage', color: 'white', selectedDotColor: 'white' };
const workout = { key: 'workout', color: 'green' };

function Schedule() {
  const navigation = useNavigation();
  const [selectedDay, setSelectedDay] = useState(currentDate);
  const [items, setItems] = useState({
    '2024-08-24': [{ name: 'Sample task for 24th' }],
    '2024-08-26': [{ name: 'Sample task for 26th' }],
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newEventName, setNewEventName] = useState('');
  const [fromTime, setFromTime] = useState(new Date());
  const [toTime, setToTime] = useState(new Date());
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => setIsModalVisible(true)} style={styles.navButton}>
          <Text style={styles.navButtonText}>Add</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const onDayPress = (day) => {
    setSelectedDay(day.dateString);
  };

  const addNewEvent = () => {
    if (newEventName.trim()) {
      setItems((prevItems) => ({
        ...prevItems,
        [selectedDay]: [
          ...(prevItems[selectedDay] || []),
          { name: newEventName, from: fromTime.toLocaleTimeString(), to: toTime.toLocaleTimeString() },
        ],
      }));
      setNewEventName('');
      setIsModalVisible(false);
    }
  };

  const renderItem = (item) => (
    <View style={styles.item}>
      <Text style={styles.itemText}>{item.name}</Text>
      <Text style={styles.itemText}>
        {item.from} - {item.to}
      </Text>
    </View>
  );

  const renderEmptyData = () => (
    <View style={styles.emptyItem}>
      <Text style={styles.emptyItemText}>No scheduled tasks found</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Agenda
        items={items}
        onDayPress={onDayPress}
        selected={selectedDay}
        markedDates={{
          [selectedDay]: { selected: true, marked: true, dots: [work, massage, workout] },
        }}
        renderItem={renderItem}
        renderEmptyData={renderEmptyData}
        theme={{
          backgroundColor: "#1b252d",
          calendarBackground: '#1b252d',
          textSectionTitleColor: '#b6c1cd',
          selectedDayBackgroundColor: '#00adf5',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#00adf5',
          dayTextColor: '#2d4150',
          dotColor: '#00adf5',
          selectedDotColor: '#ffffff',
          arrowColor: 'orange',
          monthTextColor: '#FFFFFF',
          textDayFontFamily: 'monospace',
          textMonthFontFamily: 'monospace',
          textDayHeaderFontFamily: 'monospace',
          textDayFontWeight: '300',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '300',
          textDayFontSize: 16,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 16,
        }}
        style={{}}
      />
      
      {/* Modal for adding new event */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Event</Text>
            <TextInput
              style={styles.input}
              placeholder="Event name"
              value={newEventName}
              onChangeText={setNewEventName}
            />
            
            {/* From Time Picker */}
            <TouchableOpacity onPress={() => setShowFromPicker(true)} style={styles.timeButton}>
              <Text style={styles.timeButtonText}>
                From: {fromTime.toLocaleTimeString()}
              </Text>
            </TouchableOpacity>
            {showFromPicker && (
              <DateTimePicker
                value={fromTime}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={(event, selectedTime) => {
                  setShowFromPicker(false);
                  if (selectedTime) setFromTime(selectedTime);
                }}
              />
            )}

            {/* To Time Picker */}
            <TouchableOpacity onPress={() => setShowToPicker(true)} style={styles.timeButton}>
              <Text style={styles.timeButtonText}>
                To: {toTime.toLocaleTimeString()}
              </Text>
            </TouchableOpacity>
            {showToPicker && (
              <DateTimePicker
                value={toTime}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={(event, selectedTime) => {
                  setShowToPicker(false);
                  if (selectedTime) setToTime(selectedTime);
                }}
              />
            )}

            <Button title="Add Event" onPress={addNewEvent} />
            <Button title="Cancel" onPress={() => setIsModalVisible(false)} color="red" />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1b252d",
  },
  item: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  itemText: {
    color: '#1b252d',
  },
  emptyItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30,
  },
  emptyItemText: {
    color: '#b6c1cd',
    fontSize: 16,
  },
  navButton: {
    marginRight: 15,
    padding: 5,
  },
  navButtonText: {
    color: '#00adf5',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 5,
  },
  timeButton: {
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    marginVertical: 5,
  },
  timeButtonText: {
    fontSize: 16,
    color: '#333',
  },
});

export default Schedule;
