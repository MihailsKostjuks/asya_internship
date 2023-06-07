from pydux import create_store
from reducers.reducer_main import reducer_main
# mvc: store == model

store_main = create_store(
    reducer_main,
    initial_state={
        'current_message': '',
        'messages': [],
        'actions': []
    }
)