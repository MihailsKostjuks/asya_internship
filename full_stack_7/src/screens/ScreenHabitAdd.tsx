import React, { useState } from "react";
import { Button, View, Text, TextInput, Pressable } from "react-native";
import { useNavigation } from '@react-navigation/native';
import DatePicker from 'react-native-date-picker'


export function ScreenHabitAdd({route}) {
  const navigation = useNavigation();
  const {onSave} = route.params;

  const [isDatePickerOpen, setOpen] = useState(false);
  const [datetimeDatePicker, setDate] = useState(new Date());

  const [habitLabel, setHabitLabel] = useState('');

  function saveHabit() {
    onSave(habitLabel, isDatePickerOpen);
  }
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

      <View style={{flex: 1}}>
        <TextInput
          placeholder={'Enter your habit'}
          value={habitLabel}
          onChangeText={(text) => {
            setHabitLabel(text)
          }}
        >
        </TextInput>
        <Button title="Choose date" onPress={() => setOpen(true)} />
        <DatePicker
          modal
          open={isDatePickerOpen}
          date={datetimeDatePicker}
          onConfirm={(date) => {
            setOpen(false);
            setDate(date);
            console.warn(date);
          }}
          onCancel={() => {
            setOpen(false);
          }}
        />
        <Pressable
          onPress={saveHabit}
          style={{borderWidth: 1}}
        >
          <Text>Send</Text>
        </Pressable>
      </View>

      <View style={{flexDirection:'row'}}>
        <Button
          title={'Go back'}
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Button
          title={'Settings'}
          onPress={() => {
            // @ts-ignore
            navigation.navigate('ScreenSettings');
          }}
        />
      </View>
    </View>
  );
}
