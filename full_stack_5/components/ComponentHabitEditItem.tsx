import React from "react";
import {View, Text, Button, TextInput, Keyboard, Pressable, StyleSheet} from "react-native";
import {Habit} from "../models/Habit";

interface Props {
    habit: Habit,
    onChange?: (
        habit: Habit,
        newTitle: string
    ) => void,
    onCancel?: () => void,
}

interface State {
    currentHabit: string
}

export class ComponentHabitEditItem extends React.Component<Props, State>{
    constructor(props: Props) {
        super(props);

        this.state = {
            currentHabit: props.habit.title,
        } as State;
    }
    onCancel = () => {
        if (this.props.onCancel) {
            this.props.onCancel();
        }
    }
    onChangeTitle = () => {
        if (this.props.onChange) {
            this.props.onChange(
                this.props.habit,
                this.state.currentHabit
            );
        }
    }

    render= () => {
        return (
            <View>
                <View style={styles.itemContainer}>
                    <View style={styles.entryContainer}>
                        <TextInput
                            maxLength={20}
                            style={styles.entry}
                            value={this.state.currentHabit}
                            onChangeText={ // newValue: what is being entered
                                (newValue) => this.setState({  // updates the state
                                    currentHabit: newValue  // assigning newValue(textarea) to currentHabit(state)
                                })
                            }
                        />
                    </View>
                    <View style={styles.buttonContainer}>
                        <Pressable
                            style={styles.button}
                            onPress={this.onCancel}
                        >
                            <Text style={styles.buttonText}>Cancel</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.button, {backgroundColor: 'green'}]}
                            onPress={this.onChangeTitle}
                        >
                            <Text style={styles.buttonText}>Save</Text>
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
        alignItems: 'center'
    },
    entryContainer: {
        flex: 1,
    },
    entry: {
        fontSize: 16,
        borderWidth: 1,
        padding: 3,
        color: 'white',
        borderColor: 'white',
        marginRight: 10
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
        textAlign: 'center'
    },
    button: {
        backgroundColor: '#ff1493',
        borderRadius: 50,
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginLeft: 10,
        width: 80,
    }
})
