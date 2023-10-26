import Editor from "@draft-js-plugins/editor";
import { ReactElement } from "react";
import "@draft-js-plugins/mention/lib/plugin.css";
import "draft-js/dist/Draft.css";
import { useTranslation } from "react-i18next";

import { useMentionInput } from "./hooks/useMentionInput";

type MentionInputProps = {
  onSubmit: () => void;
  setMessage: (text: string) => void;
  message: string;
  disabled: boolean;
};


export const MentionInput = ({
  onSubmit,
  setMessage,
  message,
  disabled,
}: MentionInputProps): ReactElement => {
  const {
    mentionInputRef,
    keyBindingFn,
    editorState,
    open,
    plugins,
    handleEditorChange,
  } = useMentionInput({
    message,
    onSubmit,
    setMessage,
  });

  const { t } = useTranslation(["report"]);

  return (
    <div className="w-full" data-testid="report-input">
      <Editor
        editorKey={"editor"}
        editorState={editorState}
        onChange={handleEditorChange}
        plugins={plugins}
        ref={mentionInputRef}
        placeholder={t("actions_bar_placeholder")}
        keyBindingFn={keyBindingFn}
        readOnly={disabled}
      />
      <div
        style={{
          opacity: open ? 1 : 0,
        }}
      >
      </div>
    </div>
  );
};
