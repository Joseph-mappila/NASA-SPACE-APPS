export function SourceDrawer() {
  return (
    <details className="source-drawer">
      <summary>Why did this happen? <span>NASA source</span></summary>
      <div className="source-drawer__content">
        <p>
          NASA’s DONKI database recorded a solar energetic particle event on May 10, 2024 using the
          GOES-P SEISS instrument. This archived event inspired the warning in this training chapter.
        </p>
        <p>
          <strong>Game simplification:</strong> the record is not a Mars radiation forecast or dose
          calculation. The game uses it to teach that crews need warning procedures, physical shielding,
          and powered shelter systems.
        </p>
        <a href="https://ccmc.gsfc.nasa.gov/DONKI/view/SEP/30677/-1" rel="noreferrer" target="_blank">
          Open the NASA DONKI event
        </a>
      </div>
    </details>
  )
}

