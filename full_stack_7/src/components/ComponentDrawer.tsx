import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { useNavigation } from "@react-navigation/native";

export function ComponentDrawer(props) {
  const navigation = useNavigation();
  return (
    <DrawerContentScrollView>
      <DrawerItem
        label={'Settings'}
        onPress={() => {
          // @ts-ignore
          navigation.navigate('ScreenSettings');
        }}
      />
      <DrawerItem
        label={'ScreenHome'}
        onPress={() => {
          // @ts-ignore
          navigation.navigate('ScreenHome');
        }}
      />
    </DrawerContentScrollView>
  )
}
