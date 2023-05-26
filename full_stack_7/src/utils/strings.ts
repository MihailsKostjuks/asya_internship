import LocalizedStrings from "react-native-localization";
import { createContext } from "react";
export const strings = new LocalizedStrings({
  'en': {
    button_home_add_habit: 'Add habit',
    home_title: 'Home',
  },
  'lv': {
    button_home_add_habit: 'Pievienot paradumu',
    home_title: 'Sakums',
  },
});

export const ContextStrings = createContext({
  currentLanguage: strings.getLanguage(),
  setCurrentLanguage: (string) => {}
});

