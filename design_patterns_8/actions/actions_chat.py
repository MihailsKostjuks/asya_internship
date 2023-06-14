from enum import Enum


# mvc: action == view

class ActionsChat(str, Enum):
    CHAT_ADD_MESSAGE = 'CHAT_ADD_MESSAGE'
    CHAT_CHANGE_CURRENT_MESSAGE = 'CHAT_CHANGE_CURRENT_MESSAGE'
    CHAT_CLEAR_ALL_MESSAGES = 'CHAT_CLEAR_ALL_MESSAGES'
    CHAT_UNDO = 'CHAT_UNDO'


# this function is not an action: action is returned dict/dataclass
def action_chat_add_message(message, is_from_console=False):
    return {
        'type': ActionsChat.CHAT_ADD_MESSAGE,
        'payload': message,
        'is_from_console': is_from_console
    }


def action_chat_change_current_message(message):
    return {
        'type': ActionsChat.CHAT_CHANGE_CURRENT_MESSAGE,
        'payload': message
    }


def action_chat_clear_all_messages():
    return {
        'type': ActionsChat.CHAT_CLEAR_ALL_MESSAGES
    }

def action_chat_undo():
    return {
        'type': ActionsChat.CHAT_UNDO
    }
