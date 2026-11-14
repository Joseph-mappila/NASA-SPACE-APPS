import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './DialogueBox.module.css';

const POPOVER_MAX_WIDTH = 320;
const EDGE_PADDING = 12;
const GAP = 8;

function isHoverDevice() {
  return window.matchMedia('(hover: hover)').matches;
}

function getPopoverPosition(element) {
  const rect = element.getBoundingClientRect();
  const width = Math.min(POPOVER_MAX_WIDTH, window.innerWidth - EDGE_PADDING * 2);
  const centred = rect.left + rect.width / 2 - width / 2;
  const left = Math.min(
    Math.max(centred, EDGE_PADDING),
    window.innerWidth - width - EDGE_PADDING
  );

  // Open upwards when the term is in the lower half of the screen so the
  // card never runs off the bottom edge.
  return rect.bottom > window.innerHeight * 0.55
    ? { left, width, bottom: window.innerHeight - rect.top + GAP }
    : { left, width, top: rect.bottom + GAP };
}

export default function GlossaryTerm({ term, termKey, data, onSeen }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [position, setPosition] = useState(null);
  const termRef = useRef(null);
  const closeTimer = useRef(null);

  // Remember the term as explained so later mentions are plain text.
  useEffect(() => {
    if (termKey) onSeen?.(termKey);
  }, [termKey, onSeen]);

  function cancelScheduledClose() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  function scheduleClose() {
    cancelScheduledClose();
    closeTimer.current = setTimeout(() => setOpen(false), 180);
  }

  function openPopover() {
    cancelScheduledClose();
    if (!termRef.current) return;
    setPosition(getPopoverPosition(termRef.current));
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;

    if (termRef.current) setPosition(getPopoverPosition(termRef.current));

    function handlePointerDown(event) {
      if (termRef.current?.contains(event.target)) return;
      if (event.target.closest?.('[data-glossary-popover]')) return;
      setOpen(false);
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') setOpen(false);
    }

    const closeOnViewportChange = () => setOpen(false);

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', closeOnViewportChange, true);
    window.addEventListener('resize', closeOnViewportChange);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', closeOnViewportChange, true);
      window.removeEventListener('resize', closeOnViewportChange);
    };
  }, [open]);

  useEffect(() => {
    if (!open) setExpanded(false);
  }, [open]);

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  return (
    <span className={styles.termWrap} ref={termRef}>
      <button
        type="button"
        className={styles.term}
        aria-expanded={open}
        onClick={(event) => {
          // Keep the dialogue box from treating this as a "skip text" tap.
          event.stopPropagation();
          if (open) setOpen(false);
          else openPopover();
        }}
        onMouseEnter={() => { if (isHoverDevice()) openPopover(); }}
        onMouseLeave={() => { if (isHoverDevice()) scheduleClose(); }}
      >
        {term}
      </button>

      {open && position && createPortal(
        <div
          data-glossary-popover
          className={styles.popover}
          style={position}
          role="dialog"
          aria-label={`${term} definition`}
          onClick={(event) => event.stopPropagation()}
          onMouseEnter={() => { if (isHoverDevice()) cancelScheduledClose(); }}
          onMouseLeave={() => { if (isHoverDevice()) scheduleClose(); }}
        >
          <div className={styles.popoverTitle}>{term}</div>
          <p className={styles.popoverSimple}>{data.simple}</p>
          {data.deep && (
            expanded ? (
              <div className={styles.popoverDeep}>
                <p>{data.deep}</p>
                {data.source && (
                  <p className={styles.popoverSource}>Source: {data.source}</p>
                )}
              </div>
            ) : (
              <button
                type="button"
                className={styles.popoverMore}
                onClick={() => setExpanded(true)}
              >
                Want more? 🔍
              </button>
            )
          )}
        </div>,
        document.body
      )}
    </span>
  );
}
