import {Button, TextInput, View} from "react-native";
import {useState} from "react";


interface Props {
    onSubmit: () => void,
}

export function SubmitScoreComponent(props: Props) {

    const [inputText, setInputText] = useState('');

    const handleInputChange = (text: string) => {
        setInputText(text);
    };

    const handleSubmitButton = () => {
        console.log(inputText);
        // TODO REQUEST
        props.onSubmit();
    };

    const handleSkipButton = () => {
        props.onSubmit();
    }

    return (
        <View>
            <TextInput
                value={inputText}
                onChangeText={handleInputChange}
                placeholder="Enter username"
                style={{ borderWidth: 1, padding: 10 }}
            />

            <Button
                title="Submit"
                onPress={handleSubmitButton}
            />

            <Button
                title="Skip this part"
                onPress={handleSkipButton}
            />
        </View>
    )
}
export default SubmitScoreComponent;
