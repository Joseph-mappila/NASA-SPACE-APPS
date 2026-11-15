import { useEffect, useReducer, useState } from 'react'
import { audio } from './audio/engine'
import { DayBrief } from './screens/DayBrief'
import { Ending } from './screens/Ending'
import { Intro } from './intro/Intro'
import { Landing } from './screens/Landing'
import { MissionBrief } from './screens/MissionBrief'
import { MissionRunner } from './screens/MissionRunner'
import { NameEntry } from './screens/NameEntry'
import { ResultScreen } from './screens/ResultScreen'
import { MinigameScreen } from './minigames/MinigameScreen'
import type { MinigameId } from './minigames/catalog'
import { MISSIONS } from './game/content'
import { clearSave, loadGame, saveGame } from './game/save'
import {
  gameReducer,
  initialGameState,
  nextMissionAtDayStart,
} from './game/state'

function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia?.('(pointer: coarse)').matches ||
    /Android|iPhone|iPad|iPod|Mobile|Silk/i.test(navigator.userAgent)
  )
}

/**
 * Best-effort immersive mode. Browsers only allow fullscreen and orientation
 * locking from a user gesture, so this is invoked from the first tap/keypress.
 * If the browser refuses, the portrait gate below asks the player to rotate.
 */
async function enterMobileFullscreen(): Promise<void> {
  if (typeof document === 'undefined' || !isMobileDevice()) return

  const root = document.documentElement as HTMLElement & {
    webkitRequestFullscreen?: () => Promise<void> | void
  }

  try {
    if (!document.fullscreenElement) {
      if (root.requestFullscreen) {
        await root.requestFullscreen({ navigationUI: 'hide' })
      } else {
        await root.webkitRequestFullscreen?.()
      }
    }
  } catch {
    // Fullscreen can be denied by the browser or an embedding frame.
  }

  const orientation = window.screen.orientation as ScreenOrientation & {
    lock?: (mode: string) => Promise<void>
  }

  try {
    await orientation?.lock?.('landscape')
  } catch {
    // Orientation lock is unsupported on iOS and some Android browsers.
  }
}

function RotateGate() {
  const [portrait, setPortrait] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(orientation: portrait) and (pointer: coarse)')
    const update = () => setPortrait(query.matches)
    update()
    query.addEventListener?.('change', update)
    window.addEventListener('resize', update)
    return () => {
      query.removeEventListener?.('change', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  if (!portrait) return null

  return (
    <div className="rotate-gate" role="dialog" aria-modal="true">
      <div className="rotate-gate__card panel">
        <span aria-hidden="true" className="rotate-gate__icon">
          ↻
        </span>
        <span className="eyebrow">Outpost display</span>
        <h2>Turn the console sideways</h2>
        <p>
          LUNA is built for landscape. Rotate your phone, or tap below to try
          fullscreen landscape again.
        </p>
        <button
          className="btn btn--primary"
          onClick={() => void enterMobileFullscreen()}
          type="button"
        >
          Go fullscreen
        </button>
      </div>
    </div>
  )
}

function Game() {
  const [state, dispatch] = useReducer(
    gameReducer,
    initialGameState,
    (initial) => loadGame() ?? initial,
  )
  const [activeMinigame, setActiveMinigame] = useState<MinigameId | null>(null)

  useEffect(() => {
    saveGame(state)
  }, [state])

  useEffect(() => {
    audio.setEnabled(state.soundEnabled)
  }, [state.soundEnabled])

  // Mobile and desktop browsers keep the AudioContext suspended until a real
  // gesture. The same first gesture is the only chance to request fullscreen
  // and lock the orientation to landscape.
  useEffect(() => {
    let immersiveAttempted = false
    const unlock = () => {
      audio.enable()
      if (!immersiveAttempted) {
        immersiveAttempted = true
        void enterMobileFullscreen()
      }
    }
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

  if (activeMinigame) {
    return (
      <MinigameScreen
        id={activeMinigame}
        onExit={() => setActiveMinigame(null)}
      />
    )
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
        completedOnce={state.completedOnce}
        onPlayMinigame={setActiveMinigame}
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

function App() {
  return (
    <>
      <Game />
      <RotateGate />
    </>
  )
}

export default App
