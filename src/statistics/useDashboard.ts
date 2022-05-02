import { useQuery } from "@apollo/client"
import { getTime, startOfMinute, subDays } from "date-fns"
import { useState } from "react"
import { STATISTICS } from "./gqldocs"
import { useStats } from "./useStats"
import useStatsClient from "./useStatsClient"

export enum StatsNetwork {
  COMBINE = "COMBINE",
  TERRA = "BSC",
  ETH = "ETH",
}

export default (initial = StatsNetwork.TERRA) => {
  const [network, setNetwork] = useState<StatsNetwork>(initial)
  const { getDashboard, store } = useStats()

  const now = getTime(startOfMinute(new Date()))
  const genesis = getTime(startOfMinute(subDays(new Date(), 100)))
  const client = useStatsClient()

  const result = useQuery<{ statistic: Dashboard }>(STATISTICS, {
    variables: { from: genesis, to: now, network: network.toUpperCase() },
    client,
    onCompleted: ({ statistic }) => store.dashboard(statistic, network),
  })

  return { ...result, dashboard: getDashboard(network), network, setNetwork }
}
