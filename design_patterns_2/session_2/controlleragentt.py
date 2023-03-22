from dataclasses import dataclass


class Agent:
    def __init__(self):
        self.pos_x: int = 0

class ControllerAgent:
    def __init__(self):
        self.agents = []
    @staticmethod
    def move_agent(agent: Agent):
        agent.pos_x += 1
        print(agent.pos_x)

@dataclass
class Data:
    x: int = 0

class Data1:
    def __init__(self):
        self.data = Data()

class Data2:
    def __init__(self):
        self.data = Data()

d1 = Data1()
d1.data.x += 1

d2 = Data1()
d2.data.x += 21

print(d1.data.x)
print(d2.data.x)