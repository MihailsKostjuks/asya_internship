from collections import OrderedDict
from typing import List
from controllers.interfaces.IControllerActor import IControllerActor


class CollectionActorControllers:
    def __init__(self, actor_controllers: List[IControllerActor]):
        super().__init__()
        self.actor_controllers = actor_controllers
        self.actor_groups = OrderedDict()  # saves the append order
        self.actor_groups_keys = []
        self.idx = 0

    def __len__(self):  # len()
        #  return len(self.actor_controllers) // 2  # floor division (find out pairs amount)
        return len(self.actor_groups_keys)

    def __iter__(self):  # enter the for loop
        # 1. creating a key(tribe)/value(actor_controller) DICTIONARY
        # 2. creating a LIST with all the tribes (currently 2)
        self.idx = 0
        self.actor_groups.clear()
        self.actor_groups_keys.clear()
        for actor_controller in self.actor_controllers:
            tribe = actor_controller.actor.tribe
            if tribe not in self.actor_groups:
                self.actor_groups[tribe] = []  # if there's no such tribe, we add a pair with empty value
            self.actor_groups[tribe].append(actor_controller)
        self.actor_groups_keys = list(self.actor_groups.keys())  # iter -> list
        return self  # here ends the preparation for loop enter. Anything above is done before starting the iteration

    def __next__(self):  # on each for loop iteration
        # 2 iterations (as only 2 tribes)
        # returns a tribe & a list of actor_controllers
        if self.idx >= len(self.actor_groups_keys):  # here probably >=
            raise StopIteration()
        tribe = self.actor_groups_keys[self.idx]
        actors: List = self.actor_groups[tribe]
        self.idx += 1
        return tribe, actors  # returns a tuple, can be coded without ()


