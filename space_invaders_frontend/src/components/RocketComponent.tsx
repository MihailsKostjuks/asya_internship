
import { StyleSheet, Text } from 'react-native';
import {useEffect, useState} from "react";

interface Props {
    x: number,
    y: number,
    is_friendly: boolean,
}

const RocketComponent = (props: Props) => {

    const [position, setPosition] = useState({
        x: props.x * 34,
        y: props.y * 34
    })

    const [isFriendly, setFriendly] = useState(props.is_friendly);

    useEffect(() => {
        setPosition({
            x: props.x * 34,
            y: props.y * 34
        });
        setFriendly(
            props.is_friendly
        )
    }, [props.y]);


    return (
        isFriendly ?
            <Text style={[styles.emoji, {top: position.y, left: position.x}]}>🔺</Text>
            :
            <Text style={[styles.emoji, {top: position.y, left: position.x}]}>🔻</Text>
    )
}

const styles = StyleSheet.create({
    emoji: {
        position: 'absolute',
        fontSize: 26,
    },
});

export default RocketComponent;
