import {View, Text, StyleSheet} from "react-native";
import {ControllerGame} from "../controllers/ControllerGame";


const LivesComponent = () => {

    return (
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.text}>Lives: </Text>
            {Array.from({ length: ControllerGame.instance.lives }).map((_, index) => (
                <Text style={styles.text} key={index}>❤️</Text>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    text: {
        fontSize: 25,
        color: 'white',
    }
});

export default LivesComponent;
