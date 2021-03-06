import { themedClass } from "../core/theme.js";
import { h } from "../resources/libs/preact.js";

export default function AnswerButton(props) {
  return h(
    'button',
    {
      class: themedClass('roumaji-answer' + (props.failed ? ' failed' : '')),
      onClick: () => props.onClick(props.answer),
      disabled: props.failed,
    },
    props.answer?.roumaji
  )
}