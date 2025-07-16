import { useEffect, useRef, useState, useCallback } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default function EditorComponent() {
  const editorRef = useRef(null);
  const [editorData, setEditorData] = useState("<p>Start typing...</p>");
  const debounceTimeout = useRef(null);

  const handleEditorChange = useCallback((event, editor) => {
    const data = editor.getData();
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      setEditorData(data);
      console.log("Editor data updated:", data);
    }, 300);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

      if (editorRef.current) {
        const editorInstance = editorRef.current;
        editorRef.current = null; // Prevent future invalid calls

        if (editorInstance && editorInstance.destroy) {
          editorInstance
            .destroy()
            .then(() => console.log("Editor destroyed successfully"))
            .catch((error) => console.warn("Destroy Error:", error));
        }
      }
    };
  }, []);

  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
      <h2>CKEditor with Table Support</h2>
      <style>
        {`
          table {
            width: 80%;
            border-collapse: collapse;
          }
          table, th, td {
            border: 1px solid black;
          }
          th, td {
            padding: 8px;
            text-align: left;
          }
        `}
      </style>

      {/* Display HTML output */}
      <div dangerouslySetInnerHTML={{ __html: editorData }} />

      {/* CKEditor */}
      <CKEditor
        editor={ClassicEditor}
        data={editorData}
        config={{
          toolbar: [
            "heading",
            "|",
            "bold",
            "italic",
            "link",
            "bulletedList",
            "numberedList",
            "|",
            "insertTable",
            "blockQuote",
            "undo",
            "redo",
          ],
          table: {
            contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
          },
        }}
        onReady={(editor) => {
          if (!editorRef.current) {
            console.log("Editor is ready!", editor);
            editorRef.current = editor; // ✅ Ensure only one instance
          }
        }}
        onChange={handleEditorChange}
      />
    </div>
  );
}
