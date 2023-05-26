import { View } from "react-native";
import { ListItem, Button, Icon, Text } from '@rneui/themed';
import { Habit } from "../models/Habit";
import React from "react";

interface Props {
  habit: Habit
}

export function ComponentHabitListItem(props: Props) {
  return (
    <ListItem.Swipeable
      leftContent={(reset) => (
        <Button
          title="Info"
          onPress={() => reset()}
          icon={{ name: 'info', color: 'white' }}
          buttonStyle={{ minHeight: '100%' }}
        />
      )}
      rightContent={(reset) => (
        <Button
          title="Delete"
          onPress={() => reset()}
          icon={{ name: 'delete', color: 'white' }}
          buttonStyle={{ minHeight: '100%', backgroundColor: 'red' }}
        />
      )}
    >
      <ListItem.Content>
        <ListItem.Title>{props.habit.label}</ListItem.Title>
      </ListItem.Content>
      <ListItem.Chevron />
    </ListItem.Swipeable>
  )
}
