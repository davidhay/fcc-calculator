import { useEffect, useState } from "react";

const Formula = ({ formula }) => {
  return <div className="formulaScreen">{formula}</div>;
};

const clearStyle = { background: "#ac3939" };
const operatorStyle = { background: "#666666" };
const equalsStyle = {
  background: "#004466",
  position: "absolute",
  height: 130,
  bottom: 5,
};
const Output = ({ currentValue }) => {
  return (
    <div className="outputScreen" id="display">
      {currentValue}
    </div>
  );
};
const Buttons = ({
  onInit,
  onOperator,
  onNumber,
  onDecimalPoint,
  onCalculate,
}) => {
  return (
    <div>
      <button
        className="jumbo"
        id="clear"
        onClick={onInit}
        style={clearStyle}
        value="AC"
      >
        AC
      </button>
      <button id="divide" onClick={onOperator} style={operatorStyle} value="/">
        /
      </button>
      <button
        id="multiply"
        onClick={onOperator}
        style={operatorStyle}
        value="*"
      >
        x
      </button>
      <button id="seven" onClick={onNumber} value="7">
        7
      </button>
      <button id="eight" onClick={onNumber} value="8">
        8
      </button>
      <button id="nine" onClick={onNumber} value="9">
        9
      </button>
      <button
        id="subtract"
        onClick={onOperator}
        style={operatorStyle}
        value="-"
      >
        -
      </button>
      <button id="four" onClick={onNumber} value="4">
        4
      </button>
      <button id="five" onClick={onNumber} value="5">
        5
      </button>
      <button id="six" onClick={onNumber} value="6">
        6
      </button>
      <button id="add" onClick={onOperator} style={operatorStyle} value="+">
        +
      </button>
      <button id="one" onClick={onNumber} value="1">
        1
      </button>
      <button id="two" onClick={onNumber} value="2">
        2
      </button>
      <button id="three" onClick={onNumber} value="3">
        3
      </button>
      <button className="jumbo" id="zero" onClick={onNumber} value="0">
        0
      </button>
      <button id="decimal" onClick={onDecimalPoint} value=".">
        .
      </button>
      <button id="equals" onClick={onCalculate} style={equalsStyle} value="=">
        =
      </button>
    </div>
  );
};

const initialState = {
  items: [],
  showingResult: false,
  currentVal: "0",
};

const hiOps = ["*", "/"];
const loOps = ["-", "+"];

const isEmpty = (items) => {
  return items.length === 0;
};

const peek = (items) => {
  return items[items.length - 1];
};

const isHiOp = (item) => {
  //console.log({ item });
  const result = hiOps.indexOf(item) >= 0;
  //console.log(`${item} isHiOp ? ${result}`);
  return result;
};

const isLoOp = (item) => {
  //console.log({ item });
  const result = loOps.indexOf(item) >= 0;
  //console.log(`${item} loOps ? ${result}`);
  return result;
};

const isOperator = (item) => {
  //console.log(`isOperator : ${item}`);
  const result = isHiOp(item) || isLoOp(item);
  //console.log(`${item} is isOperator ? ${result}`);
  return result;
};

const isHigher = (op1, op2) => {
  return isHiOp(op1) && isLoOp(op2);
};

const isLower = (op1, op2) => {
  return isLoOp(op1) && isHiOp(op2);
};

const getPostFix = (items) => {
  const operators = [];
  const output = [];
  console.log("Generating Postfix for", { items });
  for (let i in items) {
    const item = items[i];
    console.log("item is", { item });
    if (isOperator(item)) {
      const operator = item;
      if (isEmpty(operators)) {
        operators.push(operator);
      } else {
        const topOperator = peek(operators);

        if (isHigher(operator, topOperator)) {
        } else {
          let finished = false;
          //transfer anything lower than this operator from operators to output.
          do {
            if (isEmpty(operators)) {
              finished = true;
            } else {
              finished = isLower(peek(operators), operator);
              if (!finished) {
                output.push(operators.pop());
              }
            }
          } while (!finished);
        }
        operators.push(operator);
      }
    } else {
      const operand = item;
      output.push(operand);
    }
  }
  while (!isEmpty(operators)) {
    output.push(operators.pop());
  }
  return output;
};

