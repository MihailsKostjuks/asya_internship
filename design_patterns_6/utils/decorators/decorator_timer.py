import time

from loguru import logger


def decorator_timer(event_name):
    def decorator_real(func):
        def wrapper(*args, **kwargs):
            start_time = time.time()
            func(*args, **kwargs)
            execution_time = time.time() - start_time
            logger.debug(f'execution time of {event_name}: {execution_time.__round__(4)}s')
        return wrapper
    return decorator_real
