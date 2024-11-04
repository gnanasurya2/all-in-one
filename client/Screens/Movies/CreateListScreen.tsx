import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import Text from '../../components/Text';
import { FONT_FAMILY, FONT_SIZE, SURFACE_COLORS, TEXT_COLORS } from '../../constants/styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Toast from '../../components/Toast';
import { useAddNewList } from '../../api/movies/addNewList';
import { useMoviesInLists } from '../../api/movies/getMoviesInList';
import { FlatList } from 'react-native-gesture-handler';
import Separator from '../../components/Separator';
import ListMovie from '../../components/ListMovie';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { MovieDrawerParamList } from '../../navigation/MovieNavigator';
import { ContentType } from '../../constants/enums';

const CreateListScreen = ({
  navigation,
  route: {
    params: { listId, title = '', description = '' },
  },
}: DrawerScreenProps<MovieDrawerParamList, 'CreateList'>) => {
  const [toastValue, setToastValue] = useState(false);
  const [listTitle, setListTitle] = useState(title);
  const [listDescription, setListDescription] = useState(description);
  const [toastText, setToastText] = useState('');

  const { data, fetchNextPage } = useMoviesInLists({ listId });
  const mutation = useAddNewList();

  const movies = useMemo(() => data?.pages.flatMap((value) => value.response), [data]);

  useEffect(() => {
    setListTitle(title);
    setListDescription(description);
  }, [listId, title, description]);

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
    return true;
  };

  const resetForm = () => {
    setListTitle('');
    setListDescription('');
  };

  const createListHandler = async () => {
    if (validateForm()) {
      try {
        await mutation.mutateAsync({ title: listTitle, description: listDescription });
        resetForm();
        navigation.goBack();
      } catch (err) {
        setToastText('Creating new list failed. Please try again.');
        setToastValue(true);
      }
    }
  };

  return (
    <View style={styles.wrapper}>
      {listId ? (
        <View style={styles.header}>
          <View style={styles.headerTextWrapper}>
            <Text style={styles.headerText}>View List</Text>
          </View>
        </View>
      ) : (
        <View style={styles.header}>
          <Pressable
            onPress={() => {
              resetForm();
              navigation.goBack();
            }}
            hitSlop={25}
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
      )}
      <TextInput
        style={styles.textInput}
        placeholder="List Name"
        placeholderTextColor={TEXT_COLORS.BODY_L1}
        cursorColor={TEXT_COLORS.INFORMATION}
        value={listTitle}
        onChangeText={setListTitle}
        autoCorrect={false}
        readOnly={Boolean(listId)}
      />
      <TextInput
        style={styles.textInput}
        placeholder="List Description"
        placeholderTextColor={TEXT_COLORS.BODY_L1}
        cursorColor={TEXT_COLORS.INFORMATION}
        autoCorrect={false}
        value={listDescription}
        onChangeText={setListDescription}
        readOnly={Boolean(listId)}
      />
      {listId ? (
        <FlatList
          data={movies}
          renderItem={({ item }) => (
            <ListMovie
              {...item}
              onPressHandler={() => {
                navigation.navigate('Movie', { id: item.imdb_id, type: ContentType.Movies });
              }}
            />
          )}
          ItemSeparatorComponent={() => <Separator style={{ marginHorizontal: 0 }} />}
          keyExtractor={(item) => item.id.toString()}
          onEndReachedThreshold={0.5}
          onEndReached={() => {
            fetchNextPage();
          }}
        />
      ) : (
        <Pressable onPress={createListHandler} style={styles.createButton}>
          <Text style={styles.createButtonText}>CREATE</Text>
        </Pressable>
      )}

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
  createButton: {
    backgroundColor: SURFACE_COLORS.SUCCESS,
    bottom: 0,
    position: 'absolute',
    width: '100%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButtonText: {
    fontSize: FONT_SIZE.H2,
    fontFamily: FONT_FAMILY.HELVETICA_ROUNDED,
  },
});

export default CreateListScreen;
