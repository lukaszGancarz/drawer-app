import React, { useLayoutEffect, useState } from "react";
import rough from "roughjs/bundled/rough.esm";

const generator = rough.generator();

function createElement(x1, y1, x2, y2, type) {
  let roughElement = generator.line(x1, y1, x2, y2);
  if (type === "rectangle")
    roughElement = generator.rectangle(x1, y1, x2 - x1, y2 - y1);
  if (type === "circle") roughElement = generator.circle(x1, y1, (x2 - x1) * 2);
  return { x1, y1, x2, y2, roughElement };
}

function App() {
  const [elements, setElements] = useState([]);
  const [drawing, setDrawing] = useState(false);
  const [elementType, setElementType] = useState("line");

  useLayoutEffect(() => {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    const roughCanvas = rough.canvas(canvas);

    elements.forEach(({ roughElement }) => roughCanvas.draw(roughElement));
  });

  const handleMouseDown = (event) => {
    setDrawing(true);

    const { clientX, clientY } = event;
    const element = createElement(
      clientX,
      clientY,
      clientX,
      clientY,
      elementType
    );
    setElements((prevState) => [...prevState, element]);
  };

  const handleMouseMove = (event) => {
    if (!drawing) return;

    const { clientX, clientY } = event;
    const index = elements.length - 1;
    const { x1, y1 } = elements[index];
    const updatedElement = createElement(x1, y1, clientX, clientY, elementType);

    const elementsCopy = [...elements];
    elementsCopy[index] = updatedElement;
    setElements(elementsCopy);
  };

  const handleMouseUp = () => {
    setDrawing(false);
  };

  return (
    <div>
      <div style={{ position: "fixed" }}>
        <input
          type="radio"
          id="line"
          checked={elementType === "line"}
          onChange={() => setElementType("line")}
        />
        <label htmlFor="line">Line</label>
        <input
          type="radio"
          id="rectangle"
          checked={elementType === "rectangle"}
          onChange={() => setElementType("rectangle")}
        />
        <label htmlFor="rectangle">Rectangle</label>
        <input
          type="radio"
          id="circle"
          checked={elementType === "circle"}
          onChange={() => setElementType("circle")}
        />
        <label htmlFor="circle">Circle</label>
      </div>
      <canvas
        id={"canvas"}
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        Canvas
      </canvas>
    </div>
  );
}

export default App;
