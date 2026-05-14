import React, { useMemo, useRef, useState } from 'react';
import { useCopilotContext, useCopilotReadable } from '@copilotkit/react-core';
import AutoResizingTextarea from '@gitroom/frontend/components/agents/agent.textarea';
import { useChatContext } from '@copilotkit/react-ui';
import { InputProps } from '@copilotkit/react-ui/dist/components/chat/props';
const MAX_NEWLINES = 6;

export const Input = ({
  inProgress,
  onSend,
  isVisible = false,
  onStop,
  onUpload,
  hideStopButton = false,
  onChange,
}: InputProps & { onChange: (value: string) => void }) => {
  const context = useChatContext();
  const copilotContext = useCopilotContext();
  const showPoweredBy = !copilotContext.copilotApiConfig?.publicApiKey;

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isComposing, setIsComposing] = useState(false);

  const handleDivClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;

    // If the user clicked a button or inside a button, don't focus the textarea
    if (target.closest('button')) return;

    // If the user clicked the textarea, do nothing (it's already focused)
    if (target.tagName === 'TEXTAREA') return;

    // Otherwise, focus the textarea
    textareaRef.current?.focus();
  };

  const [text, setText] = useState('');
  const send = () => {
    if (inProgress) return;
    onSend(text);
    setText('');

    textareaRef.current?.focus();
  };

  const isInProgress = inProgress;
  const buttonIcon =
    isInProgress && !hideStopButton
      ? context.icons.stopIcon
      : context.icons.sendIcon;

  const canSend = useMemo(() => {
    const interruptEvent = copilotContext.langGraphInterruptAction?.event;
    const interruptInProgress =
      interruptEvent?.name === 'LangGraphInterruptEvent' &&
      !interruptEvent?.response;

    return !isInProgress && text.trim().length > 0 && !interruptInProgress;
  }, [copilotContext.langGraphInterruptAction?.event, isInProgress, text]);

  const canStop = useMemo(() => {
    return isInProgress && !hideStopButton;
  }, [isInProgress, hideStopButton]);

  const sendDisabled = !canSend && !canStop;

  return (
    <div
      className={`w-full max-w-4xl mx-auto px-4 pb-4 ${
        showPoweredBy ? 'poweredByContainer' : ''
      }`}
    >
      <div 
        className="relative flex items-end gap-3 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] p-2 pl-4 transition-all focus-within:ring-2 focus-within:ring-purple-500/50"
        onClick={handleDivClick}
      >
        <div className="flex-1 py-3 max-h-[150px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
          <AutoResizingTextarea
            ref={textareaRef}
            placeholder={context.labels.placeholder}
            autoFocus={false}
            maxRows={MAX_NEWLINES}
            value={text}
            className="w-full bg-transparent text-gray-800 dark:text-gray-100 placeholder-gray-400 outline-none border-none resize-none leading-relaxed"
            onChange={(event) => {
              onChange(event.target.value);
              setText(event.target.value);
            }}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey && !isComposing) {
                event.preventDefault();
                if (canSend) {
                  send();
                }
              }
            }}
          />
        </div>
        <div className="flex items-center gap-2 pb-1 pr-1">
          {onUpload && (
            <button 
              onClick={onUpload} 
              className="p-2 text-gray-400 hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-500/10 rounded-xl transition-colors duration-200 outline-none"
              title="Upload media"
            >
              {context.icons.uploadIcon}
            </button>
          )}

          <button
            disabled={sendDisabled}
            onClick={isInProgress && !hideStopButton ? onStop : send}
            data-copilotkit-in-progress={inProgress}
            data-test-id={
              inProgress
                ? 'copilot-chat-request-in-progress'
                : 'copilot-chat-ready'
            }
            className={`p-3 rounded-xl flex items-center justify-center transition-all duration-300 outline-none
              ${
                sendDisabled 
                  ? 'bg-gray-100 dark:bg-[#2a2a2a] text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                  : 'bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer'
              }
            `}
          >
            <div className={`w-5 h-5 flex items-center justify-center ${!sendDisabled && !inProgress ? 'ml-0.5' : ''}`}>
              {buttonIcon}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
