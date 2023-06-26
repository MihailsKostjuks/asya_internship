import {StyleSheet, Text} from "react-native";
import {ControllerGame} from "../controllers/ControllerGame";

const ScoreComponent = () => {

    return (
        <Text style={styles.text}>Score: {ControllerGame.instance.score}</Text>
    );
}

const styles = StyleSheet.create({
    text: {
        fontSize: 25,
        color: 'white',
    }
});

export default ScoreComponent;
