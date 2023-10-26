/* eslint-disable max-lines */
import { MentionData } from "@draft-js-plugins/mention";
import { EditorState } from "draft-js";
import { useState } from "react";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useMentionState = () => {
  

  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [suggestions, setSuggestions] = useState<MentionData[]>([]);



  return {
    editorState,
    setEditorState,
    setSuggestions,
    suggestions,
    
  };
};
