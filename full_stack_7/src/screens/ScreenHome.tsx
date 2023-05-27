import React, { useState } from "react";
import { View } from "react-native";
import { Button, Icon, ListItem } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import { strings } from "../utils/strings";
import { Habit } from "../models/Habit";
import { ComponentHabitListItem } from "../components/ComponentHabitListItem";


export function ScreenHome() {
  const navigation = useNavigation();
  const [habits, setHabits] = useState([] as Habit[]);

  function saveHabits(habitLabel: string, date: string) {
    const newHabit: Habit = {
      label: habitLabel,
      date: date,
    };
    setHabits([...habits, newHabit]);
    console.log(habits);
  }

  function deleteHabit(index) {
    const newHabits = [...habits];
    newHabits.splice(index, 1);
    setHabits(newHabits);
  }

  return (
    <View style={{ flex: 1}}>
      <View style={{ flex: 1}}>
        {habits.map((item, i)=> (
          <ListItem.Swipeable
            key={`habit_${i}`}
            rightContent={
              <Button
                title="Delete"
                onPress={() => deleteHabit(i)}
                icon={{ name: 'delete', color: 'white' }}
                buttonStyle={{ minHeight: '100%', backgroundColor: 'red' }}
              />
            }
          >
            <Icon name="My Icon" />
            <ListItem.Content>
              <ListItem.Title>{item.label + ' ' + item.date}</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem.Swipeable>
        ))}
      </View>
      <Button
        onPress={()=> {
          // @ts-ignore
          navigation.navigate('ScreenHabitAdd', {
            onSave: saveHabits
          })
        }}
      >
        <Icon name={'home'} color={'white'}/>
        {strings.button_home_add_habit}
      </Button>
    </View>
  );
}
