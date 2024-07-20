/* eslint-disable no-unused-vars */
import { Editor } from '@tinymce/tinymce-react';
import { useEffect, useState, useCallback, useMemo, useRef } from 'react';

function RichTextEditor({
  onChange,
  initialValue,
  onSave,
  isBtnSave = false,
  form,
}) {
  const [value, setValue] = useState(initialValue || '');
  const editorRef = useRef(null);

  useEffect(() => {
    if (initialValue !== undefined) {
      setValue(initialValue);
    }
  }, [initialValue]);

  const handleEditorChange = useCallback(
    (newValue) => {
      setValue(newValue);
      if (form) {
        // When has multiple form elements
        form.setFieldsValue({ editor: newValue });
      }
      if (onChange) {
        onChange(newValue);
      }
    },
    [onChange, form],
  );

  const handleSave = useCallback(() => {
    if (editorRef.current) {
      const content = editorRef.current.getContent();
      onSave?.(content);
    }
  }, [onSave]);

  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
      // setValue(editorRef.current.getContent());
    }
  };

  const editorConfig = useMemo(
    () => ({
      height: '70vh',
      selector: 'textarea',
      object_resizing: 'img',
      plugins: [
        'advlist',
        'autolink',
        'lists',
        'link',
        'image',
        'charmap',
        'preview',
        'anchor',
        'searchreplace',
        'visualblocks',
        'code',
        'fullscreen',
        'insertdatetime',
        'media',
        'table',
        'code',
        'help',
        'wordcount',
      ],
      toolbar:
        'undo redo | blocks | ' +
        'bold italic forecolor | alignleft aligncenter ' +
        'alignright alignjustify | bullist numlist outdent indent | ' +
        'removeformat | help',
      content_style: 'body { font-family: Nunito, sans-serif; font-size:14px }',
    }),
    [],
  );

  return (
    <Editor
      apiKey='cwiopjzmq82k7ej27c8dyvtbojnjtk22zcb2myj4cgj2e41x'
      value={value}
      onEditorChange={handleEditorChange}
      onInit={(_evt, editor) => (editorRef.current = editor)}
      init={editorConfig}
    />
  );
}

export default RichTextEditor;
