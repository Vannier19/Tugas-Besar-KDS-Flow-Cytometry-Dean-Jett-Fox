import type { FitResponse, InitialParameters } from './types'

export type HistogramPreview = {
  rows: number
  minBin: number
  maxBin: number
}

const HEADER_ALIASES = new Set(['bin,count', 'bins,counts'])

function isNumeric(value: string): boolean {
  return value.trim() !== '' && Number.isFinite(Number(value))
}

export function previewHistogramCsv(text: string): HistogramPreview | null {
  const rows = text
    .split(/\r?\n/)
    .map((line) => line.split(',').map((cell) => cell.trim()))
    .filter((row) => row.some((cell) => cell !== ''))

  if (rows.length === 0) {
    return null
  }

  const firstTwo = rows[0].slice(0, 2).map((cell) => cell.toLowerCase()).join(',')
  const dataRows = HEADER_ALIASES.has(firstTwo) ? rows.slice(1) : rows
  const bins: number[] = []

  for (const row of dataRows) {
    const nonEmpty = row.filter((cell) => cell !== '')
    if (nonEmpty.length !== 2 || !isNumeric(nonEmpty[0]) || !isNumeric(nonEmpty[1])) {
      return null
    }
    bins.push(Number(nonEmpty[0]))
  }

  if (bins.length < 3) {
    return null
  }

  return {
    rows: bins.length,
    minBin: Math.min(...bins),
    maxBin: Math.max(...bins),
  }
}

export function manualParameterError(
  enabled: boolean,
  g1Mean: string,
  g2Mean: string,
): string | null {
  if (!enabled) {
    return null
  }
  const g1 = Number(g1Mean)
  const g2 = Number(g2Mean)
  if (!Number.isFinite(g1) || !Number.isFinite(g2)) {
    return 'Isi nilai G1 dan G2/M terlebih dahulu.'
  }
  if (g2 <= g1) {
    return 'G2/M mean harus lebih besar dari G1 mean.'
  }
  return null
}

export function initialParametersFromInputs(enabled: boolean, g1Mean: string, g2Mean: string): InitialParameters | undefined {
  if (!enabled) {
    return undefined
  }
  return {
    g1_mean: Number(g1Mean),
    g2_mean: Number(g2Mean),
  }
}

export function boundsFromResult(result: FitResponse | null): HistogramPreview | null {
  if (!result || result.series.bins.length === 0) {
    return null
  }
  return {
    rows: result.series.bins.length,
    minBin: Math.min(...result.series.bins),
    maxBin: Math.max(...result.series.bins),
  }
}

export function formatNumber(value: number | null | undefined, digits = 2): string {
  if (value == null || !Number.isFinite(value)) {
    return 'n/a'
  }
  return value.toLocaleString('en-US', {
    maximumFractionDigits: digits,
  })
}

export function percent(value: number): string {
  return `${formatNumber(value, 1)}%`
}
