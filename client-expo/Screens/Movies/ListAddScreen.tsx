import React, { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import Text from '../../components/Text';
import { FONT_FAMILY, FONT_SIZE, SURFACE_COLORS, TEXT_COLORS } from '../../constants/styles';
import { MaterialIcons } from '@expo/vector-icons';
import Toast from '../../components/Toast';
import { useAddNewList } from '../../api/movies/addNewList';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { MovieNavigatorDrawerParamList } from '../../Navigation/MovieApp/MovieSideBarNavigation';

const ListAddScreen = ({
  navigation,
  route: {
    params: { listId },
  },
}: DrawerScreenProps<MovieNavigatorDrawerParamList, 'EditList'>) => {
  const [toastValue, setToastValue] = useState(false);
  const [listTitle, setListTitle] = useState('');
  const [listDescription, setListDescription] = useState('');
  const [toastText, setToastText] = useState('');

  const mutation = useAddNewList();

  const validateForm = () => {
    if (!listTitle) {
      setToastText('List should have a name');
      setToastValue(true);
      return false;
    }

    if (listTitle.length > 50) {
      setToastText('List name cannot be more than 50 characters');
      setToastValue(true);
      return false;
    }

    if (listDescription.length > 200) {
      setToastText('List description cannot be more than 200 characters');
      setToastValue(true);
      return false;
    }
  };

  const createListHandler = async () => {
    if (validateForm()) {
      try {
        await mutation.mutateAsync({ title: listTitle, description: listDescription });
        navigation.goBack();
      } catch (err) {
        setToastText('Creating new list failed. Please try again.');
        setToastValue(true);
      }
    }
  };
  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Pressable
          onPress={() => {
            navigation.goBack();
          }}
        >
          <MaterialIcons name="close" size={24} color="white" />
        </Pressable>
        <View style={styles.headerTextWrapper}>
          <Text style={styles.headerText}>New List</Text>
        </View>
        <Pressable onPress={createListHandler}>
          <MaterialIcons name="check" size={24} color="white" />
        </Pressable>
      </View>
      <TextInput
        style={styles.textInput}
        placeholder="List Name"
        placeholderTextColor={TEXT_COLORS.BODY_L1}
        cursorColor={TEXT_COLORS.INFORMATION}
        value={listTitle}
        onChangeText={setListTitle}
        autoCorrect={false}
      />
      <TextInput
        style={styles.textInput}
        placeholder="List Description"
        placeholderTextColor={TEXT_COLORS.BODY_L1}
        cursorColor={TEXT_COLORS.INFORMATION}
        autoCorrect={false}
        value={listDescription}
        onChangeText={setListDescription}
      />
      <Pressable style={styles.addEntriesWrapper}>
        <Text>Add entries...</Text>
      </Pressable>
      <Toast toastValue={toastValue} setToastValue={setToastValue} children={toastText} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: SURFACE_COLORS.PAGE,
  },
  header: {
    height: 60,
    backgroundColor: SURFACE_COLORS.TERTIARY,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  headerTextWrapper: {
    flex: 1,
    marginLeft: 16,
  },
  headerText: {
    fontFamily: FONT_FAMILY.GT_WALSHEIM_PRO_BOLD,
    fontSize: FONT_SIZE.H3,
  },
  textInput: {
    height: 40,
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: TEXT_COLORS.DISABLED,
    color: TEXT_COLORS.HEADING,
  },
  addEntriesWrapper: {
    flex: 1,
    paddingHorizontal: 8,
  },
});

export default ListAddScreen;
