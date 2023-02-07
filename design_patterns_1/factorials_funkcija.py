def fact(x,b):
    exp_result = x
    for _ in range(b-1):
        exp_result = exp_result * x
    result = 1
    for i in range(2, exp_result+1):
        result = result * i
    return result

print(fact(3,2))