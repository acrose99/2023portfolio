import { EnterFullScreenIcon, ExitFullScreenIcon } from "@radix-ui/react-icons";
import { Resizable } from "re-resizable";
import React, { useEffect, useMemo, useState } from "react";
// import {
//   DndContext,
//   useDraggable,
//   useSensor,
//   MouseSensor,
//   TouchSensor,
//   KeyboardSensor,
//   PointerActivationConstraint,
//   Modifiers,
//   useSensors,
// } from "@dnd-kit/core";
// import {
//   createSnapModifier,
//   restrictToHorizontalAxis,
//   restrictToVerticalAxis,
//   restrictToWindowEdges,
//   snapCenterToCursor,
// } from "@dnd-kit/modifiers";
// import type { Coordinates } from "@dnd-kit/utilities";

// enum Axis {
//   All,
//   Vertical,
//   Horizontal,
// }

// interface Props {
//   activationConstraint?: PointerActivationConstraint;
//   axis?: Axis;
//   handle?: boolean;
//   modifiers?: Modifiers;
//   buttonStyle?: React.CSSProperties;
//   style?: React.CSSProperties;
//   label?: string;
//   children: React.ReactNode;
// }
// const defaultCoordinates = {
//   x: 0,
//   y: 0,
// };

// function DraggableStory({
//   activationConstraint,
//   axis,
//   handle,
//   label = "Go ahead, drag me.",
//   modifiers,
//   style,
//   buttonStyle,
//   children,
// }: Props) {
//   const [{ x, y }, setCoordinates] = useState<Coordinates>(defaultCoordinates);
//   const mouseSensor = useSensor(MouseSensor, {
//     activationConstraint,
//   });
//   const touchSensor = useSensor(TouchSensor, {
//     activationConstraint,
//   });
//   const keyboardSensor = useSensor(KeyboardSensor, {});
//   const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

//   return (
//     <DndContext
//       sensors={sensors}
//       onDragEnd={({ delta }) => {
//         setCoordinates(({ x, y }) => {
//           return {
//             x: x + delta.x,
//             y: y + delta.y,
//           };
//         });
//       }}
//       modifiers={modifiers}
//     >
//       <div
//         style={{
//           display: "flex",
//           boxSizing: "border-box",
//           padding: "20px",
//           justifyContent: "flex-start",
//         }}
//       >
//         <div
//           style={{
//             position: "absolute",
//             transform: `translate(${x}px, ${y}px)`,
//           }}
//         >
//           {children}
//         </div>
//       </div>
//     </DndContext>
//   );
// }

interface WindowProps {
  title: string;
  children: React.ReactNode;
  onClose?: () => void;
  onResize?: () => void;
}

function Window({ title, children, onClose, onResize }: WindowProps) {
  const [closed, setClosed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (event: DragEvent) => {
      const windowDimensions = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
      // @ts-ignore
      if (event.target.className === "title-bar") {
          /* check if the cursor is inside the window */
          if (
            event.clientX > 0 &&
            event.clientX < windowDimensions.width - 200 &&
            event.clientY > 0 &&
            event.clientY < windowDimensions.height - 200
          ) {
            /* get the center of cursor compared to the window */
            setMousePos({ x: event.clientX - 320, y: event.clientY - 240 });
            /* get the center of cursor compared to the window */
          } else {
            return;
          }
      } else {
        window.removeEventListener("drag", handleMouseMove);
      }
    };
    window.addEventListener(
      "dragstart",
      function (event) {
        var img = new Image();
        img.src =
          "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=";
        // @ts-ignore
        event.dataTransfer.setDragImage(img, 0, 0);
      },
      false,
    );
    window.addEventListener("drag", handleMouseMove);
    return () => {
      window.removeEventListener("drag", handleMouseMove);
    };
  }, []);
  // const [width, setWidth] = useState(320);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  function close() {
    if (onClose) {
      onClose();
    }
    setClosed(!closed);
    console.log("close");
  }
  return (
    <div
      style={{
        position: "absolute",
        left: "25%",
        top: "25%",
        height: closed ? "30px" : "100%",
        width: '100%',
        transform: `translate(${x}px, ${y}px)`,
        overflow: "hidden",
      }}
    >
      <Resizable
        bounds="parent"
        style={{
          height: closed ? 0 : "100%",
          maxHeight: closed ? 0 : "100%",
          margin: "0",
          boxSizing: "border-box",
        }}
        defaultSize={{
          width: "50vw",
          height: "70vh",
        }}
        className="window"
        // size={{
        //   width: width,
        //   height: height,
        // }}
      >
        <div
          draggable
          onDragCapture={(event) => {
            setX(mousePos.x);
            setY(mousePos.y);
          }}
          style={{
            cursor: "grab !important",
          }}
          className="title-bar"
        >
          <button
            onClick={() => {
              close();
            }}
            style={{
              cursor: "pointer",
            }}
            aria-label="Close"
            className="closenew"
          >
            {closed ? (
              <EnterFullScreenIcon
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                }}
                width={24}
                height={24}
              />
            ) : (
              <ExitFullScreenIcon
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                }}
                width={24}
                height={24}
              />
            )}
          </button>
          <h1 className="title">{title}</h1>
        </div>
        <div className="separator"></div>

        <div
          style={{
            height: closed ? 0 : "100%",
            paddingBottom: "50px",
            // display: closed ? "none" : "block",
          }}
          className={closed ? "window-pane" : "window-pane"}
        >
          {children}
        </div>
      </Resizable>
    </div>
  );
}

export default Window;
