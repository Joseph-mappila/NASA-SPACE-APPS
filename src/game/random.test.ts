import { afterEach, describe, expect, it, vi } from 'vitest'
import { shuffled } from './random'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('shuffled', () => {
  it('keeps every item and leaves the source untouched', () => {
    const source = [1, 2, 3, 4, 5]
    const result = shuffled(source)

    expect(source).toEqual([1, 2, 3, 4, 5])
    expect([...result].sort((a, b) => a - b)).toEqual(source)
  })

  it('reorders the list when the random source moves items', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)

    expect(shuffled([1, 2, 3, 4])).toEqual([2, 3, 4, 1])
  })

  it('keeps the order when the random source picks each item in place', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.9999)

    expect(shuffled([1, 2, 3, 4])).toEqual([1, 2, 3, 4])
  })
})
