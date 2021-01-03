import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Icon from 'react-native-vector-icons/FontAwesome';

import commonStyles from '../commonStyles';

import moment from 'moment';
import 'moment/locale/pt-br';

export default function Task({
  id,
  desc,
  estimateAt,
  doneAt,
  onToggleTask,
  onDelete,
}) {
  const doneOrNoteStyle =
    doneAt != null ? {textDecorationLine: 'line-through'} : {};

  const date = doneAt ? doneAt : estimateAt;
  const formatedDate = moment(date).locale('pt-br').format('ddd, D [de] MMMM');

  const getRightContent = () => {
    return (
      <TouchableOpacity
        style={styles.right}
        onPress={() => onDelete && onDelete(id)}>
        <Icon name="trash" size={30} color="#FFF" />
      </TouchableOpacity>
    );
  };

  const getLeftContent = () => {
    return (
      <View style={styles.left}>
        <Icon style={styles.excludeIcon} name="trash" size={30} color="#FFF" />
        <Text style={styles.excludeText}>Excluir</Text>
      </View>
    );
  };

  return (
    <Swipeable
      renderRightActions={getRightContent}
      renderLeftActions={getLeftContent}
      onSwipeableLeftOpen={() => onDelete && onDelete(id)}>
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={() => onToggleTask(id)}>
          <View style={styles.checkContainer}>{getCheckView(doneAt)}</View>
        </TouchableWithoutFeedback>
        <View>
          <Text style={[styles.desc, doneOrNoteStyle]}>{desc}</Text>
          <Text style={[styles.date, doneOrNoteStyle]}>{formatedDate}</Text>
        </View>
      </View>
    </Swipeable>
  );
}

const getCheckView = (doneAt) => {
  if (doneAt !== null) {
    return (
      <View style={styles.done}>
        <Icon name="check" size={20} color="#FFF"></Icon>
      </View>
    );
  } else {
    return <View style={styles.pending}></View>;
  }
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderColor: '#AAA',
    borderBottomWidth: 1,
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#FFF',
  },
  checkContainer: {
    width: '20%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pending: {
    height: 25,
    width: 25,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#555',
  },
  done: {
    height: 25,
    width: 25,
    borderRadius: 13,
    backgroundColor: '#4D7031',
    alignItems: 'center',
    justifyContent: 'center',
  },
  desc: {
    fontFamily: commonStyles.fontFamily,
    color: commonStyles.colors.mainText,
    fontSize: 15,
    textTransform: 'capitalize',
  },
  date: {
    fontFamily: commonStyles.fontFamily,
    color: commonStyles.colors.subText,
    fontSize: 12,
    textTransform: 'capitalize',
  },
  right: {
    backgroundColor: 'red',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
  },
  left: {
    flex: 1,
    backgroundColor: 'red',
    flexDirection: 'row',
    alignItems: 'center',
  },
  excludeIcon: {
    marginLeft: 10,
  },
  excludeText: {
    fontFamily: commonStyles.fontFamily,
    color: '#FFF',
    fontSize: 20,
    margin: 10,
  },
});
