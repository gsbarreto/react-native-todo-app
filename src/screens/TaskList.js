import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import commonStyles from '../commonStyles';
import todayImage from '../../assets/imgs/today.jpg';
import Icon from 'react-native-vector-icons/FontAwesome';

import moment from 'moment';
import 'moment/locale/pt-br';

import Task from '../components/Task';
import AddTask from './AddTask';

export default function TaskList() {
  const today = moment().locale('pt-br').format('ddd, D [de] MMMM ');
  const [showDoneTasks, setShowDoneTasks] = useState(true);
  const [showAddTask, setShowAddTask] = useState(false);
  const [visibleTasks, setVisibleTasks] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    try {
      const initialLoad = async () => {
        const stateString = await AsyncStorage.getItem('tasksState');
        const state = JSON.parse(stateString);
        console.log('State', state);
        if (state) {
          setShowDoneTasks(state.showDoneTasks);
          setShowAddTask(state.showAddTask);
          setVisibleTasks(state.visibleTasks);
          setTasks(state.tasks);
        }

        filterTasks();
      };

      initialLoad();
      return () => {};
    } catch (err) {
      Alert.alert('Erro na captura dos dados armazenados!', err.message);
    }
  }, []);

  useEffect(() => {
    filterTasks();
  }, [showDoneTasks, showAddTask, tasks]);

  const toggleFilter = () => {
    setShowDoneTasks(!showDoneTasks, filterTasks());
  };

  const toggleTask = (taskId) => {
    const tasksClone = [...tasks];
    tasksClone.forEach((task) => {
      if (task.id === taskId) {
        task.doneAt = task.doneAt ? null : new Date();
      }
    });
    setTasks(tasksClone, filterTasks());
  };

  const filterTasks = async () => {
    let visibleTasksClone = null;
    if (showDoneTasks) {
      visibleTasksClone = [...tasks];
    } else {
      const pending = (tasks) => tasks.doneAt === null;
      visibleTasksClone = visibleTasks.filter(pending);
    }

    await setVisibleTasks(visibleTasksClone);
    await AsyncStorage.setItem(
      'tasksState',
      JSON.stringify({
        showDoneTasks,
        showAddTask,
        visibleTasks,
        tasks,
      }),
    );
  };

  const addTask = (newTask) => {
    if (!newTask.desc || !newTask.desc.trim()) {
      Alert.alert('Dados inválidos', 'Descriçao não formatada!');
      return;
    }

    const tasksClone = [...tasks];
    tasksClone.push({
      id: Math.random(),
      desc: newTask.desc,
      estimateAt: newTask.date,
      doneAt: null,
    });

    setTasks(tasksClone, setShowAddTask(false, filterTasks()));
  };

  const deleteTask = (id) => {
    const taskClone = tasks.filter((task) => task.id !== id);
    setTasks(taskClone, filterTasks());
  };

  return (
    <View style={styles.container}>
      <AddTask
        isVisible={showAddTask}
        onCancel={() => setShowAddTask(false)}
        onSave={addTask}
      />
      <ImageBackground style={styles.background} source={todayImage}>
        <View style={styles.iconBar}>
          <TouchableOpacity onPress={() => toggleFilter()}>
            <Icon
              name={showDoneTasks ? 'eye' : 'eye-slash'}
              size={20}
              color={commonStyles.colors.secondary}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.titleBar}>
          <Text style={styles.title}>Hoje</Text>
          <Text style={styles.subtitle}>{today}</Text>
        </View>
      </ImageBackground>
      <View style={styles.taskContainer}>
        <FlatList
          data={visibleTasks}
          keyExtractor={(item) => `${item.id}`}
          renderItem={({item}) => (
            <Task onToggleTask={toggleTask} {...item} onDelete={deleteTask} />
          )}
        />
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowAddTask(true)}
        activeOpacity={0.7}>
        <Icon name="plus" size={20} color={commonStyles.colors.secondary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 3,
  },
  taskContainer: {
    flex: 7,
  },
  titleBar: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  title: {
    fontFamily: commonStyles.fontFamily,
    fontSize: 50,
    color: commonStyles.colors.secondary,
    marginLeft: 20,
    marginBottom: 20,
  },
  subtitle: {
    fontFamily: commonStyles.fontFamily,
    fontSize: 20,
    color: commonStyles.colors.secondary,
    marginLeft: 20,
    marginBottom: 30,
    textTransform: 'capitalize',
  },
  iconBar: {
    flexDirection: 'row',
    marginHorizontal: 20,
    justifyContent: 'flex-end',
    marginTop: Platform.OS === 'ios' ? 40 : 10,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: commonStyles.colors.today,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
