import React from 'react';
import EVARepair     from './EVARepair';
import OxygenGarden  from './OxygenGarden';
import SolarPanel    from './SolarPanel';
import Navigation    from './Navigation';

// Add more minigames here as the team builds them
const MINIGAME_MAP = {
  evaRepair:    EVARepair,
  oxygenGarden: OxygenGarden,
  solarPanel:   SolarPanel,
  navigation:   Navigation,
  // sampleLab:    SampleLab,     // TODO: Team member can build this
};

export default function MinigameRouter({ id }) {
  const Component = MINIGAME_MAP[id];
  if (!Component) {
    return (
      <div style={{ color: 'var(--color-alert)', fontFamily: 'var(--font-mono)', fontSize: '1rem', textAlign: 'center' }}>
        ⚠️ Minigame "{id}" not yet implemented.<br />
        <small style={{ opacity: 0.6 }}>Team: add it to MinigameRouter.jsx</small>
      </div>
    );
  }
  return <Component />;
}
