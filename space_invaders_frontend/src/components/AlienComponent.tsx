
import { StyleSheet, Text } from 'react-native';
import {useEffect, useState} from "react";

interface Position {
    x: number,
    y: number
}

const AlienComponent = (props: Position) => {

    const [position, setPosition] = useState({
        x: props.x * 34,
        y: props.y * 34
    })

    useEffect(() => {
        setPosition({
            x: props.x * 34,
            y: props.y * 34
        })
    }, [props.x]);

    return (
        <Text style={[styles.emoji, {top: position.y, left: position.x}]}>👾</Text>
    );
}

const styles = StyleSheet.create({
    emoji: {
        position: 'absolute',
        fontSize: 26,
    },
});

export default AlienComponent;
