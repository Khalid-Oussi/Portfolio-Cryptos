
//-------------------------------------------------------------------- Model ---
// Unique source de vérité de l'application
//
model = {

  config: {},
  data : {},
  ui   : {},

  // Demande au modèle de se mettre à jour en fonction des données qu'on
  // lui présente.
  // l'argument data est un objet confectionné dans les actions.
  // Les propriétés de data apportent les modifications à faire sur le modèle.
  samPresent(data) {

    switch (data.do) {

      case 'init': {
        Object.assign(this, data.config);
        const conf = this.config;
        conf.targets.list = mergeUnique([conf.targets.wished], conf.targets.list).sort();
        const isOnline = conf.dataMode == 'online';
        conf.targets.active = isOnline ? conf.targets.wished : this.data.offline.live.target;
        this.hasChanged.currencies = true;
        if (conf.debug) console.log('model.samPresent - init - targets.list  : ', conf.targets.list);
        if (conf.debug) console.log('model.samPresent - init - targets.active: ', conf.targets.active);
      } break;

      case 'updateCurrenciesData': {
        this.data.online = data.currenciesData;
        this.config.targets.active = data.currenciesData.live.target;
        this.hasChanged.currencies = true;
      } break;

      case 'changeDataMode': {
        this.config.dataMode = data.dataMode;
        if (data.dataMode == 'offline') {
          this.config.targets.active = this.data.offline.live.target;
          this.hasChanged.currencies = true;
        }
      } break;

      case 'changeTab': {
        switch (data.tab) {
          case 'currenciesCryptos':
            this.ui.currenciesCard.selectedTab = 'cryptos';
            break;
          case 'currenciesFiats':
            this.ui.currenciesCard.selectedTab = 'fiats';
            break;
          case 'walletPortfolio':
            this.ui.walletCard.selectedTab = 'portfolio';
            break;
          case 'walletAjouter':
            this.ui.walletCard.selectedTab = 'ajouter';
            break;
            default:
        }
        
      } break;

      case 'rowsPerPage':{
            this.ui.currenciesCard.tabs[data.currency].pagination.rowsPerPageIndex = data.value;
            this.hasChanged[data.currency].pagination = true;
            }break;

      case 'changePage':{
            this.ui.currenciesCard.tabs[data.currency].pagination.currentPage = data.index;
            this.hasChanged[data.currency].pagination = true;
            }break; 
      case  'previousPage':{
            this.ui.currenciesCard.tabs[data.currency].pagination.currentPage = Math.max(1, data.index-1);
            this.hasChanged[data.currency].pagination = true;
            }break;
      case 'nextPage':{
            let nbPage = this.ui.currenciesCard.tabs[data.currency].pagination.maxPages;
            this.ui.currenciesCard.tabs[data.currency].pagination.currentPage = Math.min(data.index+1, nbPage);
            this.hasChanged[data.currency].pagination = true;
            }break;
      case 'changeFiats':{
            if (this.config.targets.list.includes(data.code)) {
              this.config.targets.list = this.config.targets.list.filter(v => v != data.code);
            } else {
              this.config.targets.list.push(data.code);
              this.config.targets.list.sort();
            }
            }break;
      case 'changeCryptos':{
            if (!this.config.coins[data.code]) {
              this.config.coins[data.code] = {
                'quantity': 0,
                'quantityNew':''
              };
              this.hasChanged.coins = true;
            } else if ((this.config.coins[data.code].quantity == 0) && (this.config.coins[data.code].quantityNew == '') ){
              delete this.config.coins[data.code];
              this.hasChanged.coins = true;
            }
            }break;
      
      case 'changeFilter':{
        this.ui.currenciesCard.tabs[data.currency].filters.text = data.e.target.value;
        this.ui.currenciesCard.tabs[data.currency].pagination.currentPage = 1;
        this.hasChanged[data.currency].filter = true;
      }break;
      
      case 'changePrice':{
        this.ui.currenciesCard.tabs.cryptos.filters.price = data.e.target.value;
        this.ui.currenciesCard.tabs.cryptos.pagination.currentPage = 1;
        this.hasChanged.cryptos.filter = true;

      }break;
      
      case 'sort':{
        if (this.ui.currenciesCard.tabs[data.currency].sort.column == data.col) {
          this.ui.currenciesCard.tabs[data.currency].sort.incOrder[data.col] = !this.ui.currenciesCard.tabs[data.currency].sort.incOrder[data.col];
        }
        this.ui.currenciesCard.tabs[data.currency].sort.column = data.col;
        this.ui.currenciesCard.tabs[data.currency].pagination.currentPage = 1;
        this.hasChanged[data.currency].sort = true;
        this.hasChanged[data.currency].pagination = true;
      }break;

      case 'changeQuantitee':{
        this.config.coins[data.code].quantityNew = data.e.target.value;
        this.hasChanged.coins = true;
      }break;

      // TODO: ajoutez des cas répondant à vos actions...


      default:
        console.error(`model.samPresent(), unknown do: '${data.do}' `);
    }
    // Demande à l'état de l'application de prendre en compte la modification
    // du modèle
    state.samUpdate(this);
  }
};
