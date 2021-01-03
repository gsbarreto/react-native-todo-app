import React, {useState} from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import commonStyles from '../commonStyles';
import moment from 'moment';
import 'moment/locale/pt-br';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AddTask({isVisible, onCancel, onSave}) {
  const [desc, setDesc] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const getDateTimePicker = () => {
    let datePicker = (
      <DateTimePicker
        value={date}
        onChange={(_, newDate) => setDate(newDate, setShowDatePicker(false))}
        mode="date"
      />
    );
    const dateString = moment(date).format('ddd, D [de] MMMM [de] YYYY');
    if (Platform.OS === 'android') {
      datePicker = (
        <View>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <Text style={styles.date}>{dateString}</Text>
          </TouchableOpacity>
          {showDatePicker && datePicker}
        </View>
      );
    }
    return datePicker;
  };

  const save = () => {
    console.log('Date', date);
    const newTask = {
      desc,
      date,
    };

    onSave && onSave(newTask);
    setDesc('');
    setDate(new Date());
    setShowDatePicker(false);
  };

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      onRequestClose={onCancel}
      animated="slide">
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.background}></View>
      </TouchableWithoutFeedback>
      <View style={styles.container}>
        <Text style={styles.header}>Nova Tarefa</Text>
        <TextInput
          style={styles.input}
          placeholder="Informe a descrição..."
          value={desc}
          onChangeText={(e) => setDesc(e)}
        />
        {getDateTimePicker()}
        <View style={styles.buttons}>
          <TouchableOpacity onPress={onCancel}>
            <Text style={styles.button}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={save}>
            <Text style={styles.button}>Salvar</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.background}></View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  container: {
    backgroundColor: '#FFF',
  },
  header: {
    fontFamily: commonStyles.fontFamily,
    backgroundColor: commonStyles.colors.today,
    color: commonStyles.colors.secondary,
    padding: 15,
    fontSize: 18,
    textAlign: 'center',
  },
  input: {
    fontFamily: commonStyles.fontFamily,
    height: 40,
    margin: 15,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E3E3E3',
    borderRadius: 6,
  },
  buttons: {flexDirection: 'row', justifyContent: 'flex-end'},
  button: {
    margin: 20,
    marginRight: 30,
    color: commonStyles.colors.today,
  },
  date: {
    fontFamily: commonStyles.fontFamily,
    fontSize: 20,
    marginLeft: 15,
    textTransform: 'capitalize',
  },
});
