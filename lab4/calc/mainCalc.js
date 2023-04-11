// Функция priority позволяет получить 
// значение приоритета для оператора.
// Возможные операторы: +, -, *, /.

function priority(operation) {
    if (operation == '+' || operation == '-') {
        return 1;
    } else {
        return 2;
    }
}

// Является ли строка str числом.

function isNumeric(str) {
    return /^\d+(.\d+){0,1}$/.test(str);
}

// Является ли строка str цифрой.

function isDigit(str) {
    return /^\d{1}$/.test(str);
}

// Является ли строка str оператором.

function isOperation(str) {
    return /^[\+\-\*\/]{1}$/.test(str);
}

// Функция tokenize принимает один аргумент -- строку
// с арифметическим выражением и делит его на токены 
// (числа, операторы, скобки). Возвращаемое значение --
// массив токенов.

function tokenize(str) {
    let tokens = [];
    let lastNumber = '';
    for (char of str) {
        if (isDigit(char) || char == '.') {
            lastNumber += char;
        } else {
            if (lastNumber.length > 0) {
                tokens.push(lastNumber);
                lastNumber = '';
            }
        }
        if (isOperation(char) || char == '(' || char == ')') {
            tokens.push(char);
        }
    }
    if (lastNumber.length > 0) {
        tokens.push(lastNumber);
    }
    return tokens;
}

// Функция compile принимает один аргумент -- строку
// с арифметическим выражением, записанным в инфиксной 
// нотации, и преобразует это выражение в обратную 
// польскую нотацию (ОПН). Возвращаемое значение -- 
// результат преобразования в виде строки, в которой 
// операторы и операнды отделены друг от друга пробелами. 
// Выражение может включать действительные числа, операторы 
// +, -, *, /, а также скобки. Все операторы бинарны и левоассоциативны.
// Функция реализует алгоритм сортировочной станции 

function compile(str) {
    let out = [];
    let stack = [];
    for (token of tokenize(str)) {
        if (isNumeric(token)) {
            out.push(token);
        } else if (isOperation(token)) {
            while (stack.length > 0 &&
                isOperation(stack[stack.length - 1]) &&
                priority(stack[stack.length - 1]) >= priority(token)) {
                out.push(stack.pop());
            }
            stack.push(token);
        } else if (token == '(') {
            stack.push(token);
        } else if (token == ')') {
            while (stack.length > 0 && stack[stack.length - 1] != '(') {
                out.push(stack.pop());
            }
            stack.pop();
        }
    }
    while (stack.length > 0) {
        out.push(stack.pop());
    }
    console.log(out);
    return out.join(' ');
}

// Функция evaluate принимает один аргумент -- строку 
// с арифметическим выражением, записанным в обратной 
// польской нотации. Возвращаемое значение -- результат 
// вычисления выражения. Выражение может включать 
// действительные числа и операторы +, -, *, /.

function evaluate(str) {
    let strings = compile(str).split(' ');
    let res = [];
    for (char of strings) {
        if (isDigit(char) || isNumeric(char)) {
            res.push(parseFloat(char));
        } else {
            let num1 = res.pop();
            let num2 = res.pop();
            if (char == '+') {
                res.push(num1 + num2).toFixed(2);
            } else if (char == '-') {
                res.push(num2 - num1).toFixed(2);
            } else if (char == '*') {
                res.push(num1 * num2).toFixed(2);
            } else if (char == '/') {
                res.push(num2 / num1).toFixed(2);
            }
        }
    }
    return res.pop().toFixed(2);
}


// Функция clickHandler предназначена для обработки 
// событий клика по кнопкам калькулятора. 
// По нажатию на кнопки с классами digit, operation и bracket
// на экране (элемент с классом screen) должны появляться 
// соответствующие нажатой кнопке символы.
// По нажатию на кнопку с классом clear содержимое экрана 
// должно очищаться.
// По нажатию на кнопку с классом result на экране 
// должен появиться результат вычисления введённого выражения 
// с точностью до двух знаков после десятичного разделителя (точки).
// не назначаем обработчик для каждой кнопки в отдельности.

function clickHandler(event) {
    if ((event.target.className == "digits") ||
        (event.target.className == "other")) return;

    let mes = document.querySelector(".mes");

    if (event.target.className == "key clear") {
        mes.innerHTML = null;
    } else if (event.target.className == "key result") {
        mes.innerHTML = evaluate(mes.innerHTML);
    } else {
        mes.innerHTML += event.target.innerHTML;
    }
}


// Назначение нужных обработчиков событий.

window.onload = function () {
    let buttons = document.querySelector(".buttons");
    buttons.onclick = clickHandler;
};