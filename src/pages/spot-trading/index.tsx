import dynamic from "next/dynamic"

const SpotTrading = dynamic(() => import('../../components/App/SpotTrading/SpotTrading'), { ssr: false })

export default function SpotTradingPage() {

  return <SpotTrading />
}
