let prompt = require('Prompt')
prompt.start();
prompt.get(['x', 'b'],
    function (err, result) {
    let final_result = calculate(result.x, result.b)
    console.log(`x = ${result.x}, b = ${result.b}, Result = ${final_result}`)
    });

function calculate(x,b) {
    let result = x * b;
    for (let i = 0; i < b-1; i++) {
        result = result * x * b;
    }
    if (b === 0) {
        result = 1
    }
    return result;
}
