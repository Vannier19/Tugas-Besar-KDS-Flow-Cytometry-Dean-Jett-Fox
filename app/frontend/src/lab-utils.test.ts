import { describe, expect, it } from 'vitest'
import { manualParameterError, previewHistogramCsv } from './lab-utils'

describe('lab utilities', () => {
  it('previews supported CSV formats', () => {
    expect(previewHistogramCsv('bin,count\n10,4\n20,8\n30,5\n')).toEqual({
      rows: 3,
      minBin: 10,
      maxBin: 30,
    })
    expect(previewHistogramCsv('10,4\n20,8\n30,5\n')).toEqual({
      rows: 3,
      minBin: 10,
      maxBin: 30,
    })
  })

  it('rejects preview when values are malformed', () => {
    expect(previewHistogramCsv('bin,count\n10,4\n20,nope\n30,5\n')).toBeNull()
    expect(previewHistogramCsv('bin,count\n10,4\n')).toBeNull()
  })

  it('validates manual parameter ordering', () => {
    expect(manualParameterError(false, '', '')).toBeNull()
    expect(manualParameterError(true, '', '')).toContain('G1')
    expect(manualParameterError(true, '20', '10')).toContain('G2/M')
    expect(manualParameterError(true, '10', '20')).toBeNull()
  })
})
