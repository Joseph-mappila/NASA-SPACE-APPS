// ══════════════════════════════════════════
// Master Dialogue Registry
// Junior Astronaut Mission Trainer
// ══════════════════════════════════════════
import act1Dialogues from './act1';
import act2Dialogues from './act2';

export const ACT_DIALOGUES = {
  1: act1Dialogues,
  2: act2Dialogues,
};

export function getDialogueNode(actNumber, id) {
  if (ACT_DIALOGUES[actNumber]?.[id]) {
    return ACT_DIALOGUES[actNumber][id];
  }
  // Fallback across all acts if node id is unique
  for (const act of Object.values(ACT_DIALOGUES)) {
    if (act[id]) return act[id];
  }
  return null;
}

export { act1Dialogues, act2Dialogues };
export default ACT_DIALOGUES;
