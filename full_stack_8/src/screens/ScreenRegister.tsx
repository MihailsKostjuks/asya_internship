import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { strings } from "../utils/strings";
import { Button, Icon, Input } from "@rneui/themed";
import axios from 'axios';
import md5 from 'crypto-js/md5';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../models/User";
import { UserLogin } from "../models/UserLogin";
import { useNavigation } from "@react-navigation/native";
import { UserRegister } from "../models/UserRegister";

const API_TOKEN = 'keyOL8pqiCYD3mNgJ';


export function ScreenRegister() {
  const [currentLanguage, setCurrentLanguage] = useState(strings.getLanguage());
  const navigation = useNavigation();

  const [isLoading, setLoading] = useState(false);
  const [user, setUser] = useState({
    username: '',
    password: '',
    // photoUrl: '',
    isLogged: false,
  }as User)
  const [userEntry, setUserEntry] = useState({
    username: '',
    password: '',
    rePassword: ''
  }as UserRegister)
  useEffect(() => {
    async function load() {
      try {
        let userJSON = await AsyncStorage.getItem('user');  // triggers anytime
        if (userJSON) {
          let userRestored = JSON.parse(userJSON);
          setUser(userRestored);
        }
      } catch (e) {
        console.error(e)
      }
    }
    load();
  }, []);

  const onRegister = async () => {
    if (!isLoading) {
      try {
        setLoading(true);
        if (userEntry.password == userEntry.rePassword) {
          await axios.post(
            "https://api.airtable.com/v0/appqbDfQP8h17Ai8C/users",
            {
              "records": [
                {
                  "fields": {
                    "username": userEntry.username,
                    "password": md5(userEntry.password).toString()
                  }
                }
              ]
            },
            {
              headers: {
                Authorization: 'Bearer ' + API_TOKEN,
                'Content-Type': 'application/json'
              }
            },
          )
          const userNew: User = {
            ...user,
            username: 'check1',
            password: 'check1',
            isLogged: true,
          }
          setUser(userNew);
          await AsyncStorage.setItem('user', JSON.stringify(userNew));
        }
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }
  }

  const onNavigateLogin = async () => {
    // @ts-ignore
    navigation.navigate('ScreenLogin');
  }

  return (
    <View style={{flex: 1}}>
      <Text>Register</Text>
      <View style={{flex: 1, marginVertical: 20}}>
        <View>
          <Input
            containerStyle={{width: 200}}
            placeholder={'enter username'}
            value={userEntry.username}
            onChangeText={(text) => {
              setUserEntry({
                ...userEntry,
                username: text
              })
            }}
          >
          </Input>
          <Input
            containerStyle={{width: 200}}
            placeholder={'enter password'}
            value={userEntry.password}
            secureTextEntry={true}
            onChangeText={(text) => {
              setUserEntry({
                ...userEntry,
                password: text
              })
            }}
          >
          </Input>
          <Input
            containerStyle={{width: 200}}
            placeholder={'reenter password'}
            value={userEntry.rePassword}
            secureTextEntry={true}
            onChangeText={(text) => {
              setUserEntry({
                ...userEntry,
                rePassword: text
              })
            }}
          >
          </Input>
          <Button onPress={onRegister}>
            {isLoading && <ActivityIndicator size={'small'} color={'white'}/>}
            Register
          </Button>
          <Button onPress={onNavigateLogin}>
            Already have account? login here
          </Button>
        </View>
      </View>
    </View>
  );
}