const evaluatePostFix = (postFixArr) => {
  console.log(`POSTFIX ${postFixArr}`);
  const stack = [];

  console.log(`STACK ${stack}`);
  for (let i in postFixArr) {
    const item = postFixArr[i];
    if (isOperator(item)) {
      const right = stack.pop();
      const left = stack.pop();
      if ("*" === item) {
        stack.push(left * right);
      } else if ("/" === item) {
        stack.push(left / right);
      } else if ("+" === item) {
        stack.push(left + right);
      } else if ("-" === item) {
        stack.push(left - right);
      } else {
        throw new Error("oops" + item);
      }
    } else {
      stack.push(item);
    }
    console.log(`STACK ${stack}`);
  }
  console.log(`FINAL STACK ${stack}`);
  return peek(stack);
};

const Calculator = (props) => {
  const [state, setState] = useState(initialState);

  const init = () => {
    setState(initialState);
  };

  useEffect(() => {
    console.log("updated state", { state });
  }, [state]);

  const handleCalculate = (e) => {
    console.log("CALCULATING....");
    setState((oldState) => {
      if (oldState.showingResult) {
        return oldState;
      } else {
        const allItems = [...oldState.items, Number(oldState.currentVal)];
        const postFixArr = getPostFix(allItems);
        console.log("as postfix", { postFixArr });
        const result = evaluatePostFix(postFixArr);
        return {
          ...oldState,
          showingResult: true,
          items: allItems,
          currentVal: result,
        };
      }
    });
  };

  //we can only have a single digit
  const handleDecimalPoint = (e) => {
    setState((oldState) => {
      if (oldState.showingResult) {
        return {
          ...oldState,
          showingResult: false,
          items: [],
          currentVal: "0.",
        };
      } else {
        if (oldState.currentVal.indexOf(".") >= 0) {
          return {
            ...oldState,
            showingResult: false,
          };
        } else {
          return {
            ...oldState,
            showingResult: false,
            currentVal: oldState.currentVal + ".",
          };
        }
      }
    });
  };
  const handleOperator = (e) => {
    setState((oldState) => {
      console.log("OPERATOR " + e.target.value);
      const op = e.target.value;
      if (oldState.showingResult) {
        //push result as an item
        return {
          ...oldState,
          showingResult: false,
          items: [Number(oldState.currentVal)],
          currentVal: op,
        };
      } else {
        //we have operator after operator
        if (isOperator(oldState.currentVal)) {
          //replace operator
          if (op === "-") {
            // push - onto item, put - as op
            // how do I know that there's a minus.
            return {
              ...oldState,
              items: [oldState.items, oldState.currentVal],
              showingResult: false,
              currentVal: op,
            };
          } else {
            return {
              ...oldState,
              showingResult: false,
              currentVal: op,
            };
          }
        } else {
          //we have operator after number
          return {
            ...oldState,
            showingResult: false,
            items: [...oldState.items, Number(oldState.currentVal)],
            currentVal: op,
          };
        }
      }
    });
  };

  const handleNumber = (e) => {
    setState((oldState) => {
      console.log("NUM" + e.target.value);
      const num = e.target.value;
      if (oldState.showingResult) {
        console.log("number 001");
        return {
          ...oldState,
          showingResult: false,
          items: [],
          currentVal: num,
        };
      } else if (!isOperator(oldState.currentVal)) {
        //PREVIOUS NUMBER
        if (oldState.currentVal === "0" || oldState.currentVal === "0.") {
          //replace 0 with num
          return {
            ...oldState,
            showingResult: false,
            currentVal: num,
          };
        } else {
          //concat to end
          return {
            ...oldState,
            showingResult: false,
            currentVal: oldState.currentVal + num,
          };
        }
      } else {
        //MAKE THE NUMBER NEGATIVE?
        if (
          oldState.currentVal === "-" &&
          oldState.items.length > 0 &&
          isOperator(oldState.items[oldState.items.length - 1])
        ) {
          return {
            ...oldState,
            showingResult: false,
            currentVal: oldState.currentVal + num,
          };
        } else {
          //START A NEW NUMBER
          return {
            ...oldState,
            showingResult: false,
            items: [...oldState.items, oldState.currentVal],
            currentVal: num,
          };
        }
      }
    });
  };

  let formula = state.items.join("");
  if (state.showingResult) {
    formula += "=";
  }
  formula += state.currentVal;
  return (
    <div>
      <div className="calculator">
        <Formula formula={formula} />
        <Output currentValue={state.currentVal} />
        <Buttons
          onInit={init}
          onCalculate={handleCalculate}
          onDecimalPoint={handleDecimalPoint}
          onNumber={handleNumber}
          onOperator={handleOperator}
        />
      </div>
      <div className="author">me</div>
    </div>
  );
};
export default Calculator;
