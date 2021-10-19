import Buttons from "./Buttons";
import Output from "./Output";
import Formula from "./Formula";
import { useEffect, useState } from "react";
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
        console.log("aaaaaaaaaaaaaaaaaaaaaaaaaa");
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
        if (isOperator(oldState.currentVal)) {
          //replace operator
          return {
            ...oldState,
            showingResult: false,
            currentVal: op,
          };
        } else {
          //we have a number - we add it as such
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
        return {
          ...oldState,
          showingResult: false,
          items: [],
          currentVal: num,
        };
      } else {
        if (isOperator(oldState.currentVal)) {
          console.log("have op now number!");
          return {
            ...oldState,
            showingResult: false,
            items: [...oldState.items, oldState.currentVal],
            currentVal: num,
          };
        } else if (oldState.currentVal !== "0") {
          return {
            showingResult: false,
            ...oldState,
            currentVal: oldState.currentVal + num,
          };
        } else {
          return {
            showingResult: false,
            ...oldState,
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
