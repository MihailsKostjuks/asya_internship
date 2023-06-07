import json
from actions.actions_chat import ActionsChat


# mvc: reducer == controller

def reducer_main(state, action):
    if action['type'] == ActionsChat.CHAT_CHANGE_CURRENT_MESSAGE:
        state = state.copy()
        state.update({
            'current_message': action['payload']
        })
    elif action['type'] == ActionsChat.CHAT_ADD_MESSAGE:
        state = state.copy()
        state.update({
            'messages': state['messages'] + [action['payload']],  # append alternative
            'current_message': ''
        })
    elif action['type'] == ActionsChat.CHAT_CLEAR_ALL_MESSAGES:
        state = state.copy()
        state.update({
            'messages': []  # append alternative
        })
    elif action['type'] == ActionsChat.CHAT_UNDO:
        state = state.copy()
        actions = state['actions'].copy()
        if len(actions):
            last_action_str = actions[len(actions) - 1]
            last_action = json.loads(last_action_str)  # parsing json string to dict
            if last_action['type'] == ActionsChat.CHAT_ADD_MESSAGE:
                messages = state['messages'].copy()
                messages.pop()
                actions.pop()
                state.update({
                    'messages': messages,
                    'actions': actions
                })
            elif last_action['type'] == ActionsChat.CHAT_CLEAR_ALL_MESSAGES:
                state.update({
                    'messages': []  # before retvieving cleared messages, need to clear current messages
                })
                for eachActionString in actions:
                    eachAction = json.loads(eachActionString)
                    if eachAction['type'] == ActionsChat.CHAT_ADD_MESSAGE:
                        message = eachAction['payload']
                        state.update({
                            'messages': state['messages'] + [message]
                        })
                actions.pop()
                state.update({
                    'actions': actions
                })

    # adding actions
    if action['type'] == ActionsChat.CHAT_ADD_MESSAGE or action['type'] == ActionsChat.CHAT_CLEAR_ALL_MESSAGES:
        state = state.copy()
        state.update({
            'actions': state['actions'] + [json.dumps(action)]
        })
    return state
