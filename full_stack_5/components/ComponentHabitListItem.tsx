import React from "react";
import {View, Text, Button, TextInput, Keyboard, Pressable, StyleSheet} from "react-native";
import {Habit} from "../models/Habit";

interface Props {
    habit: Habit,
    onDelete?: (habit: Habit) => void,
    showEdit?: (habit: Habit) => void,
}

interface State {
    editComponentHidden: boolean
}

export class ComponentHabitListItem extends React.Component<Props, State>{
    constructor(props: Props) {
        super(props);

        this.state = {
            editComponentHidden: true
        } as State;
    }
    onDelete = () => {
        if (this.props.onDelete) {
            this.props.onDelete(this.props.habit);
        }
    }
    showEditComponent = () => {
        if (this.props.showEdit){
            this.props.showEdit(this.props.habit);
        }
    }
    render= () => {
        return (
            <View>
                <View style={styles.itemContainer}>
                    <View style={styles.itemTitleCont}>
                        <Text style={styles.itemTitle}>{this.props.habit.title}</Text>
                    </View>
                    <View style={styles.buttonContainer}>
                        <Pressable
                            style={[styles.button, {backgroundColor: '#ff1493'}]}
                            onPress={this.onDelete}
                        >
                            <Text style={styles.buttonText}>Delete</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.button, {backgroundColor: '#fa9820'}]}
                            onPress={this.showEditComponent}
                        >
                            <Text style={styles.buttonText}>Edit</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        margin: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemTitleCont: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 16,
        color: 'white',
        marginLeft: 3,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    button: {
        backgroundColor: 'pink',
        borderRadius: 50,
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginLeft: 10,
        width: 80,
    }
})
