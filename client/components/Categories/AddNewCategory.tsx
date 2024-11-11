import {FONT_FAMILY, SURFACE_COLORS} from '../../constants/styles';
import React, {useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import Category from './Category';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {useAddCategory} from '../../api/expenseTracker/createNewCategory';

const AddNewCategory = () => {
  const [isActive, setIsActive] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const {mutateAsync, isPending} = useAddCategory();
  const handleNewAddition = async () => {
    await mutateAsync(newCategory);
    setNewCategory('');
    setIsActive(false);
  };
  if (isPending) {
    return (
      <View style={styles.wrapper}>
        <ActivityIndicator size={'small'} color={'white'} />
      </View>
    );
  }

  return isActive ? (
    <View style={styles.wrapper}>
      <TextInput
        style={styles.input}
        value={newCategory}
        onChangeText={setNewCategory}
      />
      <Pressable style={styles.save} onPress={handleNewAddition}>
        <MaterialIcon name="check" size={24} color={'white'} />
      </Pressable>
      <Pressable
        style={[styles.save, {backgroundColor: SURFACE_COLORS.ERROR}]}
        onPress={() => {
          setIsActive(false);
        }}>
        <MaterialIcon name="close" size={24} color={'white'} />
      </Pressable>
    </View>
  ) : (
    <Category
      value="+ Add New"
      onPress={() => {
        setNewCategory('');
        setIsActive(true);
      }}
    />
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    backgroundColor: SURFACE_COLORS.HIGHLIGHT,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginVertical: 8,
    borderRadius: 6,
  },
  input: {
    fontSize: 20,
    minWidth: 80,
    fontFamily: FONT_FAMILY.GT_WALSHEIM_PRO_REGULAR,
    color: 'white',
  },
  save: {
    backgroundColor: SURFACE_COLORS.SUCCESS,
    borderRadius: 8,
    padding: 4,
  },
});
export default AddNewCategory;
