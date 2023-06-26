import React from 'react';
import {StyleSheet, View} from 'react-native';
import AlienComponent from "./AlienComponent";
import {ControllerGame} from "../controllers/ControllerGame";
import {EnumElementType} from "../enums/EnumElementType";
import PlayerComponent from "./PlayerComponent";
import WallComponent from "./WallComponent";
import RocketComponent from "./RocketComponent";
import ExplosionComponent from "./ExplosionComponent";
import {Rocket} from "../models/Rocket";

const SceneComponent = () => {

    return (
        <View style={styles.scene}>
            {
                ControllerGame.instance.elements.map((i, key) => {
                    let model = i.model
                    if (model.type === EnumElementType.alien) {
                        return <AlienComponent x={model.position.x} y={model.position.y} key={key}/>
                    } else if (model.type === EnumElementType.player) {
                        return <PlayerComponent x={model.position.x} y={model.position.y} key={key}/>
                    } else if (model.type === EnumElementType.wall) {
                        return <WallComponent x={model.position.x} y={model.position.y} key={key}/>
                    } else if (model.type === EnumElementType.rocket) {
                        return <RocketComponent x={model.position.x} y={model.position.y} is_friendly={(model as Rocket).is_friendly} key={key}/>
                    } else if (model.type === EnumElementType.explosion) {
                        return <ExplosionComponent x={model.position.x} y={model.position.y} key={key}/>
                    }
                })
            }
        </View>
    );
}

const styles = StyleSheet.create({
    scene: { // flex 1: height is not adjustable
        width: 340,
        height: 685,
        borderRadius: 1,
        borderWidth: 1,
        borderColor: 'white',
        alignSelf: 'center',
    },
});

export default SceneComponent;
