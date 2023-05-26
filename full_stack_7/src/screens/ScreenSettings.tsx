import React, { useState } from "react";
import { View, Text } from 'react-native';
import { strings } from "../utils/strings";
import { Button, Icon } from "@rneui/themed";

export function ScreenSettings() {
  const [currentLanguage, setCurrentLanguage] = useState(strings.getLanguage());
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>ScreenSettings</Text>
      <Button
        onPress={()=> {
          strings.setLanguage('lv');
          setCurrentLanguage(strings.getLanguage());
        }}
      >
        <Icon name={'home'} color={'white'}/>
        Switch to lv
      </Button>
      <Button
        onPress={()=> {
          strings.setLanguage('en');
          setCurrentLanguage(strings.getLanguage());
        }}
      >
        <Icon name={'home'} color={'white'}/>
        Switch to en
      </Button>
    </View>
  );
}
