# Американская вилка
class UsaFork:
    def power_usa(self):
        print('power on. Usa')


# Европейская вилка
class EuroFork:
    def power_euro(self):
        print('power on. Euro')


# Американская розетка
class UsaSocket:
    def __init__(self, fork):
        self.fork = fork

    def connect(self):
        self.fork.power_usa()

# Вставляем американскую вилку в американскую розетку.
# creating UsaSocket class instance us. Giving as an argument UsaFork class instance
us = UsaSocket(UsaFork())
us.connect()  # UsaFork().power_usa()
# >>> power on. Usa


# # >>> AttributeError: 'EuroFork' object has no attribute 'power_usa'

class AdapterEuroInUsa:
    def __init__(self):
        self._euro_fork = EuroFork()
    def power_usa(self):
        self._euro_fork.power_euro()

us = UsaSocket(AdapterEuroInUsa())
us.connect()