/* eslint-disable max-lines */
import Editor from "@draft-js-plugins/editor";
import { EditorState, getDefaultKeyBinding } from "draft-js";
import { useCallback, useEffect, useRef, useState } from "react";

// import {
//   mentionTriggers,
//   MentionTriggerType,
// } from "@/app/report/[reportId]/components/ActionsBar/types";
// import { useJune } from "@/services/analytics/useJune";
import "@draft-js-plugins/mention/lib/plugin.css";
import "draft-js/dist/Draft.css";

import { useMentionPlugin } from "./helpers/MentionPlugin";
import { useMentionState } from "./helpers/MentionState";
import { getEditorText } from "./helpers/getEditorText";

type UseMentionInputProps = {
  message: string;
  onSubmit: () => void;
  setMessage: (text: string) => void;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useMentionInput = ({
  message,
  onSubmit,
  setMessage,
}: UseMentionInputProps) => {

  // const analytics = useJune();
  const {
    editorState,
    setEditorState,
    
    suggestions,
  } = useMentionState();

  const { MentionSuggestions, plugins } = useMentionPlugin();

  // const [currentTrigger] = useState<MentionTriggerType>("@");

  const mentionInputRef = useRef<Editor>(null);

  const [open, setOpen] = useState(false);

  const resetEditorContent = useCallback(() => {
    setEditorState(EditorState.createEmpty());
  }, [setEditorState]);

  const keyBindingFn = useCallback(
    // eslint-disable-next-line complexity
    (e: React.KeyboardEvent<HTMLDivElement>) => {

      if (e.key === "Backspace" || e.key === "Delete") {
        const editorContent = getEditorText(editorState);

        if (editorContent !== "") {
          return getDefaultKeyBinding(e);
        }

        return "backspace";
      }

      if (e.key === "Enter" && !e.shiftKey) {
        onSubmit();

        return "submit";
      }

      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        return undefined;
      }

      return getDefaultKeyBinding(e);
    },
    [

      editorState,
      onSubmit,

    ]
  );

  const handleEditorChange = useCallback(
    (newEditorState: EditorState) => {
      setEditorState(newEditorState);
    },
    [setEditorState]
  );

  useEffect(() => {
    const currentMessage = getEditorText(editorState);

    if (currentMessage !== "") {
      setMessage(currentMessage);
    }
  }, [editorState, setMessage]);

  useEffect(() => {
    if (message === "") {
      resetEditorContent();
    }
  }, [message, resetEditorContent]);

  return {
    mentionInputRef,
    plugins,
    MentionSuggestions,
    open,
    suggestions,
    editorState,
    handleEditorChange,
    keyBindingFn,
    // currentTrigger,
    setOpen,
  };
};
