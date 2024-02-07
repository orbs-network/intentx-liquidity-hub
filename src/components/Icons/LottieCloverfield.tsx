import Lottie from 'react-lottie'
import * as animationData from 'constants/lottie/cloverfield-loading.json'

export default function LottieCloverfield({ height = 175, width = 135 }: { height?: number; width?: number }) {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  }

  return <Lottie options={defaultOptions} height={height} width={width} />
}
