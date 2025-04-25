// import React from 'react';
// import { useEditor, EditorContent } from '@tiptap/react';
// import StarterKit from '@tiptap/starter-kit';
// import Markdown from '@tiptap/extension-markdown';
// import Image from '@tiptap/extension-image';

// function MyEditor() {
//   const editor = useEditor({
//     extensions: [
//       StarterKit,
//       Markdown,
//       Image.configure({
//         inline: true,
//         allowBase64: true,
//       }),
//     ],
//     content: '<p>Hello World!</p>',
//   });

//   const handleImageUpload = (file) => {
//     const reader = new FileReader();
//     reader.onload = () => {
//       editor.commands.setImage({ src: reader.result });
//     };
//     reader.readAsDataURL(file);
//   };

//   return (
//     <div>
//       <EditorContent editor={editor} />
//       <input
//         type="file"
//         accept="image/*"
//         onChange={(e) => handleImageUpload(e.target.files[0])}
//       />
//     </div>
//   );
// }

// export default MyEditor;