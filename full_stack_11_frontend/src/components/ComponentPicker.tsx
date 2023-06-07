import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { PickerItemData } from "../models/PickerItemData";

interface Props {
  data: PickerItemData[],
  label: string,
  onChoose: (value) => void;
}

const ComponentPicker = (props: Props) => {
  const [selectedValue, setSelectedValue] = useState('');
  const [selectedLabel, setSelectedLabel] = useState(props.label);

  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleSelectItem = (itemValue, itemLabel) => {
    try {
      setSelectedValue(itemValue);
      setSelectedLabel(itemLabel);
      setShowDropdown(false);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    props.onChoose(selectedValue);
  }, [selectedValue]);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.dropdownButton} onPress={toggleDropdown}>
        <Text style={styles.dropdownButtonText}>{selectedLabel}</Text>
      </TouchableOpacity>
      {showDropdown && (
        <View style={styles.dropdownMenu}>
          {props.data.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.dropdownMenuItem}
              onPress={() => handleSelectItem(item.value, item.label)}
            >
              <Text style={styles.dropdownMenuItemText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingBottom: 120,
    alignItems: 'center',
  },
  dropdownButton: {
    width: 150,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e3e3e3',
  },
  dropdownButtonText: {
    fontSize: 16,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 70,
    width: 150,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  dropdownMenuItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  dropdownMenuItemText: {
    fontSize: 16,
  },
});

export default ComponentPicker;
