# Intentx Interface V0.82

# Branches

`main` -> Deployed version

`develop` -> branch for develop new features

`test-new-main` -> this branch from `develop` for test features in ftm(Ready For launch)

`ftm-test-net` -> this branch merged with `feature/muon` for test feature in ftm(with test token & test contract)

`bsc-previous-contract` -> this branch is for withdraw assets on thena

`feature/quote-history-pagination` -> new pagination for history

### Setup

`yarn set version stable`

`yarn install`

### Run

We don't require any env variables in order to run the app. Simply run `npm run dev` and open your app on localhost:3000!

### Docker

`docker build -t <imageName> .`
`docker run -p 3000:3000 -it <processName>`
This front was built using [localhost:3000](http://localhost:3000/trade/BTCUSDT)

