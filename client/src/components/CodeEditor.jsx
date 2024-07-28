/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-twilight'; 
import WhiteBoard from './WhiteBoard'; 
import debounce from 'lodash.debounce';
import axios from "axios";

const Editor = ({ editorRef, socketRef, roomid, code }) => {
  const [output, setOutput] = useState("");
  const [wb, setWb] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const languageMap = {
    Java: "java",
    Python: "py",
    "C++": "cpp",
  
    JavaScript: "js",
  };

  useEffect(() => {
    if (editorRef.current) {
      const editor = editorRef.current.editor;
      const currentCode = editor.getValue();

      if (currentCode !== code) {
        const cursorPosition = editor.getCursorPosition();
        editor.setValue(code, -1); // Set code and maintain the current cursor position
        editor.moveCursorToPosition(cursorPosition);
      }
    }
  }, [code, editorRef]);

  const runCode = async () => {
    const code = editorRef.current.editor.getValue(); // Example code snippet
    setOutput("");
    const encodedData = new URLSearchParams();
    encodedData.append('code', code);
    encodedData.append('language', language); // Set the language
    encodedData.append('input', inputValue); // Example input for the code

    try {
      const response = await axios({
        method: 'post',
        url: 'https://api.codex.jaagrav.in',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: encodedData.toString() // Convert URLSearchParams to string
      });

      if (response.status === 200) {
        console.log('Output:', response.data.output);
        if (response.data.output) setOutput(response.data.output);
        else setOutput(response.data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const syncCode = () => {
    const code = editorRef.current.editor.getValue();
    if (code) {
      socketRef.current.emit("sync-change", {
        roomid,
        code,
      });
    }
  };

  const handleLanguageSelect = () => {
    setShowLanguageMenu(!showLanguageMenu);
  };

  const selectLanguage = (lang) => {
    setLanguage(languageMap[lang]);
    setShowLanguageMenu(false);
  };

  // Create a debounced version of syncCode
  const debouncedSyncCode = useRef(debounce(syncCode, 400)).current;

  return (
    <div className="bg-[#141414] border rounded-lg m-1 space-y-4">
      <div className=''>
        <AceEditor
          ref={editorRef}
          className={wb ? "block" : "hidden"}
          mode="javascript"
          theme="twilight" // Updated theme
          name="editor"
          onChange={debouncedSyncCode}
          fontSize={14}
          height="71vh"
          width="100%"
          showPrintMargin={false}
          showGutter={true}
          highlightActiveLine={true}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: false,
            showLineNumbers: true,
            tabSize: 2,
          }}
        />
      </div>
      {!wb && <WhiteBoard socketRef={socketRef} roomid={roomid} className="w-full" />}
      <div className="flex flex-row-reverse mx-2 bg-[#141414]">
        {wb && (
          <>
            <button
              onClick={runCode}
              className="mt-4 mx-2 px-4 py-2 bg-black hover:bg-[#363636] text-white rounded transition duration-300"
            >
              Run Code
            </button>
            <button
              onClick={handleLanguageSelect}
              className="mt-4 mx-2 px-4 py-2 bg-black hover:bg-[#363636] text-white rounded transition duration-300"
            >
              {language.toUpperCase()}
            </button>
            {showLanguageMenu && (
              <div className="absolute mt-2 w-32 rounded-md shadow-lg bg-black text-white ring-1 ring-black ring-opacity-5">
                <div className="py-1">
                  {Object.keys(languageMap).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => selectLanguage(lang)}
                      className="w-full px-4 py-2 text-left text-sm  hover:bg-gray-100 hover:text-gray-900"
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
        <button
          onClick={() => setWb(!wb)}
          className="mt-4 px-4 py-2 bg-black hover:bg-[#363636] text-white rounded transition duration-300"
        >
          {wb ? "WhiteBoard" : "Editor"}
        </button>
      </div>
      {wb && (
        <div className='flex'>
           <div className="w-1/2 bg-[#1f1f1f] text-white rounded overflow-auto h-28">
          <p className="text-[#3B3B3B]">{'//input'}</p>
          <textarea
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="w-full h-20 overflow-auto bg-[#1f1f1f] border-none outline-none"
      />
        </div>
         <div className="w-1/2 bg-[#1f1f1f] text-white rounded overflow-auto h-28">
          <p className="text-[#3B3B3B]">{'//output'}</p>
          <pre>{output}</pre>
        </div>
       
        </div>    
      )}
    </div>
  );
};
export default Editor;
