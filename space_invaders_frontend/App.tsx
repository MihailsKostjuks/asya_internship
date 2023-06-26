import {Button, Modal, StyleSheet, View} from 'react-native';
import SceneComponent from "./src/components/SceneComponent";
import {useEffect, useRef, useState} from "react";
import {ControllerGame} from "./src/controllers/ControllerGame";
import ControllerComponent from "./src/components/ControllerComponent";
import ScoreComponent from "./src/components/ScoreComponent";
import LivesComponent from "./src/components/LivesComponent";
import {EnumCurrentModal} from "./src/enums/EnumCurrentModal";
import SubmitScoreComponent from "./src/components/SubmitScoreComponent";
import {EnumGameState} from "./src/enums/EnumGameState";

export default function App() {

  // front-end✅ TODO: check border✅, collision✅, rocket✅, explosion✅, ui buttons arrows✅, scores✅, lives✅
  // back-end TODO: players, sessions, scores, API, + front-end: user_name input✅, new_game button✅, high scores modal

  const [deltaTime, setDeltaTime] = useState(0);
  const [currentModal, setCurrentModal] = useState(EnumCurrentModal.gameModal);
  const [currentGameState, setCurrentGameState] = useState(EnumGameState.gameNotStarted);

  const startTime = useRef(0);

  function main_game_loop() {
    const currentTime = performance.now();
    const delta_time = (currentTime - startTime.current) / 1000;

    ControllerGame.instance.update(delta_time);
    // delta time = 0.12

    setDeltaTime(delta_time);
    startTime.current = currentTime;

  }

  function new_game() {
    ControllerGame.instance.new_game();
    setCurrentGameState(EnumGameState.gameRunning);
    startTime.current = performance.now();
    main_game_loop();
  }

  useEffect(() => {
    if (currentGameState === EnumGameState.gameRunning) {
      setTimeout(main_game_loop, 30);
      if (ControllerGame.instance.is_won()) {
        setCurrentGameState(EnumGameState.gameWon);
        setCurrentModal(EnumCurrentModal.submitScoresModal);
      } else if (ControllerGame.instance.is_lost()) {
        setCurrentGameState(EnumGameState.gameLost);
        setCurrentModal(EnumCurrentModal.submitScoresModal);
      }
    }

  }, [deltaTime]);

  const submitUsername = () => {
    setCurrentModal(EnumCurrentModal.gameModal);
  }

  return (
    <View>
      <Modal visible={currentModal === EnumCurrentModal.gameModal}>
        <View style={styles.mainContainer}>
          <View style={{flexDirection: 'row'}}>
            <Button title={'New Game'} onPress={new_game}></Button>
          </View>
          <View style={styles.gameContainer}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <ScoreComponent/>
              <LivesComponent/>
            </View>
            <SceneComponent/>
          </View>
          <ControllerComponent/>
        </View>
      </Modal>
      <Modal visible={currentModal === EnumCurrentModal.submitScoresModal}>
        <SubmitScoreComponent onSubmit={submitUsername}/>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#001933',
  },
  gameContainer: {
    width: 340,
    height: 730,
    justifyContent: 'space-between',
    alignSelf: "center"
  }
});
