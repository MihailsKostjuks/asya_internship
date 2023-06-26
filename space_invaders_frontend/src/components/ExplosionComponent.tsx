
import { StyleSheet, Text } from 'react-native';
import {useState} from "react";

interface Position {
    x: number,
    y: number
}

const ExplosionComponent = (props: Position) => {

    const [position, setPosition] = useState({
        x: props.x * 34,
        y: props.y * 34
    })

    return (
        <Text style={[styles.emoji, {top: position.y, left: position.x}]}>💥</Text>
    );
}

const styles = StyleSheet.create({
    emoji: {
        position: 'absolute',
        fontSize: 26,
    },
});

export default ExplosionComponent;
