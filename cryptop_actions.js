
//------------------------------------------------------------------ Actions ---
// Actions appelées dans le code HTML quand des événements surviennent
//
actions = {

  //------------------------------- Initialisation et chargement des données ---

  async initAndGo(initialConfig) {
    console.log('initAndGo: ', initialConfig);

    if (initialConfig.config.dataMode == 'online') {
      const params = {
        target : initialConfig.config.targets.wished,
        debug  : initialConfig.config.debug,
      };
      let coinlayerData = await coinlayerRequest(params);
      if (coinlayerData.success) {
        initialConfig.data.online = coinlayerData;
      } else {
        console.log('initAndGo: Données en ligne indisponibles');
        console.log('initAndGo: BASCULEMENT EN MODE HORS-LIGNE');
        initialConfig.config.dataMode = 'offline';
      }
    }
  model.samPresent({do:'init', config:initialConfig});
  },

  reinit(data) {
    const initialConfigName =  data.e.target.value;
    configsSelected = initialConfigName;
    actions.initAndGo(configs[initialConfigName]);
  },

  async updateOnlineCurrenciesData(data) {
    const params = {
      debug  : data.debug,
      target : data.target,
    };
    let coinlayerData = await coinlayerRequest(params);
    if (coinlayerData.success) {
      model.samPresent({do:'updateCurrenciesData', currenciesData: coinlayerData});
    } else {
      console.log('updateOnlineCurrenciesData: Données en ligne indisponibles');
      console.log('updateOnlineCurrenciesData: BASCULEMENT EN MODE HORS-LIGNE');
      model.samPresent({do:'changeDataMode', dataMode:'offline'});
    }
  },

  //----------------------------------------------------------- CurrenciesUI ---

  // TODO: ajoutez vos fonctions...
  rowsPerPage(data){
    model.samPresent({do:'rowsPerPage', value: data.v, currency: data.currency});
  },
  changePage(data){
    model.samPresent({do:'changePage', index: data.index, currency: data.currency});
  },

  previousPage(data){
    model.samPresent({do:'previousPage', index: data.index, currency: data.currency});
  },
  nextPage(data){
    model.samPresent({do:'nextPage', index:data.index, currency: data.currency});
  },
  //----------------------------------------------- CurrenciesUI et WalletUI ---
  changeTab(data) {
    model.samPresent({do:'changeTab', ...data});
  },
  sort(data){
    model.samPresent({do:'sort', ...data});
  },
  
  
  //----------------------------------------------------------- CurrenciesUI ---

  // TODO: ajoutez vos fonctions...
  changeFiats(data){
    model.samPresent({do:'changeFiats', ...data});
  },

  changeCryptos(data){
    model.samPresent({do:'changeCryptos', ...data});
  },

  changeFilter(data){
    model.samPresent({do:'changeFilter', ...data});
  },

  changePrice(data){
    model.samPresent({do:'changePrice', ...data});
  },
  //---------------------------------------------------------- PreferencesUI ---

  changeTarget(data) {
    data.target = data.e.target.value;
    delete data.e;
    this.updateOnlineCurrenciesData(data)
  },

  changeDataMode(data) {
    data.dataMode = data.e.target.value;
    delete data.e;
    if (data.dataMode == 'online') {
      this.updateOnlineCurrenciesData(data)
    }
    model.samPresent({do:'changeDataMode', ...data});
  },

  //--------------------------------------------------------------- WalletUI ---

  changeQuantitee(data){
    model.samPresent({do: 'changeQuantitee', ...data});
  },
  // TODO: ajoutez vos fonctions...

};
