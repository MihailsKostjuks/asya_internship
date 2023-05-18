import React from "react";
import {Button, Keyboard, Pressable, Text, TextInput, View, StyleSheet} from "react-native";
import {ComponentHabitListItem} from "../components/ComponentHabitListItem";
import {Habit} from "../models/Habit";
import {ComponentHabitEditItem} from "../components/ComponentHabitEditItem";

interface Props {  // for using this component externally
    title?: string
}

interface State {  // internal data (mostly mutable)
    habits: Habit[],
    currentHabit: string,
    editCompIsHidden: boolean,
    habitForEdit: Habit
}

export class ScreenHabits extends React.Component<Props, State>{
    constructor(props: Props) {  // while calling this component inside App.tsx, props are mandatory arguments
        super(props);

        this.state = {
            habits: [],
            currentHabit: '',
            editCompIsHidden: true,
            habitForEdit: {
                title: ''
            }
        } as State;
    }
    addHabit = () => {
        if (this.state.currentHabit.length !== 0) {
            let habits = this.state.habits;
            habits.push({
                title: this.state.currentHabit
            } as Habit);  // appends new habit
            this.setState({ // updates the state (internal data)
                habits: habits,
                currentHabit: '',  // refreshes the entry field
            });
        }
        Keyboard.dismiss(); // keyboard dismisses after input
    }
    deleteHabit = (habit: Habit) : void => {
        let habits = this.state.habits;
        let index = habits.indexOf(habit);
        habits.splice(index, 1);
        this.setState({
            habits: habits
        })
    }
    showEditComponent = (habit: Habit) => {
        this.setState({
            editCompIsHidden: false,
            habitForEdit: habit
        })
    };
    hideEditComponent = () => {
        this.setState({
            editCompIsHidden: true
        })
    };
    changeHabit = (habit: Habit, newTitle: string) => {
        let habits = this.state.habits;
        let index = habits.indexOf(habit);
        habits[index] = {
            ...habit,
            title: newTitle
        };
        this.setState({
            habits: habits,
            editCompIsHidden: true
        });
    }
    render= () => {
        return (
            <View style={styles.mainContainer}>
                {this.state.habits.map((habit, index) =>
                    <ComponentHabitListItem
                        onDelete={this.deleteHabit}
                        showEdit={this.showEditComponent}
                        habit={habit}
                        key={index}
                    />
                )}
                {!this.state.editCompIsHidden && <ComponentHabitEditItem
                    habit={this.state.habitForEdit}
                    onChange={this.changeHabit}
                    onCancel={this.hideEditComponent}
                />}
                <View style={{flex: 1,}}></View>
                <TextInput
                    style={styles.habitInput}
                    placeholder={'Enter new habit here'}
                    placeholderTextColor={'white'}
                    value={this.state.currentHabit}
                    onChangeText={ // newValue: what is being entered
                        (newValue) => this.setState({  // updates the state
                            currentHabit: newValue  // assigning newValue(textarea) to currentHabit(state)
                        })
                    }
                />
                <Pressable
                    style={styles.addButton}
                    onPress={this.addHabit}
                >
                    <Text style={styles.addButtonText}>Add habit</Text>
                </Pressable>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    habitInput: {
        borderWidth: 1,
        marginBottom: 10,
        borderRadius: 5,
        padding: 3,
        paddingHorizontal: 10,
        borderColor: 'white',
        color: 'white',
        textAlign: 'center',
    },
    addButton: {
        backgroundColor: '#000080',
        borderRadius: 5,
        paddingVertical: 5,
        paddingHorizontal: 10,
        width: '100%',
    },
    addButtonText: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 20,
        color: 'white',
    },
})
