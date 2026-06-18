// Gold "enter" affordance (desktop + touch): a chevron chip + a caption, together as ONE real
// <button>. The button owns the hover lift + open transform; the inner wrapper owns the resting
// bob, so they compose without fighting. The caption is decorative (aria-hidden).
const ENTER_LABEL = 'Enter portfolio'; // announced accessible label (unchanged)
const ARROW_LABEL = 'Step inside'; // decorative caption under the chevron

export default function CurtainOpenButton({ onOpen, opening }) {
  return (
    <button
      type="button"
      className={`curtain-arrow${opening ? ' curtain-arrow--opening' : ''}`}
      aria-label={ENTER_LABEL}
      onClick={onOpen}
      disabled={opening}
    >
      <span className="curtain-arrow-inner">
        <span className="curtain-arrow-chip">
          <svg
            className="curtain-arrow-chevron"
            width="34"
            height="34"
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M5 9l7 7 7-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className="curtain-arrow-caption" aria-hidden="true">
          {ARROW_LABEL}
        </span>
      </span>
    </button>
  );
}
