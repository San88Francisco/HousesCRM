export interface ContractPeriod {
  from: Date
  to: Date
}

export function splitContractIntoPeriods(commencement: Date, termination: Date): ContractPeriod[] {
  const periods: ContractPeriod[] = []

  let currentStart = new Date(commencement)
  const end = new Date(termination)

  while (currentStart < end) {
    const nextPeriod = new Date(currentStart)
    nextPeriod.setMonth(nextPeriod.getMonth() + 3)

    const currentEnd = nextPeriod > end ? end : nextPeriod

    periods.push({
      from: new Date(currentStart),
      to: new Date(currentEnd),
    })

    currentStart = currentEnd
  }

  return periods
}
