import { useState } from "react";

const modes = [
  {
    label: "Working tree",
    command: "mortis review --progress",
    detail:
      "Review staged, unstaged, and eligible untracked files against HEAD.",
  },
  {
    label: "Staged changes",
    command: "mortis review --staged",
    detail: "Review only the changes in your Git index.",
  },
  {
    label: "Branch",
    command: "mortis review --base main --head HEAD",
    detail: "Review changes from the common ancestor to your branch tip.",
  },
  {
    label: "Full repository",
    command: "mortis review --all",
    detail: "Review every eligible tracked file at the current commit.",
  },
];

export default function ReviewCommands() {
  const [selected, setSelected] = useState(0);
  const mode = modes[selected];

  return (
    <div className="command-demo">
      <div
        className="command-modes"
        role="group"
        aria-label="Choose a review scope"
      >
        {modes.map((item, index) => (
          <button
            key={item.label}
            type="button"
            aria-pressed={selected === index}
            onClick={() => setSelected(index)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="command-content" aria-live="polite" aria-atomic="true">
        <pre>
          <span aria-hidden="true">$ </span>
          <code>{mode.command}</code>
        </pre>
        <p>{mode.detail}</p>
      </div>
      <div className="command-footnote">
        Run the command inside your Git repository.
      </div>
    </div>
  );
}
