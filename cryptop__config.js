const configInitialModel = {
  config: {  //==================================== Main User Config ===
    debug: true,         // print debug info?
    dataMode: 'offline',  // in ['online', 'offline']
    coins: [
      {symbol:'BTC', quantity: 0.027, quantityNew: -1},
      {symbol:'ETH', quantity: 1.9  , quantityNew: -1},
      {symbol:'LTC', quantity: 2.8  , quantityNew: -1},
      {symbol:'DSH', quantity: 0    , quantityNew: 0.5},
    ],
    target: 'USD',  // replaced with avalaible target when offline
    fiatTargets: ['GBP', 'CUP', 'JEP', 'TTD'],
    // selections: {
    //   cryptos: ['BCH', 'BTC', 'BTLC'],
    //   fiats:   ['GBP', 'CUP', 'JEP', 'TTD'],
    // },
  },
  data: {  //========================================================== data ===
    offline: {
      list: dataCoinlayerList,     // coins and fiat currencies lists
      live: dataCoinlayerLive,     // current rates of coins
    },
    online : {
      list: {},     // coins and fiat currencies lists
      live: {},     // current rates of coins
    },
    fiatsInfo: dataFiatCurrencies,
    hasChanged: true,
  },
  ui: {  //================================================== User Interface ===
    sectionId: 'appId',

    currenciesCard: {  //----------------------------------- Currencies Card ---
      hasChanged: true,
      selectedTab: 'fiats',  // in ['cryptos', 'fiats']
      tabs: {
        cryptos: {  //.......................................... Cryptos Tab ...
          filters: {
            text: 'coin',
            price: 5,
          },
          table: {
            sort: {
              column: 0,
              increasing: [true, true, true, true],
            },
          },
          // selected: undefined,  // array deduced from config coins and selections
          pagination: {
            rowsPerPage: [5, 10, 15],
            perPageSelected: 0,
            currentPage: 2,
          },
        },
        fiats: {  //.............................................. Fiats Tab ...
          filters: {
            text: 'dollar',
          },
          table: {
            sort: {
              column: 0,
              increasing: [true, true, true],
            },
          },
          // selected: undefined,  // array deduced from config target and selections
          pagination: {
            rowsPerPage: [5, 10, 15],
            perPageSelected: 2,
            currentPage: 2,
          },
        },
      },
    },

    preferencesCard: { //---------------------------------- Preferences Card ---
      // target: undefined,    // deduced from config.target
      update: {
        // online: undefined,  // deduced from config.onlineData
        periods: [
          ['0' , 'Manuelle'   ],
          ['10', '10 secondes'],
          ['60', '1 minute'   ],
        ],
        periodSelected: '0',
      },
    },

    walletCard: { //-------------------------------------------- Wallet Card ---
      selectedTab: 'portfolio',  // in ['portfolio', 'ajouter']
      wallet: {
        hasChanged: true,
        coinsList: [],
      },
    },
  },
};
