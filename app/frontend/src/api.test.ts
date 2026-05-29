import { describe, expect, it } from 'vitest'
import { buildCsvFormData, buildFitPayload } from './api'

describe('api payload helpers', () => {
  it('builds dataset fit payloads with optional manual parameters', () => {
    expect(buildFitPayload('zenodo-14928071-ai-0')).toEqual({
      dataset_id: 'zenodo-14928071-ai-0',
    })
    expect(buildFitPayload('zenodo-14928071-ai-0', { g1_mean: 12, g2_mean: 24 })).toEqual({
      dataset_id: 'zenodo-14928071-ai-0',
      initial_parameters: {
        g1_mean: 12,
        g2_mean: 24,
      },
    })
  })

  it('builds CSV multipart payloads', () => {
    const file = new File(['bin,count\n1,2\n2,3\n3,4\n'], 'histogram.csv', { type: 'text/csv' })
    const formData = buildCsvFormData(file, { g1_mean: 10, g2_mean: 20 })

    expect(formData.get('file')).toBe(file)
    expect(formData.get('g1_mean')).toBe('10')
    expect(formData.get('g2_mean')).toBe('20')
  })
})
