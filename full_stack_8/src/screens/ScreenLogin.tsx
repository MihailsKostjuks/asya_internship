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

const API_TOKEN = 'keyOL8pqiCYD3mNgJ';


export function ScreenLogin() {
  const [currentLanguage, setCurrentLanguage] = useState(strings.getLanguage());
  const navigation = useNavigation();
  const [isLoading, setLoading] = useState(false);
  const [user, setUser] = useState({
    username: '',
    password: '',
    // photoUrl: '',
    isLogged: false,
  }as User)
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

  const onLogout = async () => {
    setUser({
      ...user,
      username: '',
      password: '',
      isLogged: false
    })
    await AsyncStorage.setItem('user',JSON.stringify(user));
  }

  const onLogin = async () => {
    if (!isLoading) {
      try {
        setLoading(true);
        let response = await axios.get(
          "https://api.airtable.com/v0/appqbDfQP8h17Ai8C/users",
          {
            headers: {
              Authorization: 'Bearer ' + API_TOKEN
            }
          }
        )
        let users: User[] = []
        let records = response.data.records;
        for (let record of records){
          let userRecord: User = record.fields;
          users.push(userRecord);
        }
        for (let userEach of users) {
          if (userEach.username === user.username) {
            if (userEach.password === md5(user.password).toString()) {
              console.log('Login successful');
              let userNew = {
                ...user,
                isLogged: true,
              }
              setUser(userNew);

              await AsyncStorage.setItem('user', JSON.stringify(userNew))
              break;
            }
          }
        }
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }
  }

  const onNavigateRegister = async () => {
    // @ts-ignore
    navigation.navigate('ScreenRegister');   // ????? fix it
  }
  return (
    <View style={{flex: 1}}>
      {user.isLogged ?
        <View>
          <Text> You are successfully logged in. Start adding habits now!</Text>
          <Button onPress={onLogout}>
            {isLoading && <ActivityIndicator size={'small'} color={'white'}/>}
            Log out
          </Button>
        </View>
        :
        <View style={{flex: 1}}>
          <Text>Login</Text>
          <View style={{flex: 1, marginVertical: 20}}>
            <View>
              <Input
                containerStyle={{width: 200}}
                placeholder={'username'}
                value={user.username}
                onChangeText={(text) => {
                  setUser({
                    ...user,
                    username: text
                  })
                }}
              >
              </Input>
              <Input
                containerStyle={{width: 200}}
                placeholder={'password'}
                value={user.password}
                secureTextEntry={true}
                onChangeText={(text) => {
                  setUser({
                    ...user,
                    password: text
                  })
                }}
              >
              </Input>
              <Button onPress={onLogin}>
                {isLoading && <ActivityIndicator size={'small'} color={'white'}/>}
                Login
              </Button>
              <Button onPress={onNavigateRegister}>
                Have no account? Register now
              </Button>
            </View>
          </View>
        </View>
      }
    </View>
  );
}
