import { useEffect, useReducer } from 'react'
import { audio } from './audio/engine'
import { DayBrief } from './screens/DayBrief'
import { Ending } from './screens/Ending'
import { Intro } from './intro/Intro'
import { Landing } from './screens/Landing'
import { MissionBrief } from './screens/MissionBrief'
import { MissionRunner } from './screens/MissionRunner'
import { NameEntry } from './screens/NameEntry'
import { ResultScreen } from './screens/ResultScreen'
import { MISSIONS } from './game/content'
import { clearSave, loadGame, saveGame } from './game/save'
import {
  gameReducer,
  initialGameState,
  nextMissionAtDayStart,
} from './game/state'

function App() {
  const [state, dispatch] = useReducer(
    gameReducer,
    initialGameState,
    (initial) => loadGame() ?? initial,
  )

  useEffect(() => {
    saveGame(state)
  }, [state])

  useEffect(() => {
    audio.setEnabled(state.soundEnabled)
  }, [state.soundEnabled])

  // Mobile and desktop browsers keep the AudioContext suspended until a real
  // gesture. Unlock it once on the first interaction anywhere in the game.
  useEffect(() => {
    const unlock = () => audio.enable()
    const options: AddEventListenerOptions = { passive: true }
    window.addEventListener('pointerdown', unlock, options)
    window.addEventListener('touchstart', unlock, options)
    window.addEventListener('keydown', unlock)
    return () => {
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('touchstart', unlock)
      window.removeEventListener('keydown', unlock)
    }
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [state.screen, state.currentMission])

  const begin = () => {
    audio.enable()
    audio.setEnabled(state.soundEnabled)
    audio.click()
    dispatch({ type: 'BEGIN' })
  }

  const toggleSound = () => {
    audio.enable()
    dispatch({ type: 'TOGGLE_SOUND' })
  }

  if (state.screen === 'landing') {
    return (
      <Landing
        onBegin={begin}
        onToggleSound={toggleSound}
        soundEnabled={state.soundEnabled}
      />
    )
  }

  if (state.screen === 'intro') {
    return (
      <Intro
        onComplete={() => dispatch({ type: 'FINISH_INTRO' })}
        onToggleSound={toggleSound}
        soundEnabled={state.soundEnabled}
      />
    )
  }

  if (state.screen === 'name') {
    return (
      <NameEntry
        onSubmit={(name) => {
          audio.click()
          dispatch({ type: 'SET_NAME', name })
        }}
      />
    )
  }

  if (state.screen === 'day-brief') {
    return (
      <DayBrief
        onContinue={() =>
          dispatch({
            type: 'OPEN_BRIEF',
            mission: nextMissionAtDayStart(state),
          })
        }
        state={state}
      />
    )
  }

  if (
    state.screen === 'mission-brief' ||
    state.screen === 'mission' ||
    state.screen === 'result'
  ) {
    const missionId =
      state.screen === 'result' ? state.lastMission : state.currentMission
    if (missionId === null) {
      return (
        <DayBrief
          onContinue={() =>
            dispatch({
              type: 'OPEN_BRIEF',
              mission: nextMissionAtDayStart(state),
            })
          }
          state={state}
        />
      )
    }
    const mission = MISSIONS[missionId]

    if (state.screen === 'mission-brief') {
      return (
        <MissionBrief
          mission={mission}
          onStart={() => {
            audio.click()
            dispatch({ type: 'START_MISSION' })
          }}
          state={state}
        />
      )
    }

    if (state.screen === 'mission') {
      return (
        <MissionRunner
          key={mission.id}
          mission={mission}
          onFinish={(outcome) =>
            dispatch({ type: 'COMPLETE_MISSION', outcome })
          }
          onToggleSound={toggleSound}
          soundEnabled={state.soundEnabled}
          state={state}
        />
      )
    }

    return (
      <ResultScreen
        onContinue={() => dispatch({ type: 'CONTINUE_FROM_RESULT' })}
        state={state}
      />
    )
  }

  return (
    <Ending
      onRestart={() => {
        audio.click()
        clearSave()
        dispatch({ type: 'RESTART' })
      }}
      state={state}
    />
  )
}

export default App
