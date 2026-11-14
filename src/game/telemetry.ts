import type { GameState } from './types'

export type TelemetryTone = 'good' | 'warn' | 'bad'

export type TelemetryReading = {
  id: string
  label: string
  value: string
  unit: string
  tone: TelemetryTone
  detail: string
  limit: string
  source: string
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

function toneHighIsGood(value: number, warn: number, bad: number): TelemetryTone {
  if (value <= bad) return 'bad'
  if (value <= warn) return 'warn'
  return 'good'
}

function toneLowIsGood(value: number, warn: number, bad: number): TelemetryTone {
  if (value >= bad) return 'bad'
  if (value >= warn) return 'warn'
  return 'good'
}

function formatNumber(value: number, digits = 0): string {
  return value.toLocaleString('en-US', {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  })
}

/**
 * Converts the gameplay percentages into the physical values NASA uses.
 * The gameplay numbers stay authoritative; this module only presents them.
 */
export function buildTelemetry(state: GameState) {
  const { resources, flags, outcomes } = state
  const oxygen = clamp(resources.oxygen, 0, 100)
  const waterFood = clamp(resources.waterFood, 0, 100)
  const power = clamp(resources.power, 0, 100)
  const crew = clamp(resources.crewHealth, 0, 100)

  const leakDrop = flags.oxygenLeak ? 0.4 : 0
  const pressure = 8.2 - leakDrop
  const ppO2 = Math.round((145 * oxygen) / 100)
  const scrubberFixed = outcomes[5]?.status === 'passed'
  const ppCO2 = flags.co2Penalty
    ? 4.6
    : state.day === 58 && !scrubberFixed
      ? 3.4
      : 1.8

  const waterReserve = Math.round((1200 * waterFood) / 100)
  const dailyWater = 2.5 * 15
  const waterDays = Math.max(0, Math.round(waterReserve / dailyWater))
  const waterRecovery = outcomes[2]?.status === 'passed' ? 98 : 93

  const foodDays = Math.max(0, Math.round((30 * waterFood) / 100))
  const powerAvailable = 8 * (power / 100)

  const shelterDone = outcomes[4] !== undefined
  const requiredCoverage = flags.shieldTiles >= 6 ? 93 : 80
  const shielded = shelterDone && flags.shelterCoverage >= requiredCoverage
  const radiation = shelterDone && !shielded ? 268 : 42
  const crewAlive = crew >= 90 ? 15 : Math.max(0, Math.round((crew / 100) * 15))
  const temperature = flags.brownout ? 21.2 : flags.co2Penalty ? 23.4 : 22

  const ppO2Tone: TelemetryTone =
    ppO2 >= 145 && ppO2 <= 155
      ? 'good'
      : ppO2 >= 130
        ? 'warn'
        : 'bad'
  const ppCO2Tone = toneLowIsGood(ppCO2, 3.01, 4.5)
  const pressureTone = toneHighIsGood(pressure, 8.0, 7.6)
  const waterTone = toneHighIsGood(waterFood, 50, 20)
  const powerTone = toneHighIsGood(power, 70, 35)
  const foodTone = toneHighIsGood(waterFood, 60, 25)
  const crewTone = toneHighIsGood(crew, 90, 60)
  const radiationTone: TelemetryTone = radiation < 250 ? 'good' : 'bad'
  const temperatureTone: TelemetryTone =
    temperature >= 18 && temperature <= 26 ? 'good' : 'warn'

  const primary: TelemetryReading[] = [
    {
      id: 'oxygen',
      label: 'Oxygen',
      value: formatNumber(ppO2),
      unit: 'mmHg',
      tone: ppO2Tone,
      detail: `Inspired oxygen partial pressure. ${formatNumber(oxygen)}% of the outpost oxygen reserve remains.`,
      limit: 'Normoxia target: 145–155 mmHg',
      source: 'NASA-STD-3001 V2 6003 · OCHMO-TB-002',
    },
    {
      id: 'co2',
      label: 'Carbon dioxide',
      value: formatNumber(ppCO2, 1),
      unit: 'mmHg',
      tone: ppCO2Tone,
      detail: 'Average carbon dioxide partial pressure in the cabin air.',
      limit: 'Keep the 1-hour average below 3.0 mmHg',
      source: 'NASA-STD-3001 V2 6004 · OCHMO CO₂ brief',
    },
    {
      id: 'water',
      label: 'Water',
      value: formatNumber(waterReserve),
      unit: 'L',
      tone: waterTone,
      detail: `About ${waterDays} days at 37.5 L/day for 15 crew. ${waterRecovery}% of water is recycled.`,
      limit: '2.5 L drinking water per crewmember per day',
      source: 'NASA-STD-3001 V2 6109 · ISS ECLSS 98% recovery',
    },
    {
      id: 'power',
      label: 'Power',
      value: formatNumber(power),
      unit: '%',
      tone: powerTone,
      detail: `${formatNumber(powerAvailable, 1)} kW available from the outpost battery bus.`,
      limit: 'Keep the battery above 35% during storm operations',
      source: 'Outpost 57 battery plan · NASA Moon-to-Mars power architecture',
    },
  ]

  const secondary: TelemetryReading[] = [
    {
      id: 'pressure',
      label: 'Cabin pressure',
      value: formatNumber(pressure, 1),
      unit: 'psia',
      tone: pressureTone,
      detail: flags.oxygenLeak
        ? 'Airlock leak is lowering cabin pressure. Repair the seal.'
        : 'Cabin pressure is holding at the exploration atmosphere setpoint.',
      limit: '8.2 psia exploration atmosphere',
      source: 'NASA exploration atmosphere · OCHMO habitable-atmosphere brief',
    },
    {
      id: 'food',
      label: 'Food',
      value: formatNumber(foodDays),
      unit: 'days',
      tone: foodTone,
      detail: 'Packaged food remaining for the 15-person crew.',
      limit: 'Resupply is planned after lunar night',
      source: 'Outpost 57 logistics plan',
    },
    {
      id: 'crew',
      label: 'Crew',
      value: `${crewAlive}/15`,
      unit: 'safe',
      tone: crewTone,
      detail: `Crew health is at ${formatNumber(crew)}%. Radiation dose is ${radiation} mSv.`,
      limit: 'Solar particle event limit: 250 mSv per event',
      source: 'NASA-STD-3001 V1 4031 · OCHMO-TB-020',
    },
    {
      id: 'radiation',
      label: 'Radiation',
      value: formatNumber(radiation),
      unit: 'mSv',
      tone: radiationTone,
      detail: shelterDone
        ? shielded
          ? 'Storm shelter shielding kept the crew below the event limit.'
          : 'Shelter coverage was too low. Crew dose exceeded the event limit.'
        : 'Dose is low. The solar particle event has not started yet.',
      limit: 'Stay below 250 mSv for this event',
      source: 'NASA-STD-3001 V1 4031 · OCHMO-TB-020',
    },
    {
      id: 'temperature',
      label: 'Cabin temp',
      value: formatNumber(temperature, 1),
      unit: '°C',
      tone: temperatureTone,
      detail: 'Cabin temperature inside the crew habitat.',
      limit: '22 °C nominal setpoint',
      source: 'Outpost 57 thermal control',
    },
  ]

  return {
    primary,
    secondary,
    pressure,
    ppO2,
    ppCO2,
    waterReserve,
    waterDays,
    waterRecovery,
    power,
    powerAvailable,
    foodDays,
    radiation,
    crewAlive,
    temperature,
  }
}
