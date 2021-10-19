const clearStyle = { background: "#ac3939" };
const operatorStyle = { background: "#666666" };
const equalsStyle = {
  background: "#004466",
  position: "absolute",
  height: 130,
  bottom: 5,
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
export default Buttons;
