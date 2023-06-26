import {Button, View} from "react-native";
import {ControllerGame} from "../controllers/ControllerGame";


const ControllerComponent = () => {


    return (
        <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
            <Button title={'Left'} onPress={() => {ControllerGame.instance.controllerPlayer.left()}}></Button>
            <Button title={'Stop'} onPress={() => {ControllerGame.instance.controllerPlayer.stop()}}></Button>
            <Button title={'Right'} onPress={() => {ControllerGame.instance.controllerPlayer.right()}}></Button>
            <Button title={'FIRE'} onPress={() => {ControllerGame.instance.controllerPlayer.fire_rocket()}}></Button>
        </View>
    );
}

export default ControllerComponent;
