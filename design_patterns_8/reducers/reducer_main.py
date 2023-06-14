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
            'messages': []
        })

    elif action['type'] == ActionsChat.CHAT_UNDO:
        state = state.copy()
        actions = state['actions'].copy()
        if len(actions):
            skip_increment = 0  # how many actions have been skipped (console inputs) before actual undo execution
            for last_action_str in reversed(actions):
                index_to_pop = len(actions) - 1 - skip_increment
                last_action = json.loads(last_action_str)  # parsing json string to dict
                if last_action['type'] == ActionsChat.CHAT_ADD_MESSAGE:
                    if not last_action['is_from_console']:  # does not allow undo messages that came from console
                        messages = state['messages'].copy()
                        messages.pop(index_to_pop)
                        actions.pop(index_to_pop)
                        state.update({
                            'messages': messages,
                            'actions': actions
                        })
                        break
                    else:
                        skip_increment += 1

                elif last_action['type'] == ActionsChat.CHAT_CLEAR_ALL_MESSAGES:
                    state.update({
                        'messages': []  # before retrieving cleared messages, need to clear current messages
                    })
                    for eachActionString in actions:
                        eachAction = json.loads(eachActionString)
                        if eachAction['type'] == ActionsChat.CHAT_ADD_MESSAGE:
                            message = eachAction['payload']
                            state.update({
                                'messages': state['messages'] + [message]
                            })
                    actions.pop(index_to_pop)
                    state.update({
                        'actions': actions
                    })
                    break

    # adding actions
    if action['type'] == ActionsChat.CHAT_ADD_MESSAGE or action['type'] == ActionsChat.CHAT_CLEAR_ALL_MESSAGES:
        state = state.copy()
        state.update({
            'actions': state['actions'] + [json.dumps(action)]
        })
    return state
