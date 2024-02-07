import CoinStackReward from '/public/static/images/coin-stack-reward.png'
import CoinStacksReward from '/public/static/images/coin-stacks-reward.png'
import MultipleCoinReward from '/public/static/images/multi-coin-reward.png'
import SingleCoinReward from '/public/static/images/single-coin-reward.png'

export const rewardsData = (tradingStreak: number) => {
  return [
    {
      dayNumber: 1,
      rewardImage: SingleCoinReward,
      rewardBonus: 5,
      isUnlocked: tradingStreak >= 1,
      isToday: tradingStreak === 1,
    },
    {
      dayNumber: 2,
      rewardImage: SingleCoinReward,
      rewardBonus: 10,
      isUnlocked: tradingStreak >= 2,
      isToday: tradingStreak === 2,
    },
    {
      dayNumber: 3,
      rewardImage: MultipleCoinReward,
      rewardBonus: 15,
      isUnlocked: tradingStreak >= 3,
      isToday: tradingStreak === 3,
    },
    {
      dayNumber: 4,
      rewardImage: MultipleCoinReward,
      rewardBonus: 20,
      isUnlocked: tradingStreak >= 4,
      isToday: tradingStreak === 4,
    },
    {
      dayNumber: 5,
      rewardImage: CoinStackReward,
      rewardBonus: 25,
      isUnlocked: tradingStreak >= 5,
      isToday: tradingStreak === 5,
    },
    {
      dayNumber: 6,
      rewardImage: CoinStackReward,
      rewardBonus: 30,
      isUnlocked: tradingStreak >= 6,
      isToday: tradingStreak === 6,
    },
    {
      dayNumber: 7,
      rewardImage: CoinStacksReward,
      rewardBonus: 35,
      isUnlocked: tradingStreak >= 7,
      isToday: tradingStreak >= 7,
    },
  ]
}
