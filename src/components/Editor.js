// import React, { useEffect, useRef } from "react";
// import { fromTextArea } from "codemirror";
// import "codemirror/lib/codemirror.css";
// import "codemirror/theme/dracula.css";
// import "codemirror/mode/javascript/javascript";
// import "codemirror/addon/edit/closetag";
// import "codemirror/addon/edit/closebrackets";
// import ACTIONS from "../Actions";

// const Editor = ({ socketRef, roomId, onCodeChange }) => {
//   const editorRef = useRef(null);
//   useEffect(() => {
//     async function init() {
//       editorRef.current = Codemirror.fromTextArea(
//         document.getElementById("realtimeEditor"),
//         {
//           mode: { name: "javascript", json: true },
//           theme: "dracula",
//           autoCloseTags: true,
//           autoCloseBrackets: true,
//           lineNumbers: true,
//         }
//       );

//       editorRef.current.on("change", (instance, changes) => {
//         const { origin } = changes;
//         const code = instance.getValue();
//         onCodeChange(code);
//         if (origin !== "setValue") {
//           socketRef.current.emit(ACTIONS.CODE_CHANGE, {
//             roomId,
//             code,
//           });
//         }
//       });
//     }
//     init();
//   }, []);

//   useEffect(() => {
//     if (socketRef.current) {
//       socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
//         if (code !== null) {
//           editorRef.current.setValue(code);
//         }
//       });
//     }

//     return () => {
//       socketRef.current.off(ACTIONS.CODE_CHANGE);
//     };
//   }, [socketRef.current]);

//   return <textarea id="realtimeEditor"></textarea>;
// };

// export default Editor;
// import React, { useEffect, useRef } from "react";
// import { fromTextArea } from "codemirror";
// import "codemirror/lib/codemirror.css";
// import "codemirror/theme/dracula.css";
// import "codemirror/mode/javascript/javascript";
// import "codemirror/addon/edit/closetag";
// import "codemirror/addon/edit/closebrackets";
// import ACTIONS from "../Actions";

// const Editor = ({ socketRef, roomId, onCodeChange }) => {
//   const editorRef = useRef(null);

//   useEffect(() => {
//     async function init() {
//       editorRef.current = fromTextArea(
//         document.getElementById("realtimeEditor"),
//         {
//           mode: { name: "javascript", json: true },
//           theme: "dracula",
//           autoCloseTags: true,
//           autoCloseBrackets: true,
//           lineNumbers: true,
//         }
//       );

//       editorRef.current.on("change", (instance, changes) => {
//         const { origin } = changes;
//         const code = instance.getValue();
//         onCodeChange(code);
//         if (origin !== "setValue") {
//           socketRef.current.emit(ACTIONS.CODE_CHANGE, {
//             roomId,
//             code,
//           });
//         }
//       });
//     }

//     init();
//   }, []);

//   useEffect(() => {
//     if (socketRef.current) {
//       socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
//         if (code !== null && editorRef.current) {
//           editorRef.current.setValue(code);
//         }
//       });
//     }

//     return () => {
//       socketRef.current.off(ACTIONS.CODE_CHANGE);
//     };
//   }, [socketRef]);

//   return <textarea id="realtimeEditor"></textarea>;
// };

// export default Editor;

import React, { useEffect, useRef } from "react";
import { fromTextArea } from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import ACTIONS from "../Actions";

const Editor = ({ socketRef, roomId, onCodeChange }) => {
  const editorRef = useRef(null);
  const textAreaRef = useRef(null); // Add a separate ref to the textarea

  useEffect(() => {
    if (!editorRef.current) {
      editorRef.current = fromTextArea(textAreaRef.current, {
        mode: { name: "javascript", json: true },
        theme: "dracula",
        autoCloseTags: true,
        autoCloseBrackets: true,
        lineNumbers: true,
      });

      editorRef.current.on("change", (instance, changes) => {
        const { origin } = changes;
        const code = instance.getValue();
        onCodeChange(code);
        if (origin !== "setValue" && socketRef.current) {
          socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            roomId,
            code,
          });
        }
      });
    }
  }, []);

  useEffect(() => {
    if (!socketRef.current || !editorRef.current) return;

    const handleCodeChange = ({ code }) => {
      if (code !== null && editorRef.current) {
        const currentCode = editorRef.current.getValue();
        if (currentCode !== code) {
          editorRef.current.setValue(code);
        }
      }
    };

    socketRef.current.on(ACTIONS.CODE_CHANGE, handleCodeChange);

    return () => {
      socketRef.current.off(ACTIONS.CODE_CHANGE, handleCodeChange);
    };
  }, [socketRef]);

  return <textarea id="realtimeEditor" ref={textAreaRef}></textarea>;
};

export default Editor;
