
//--------------------------------------------------------------------- View ---
// Génération de portions en HTML et affichage
//
view = {

  // Injecte le HTML dans une balise de la page Web.
  samDisplay(sectionId, representation) {
    const section = document.getElementById(sectionId);
    section.innerHTML = representation;
  },

  // Astuce : Pour avoir la coloration syntaxique du HTML avec l'extension lit-html dans VSCode
  // https://marketplace.visualstudio.com/items?itemName=bierner.lit-html
  // utiliser this.html`<h1>Hello World</h1>` en remplacement de `<h1>Hello World</h1>`
  html([str, ...strs], ...vals) {
    return strs.reduce((acc, v, i) => acc + vals[i] + v, str);
  },

  // Renvoit le HTML de l'interface complète de l'application
  appUI(model, state) {
    const configsChooserHTML = this.configsChooserUI();
    return this.html`
    <div class="container">
      ${configsChooserHTML}
      <h1 class="text-center">Portfolio Cryptos</h1>
      <br />
      <div class="row">
        <div class="col-lg-6">
            ${state.representations.currencies}
        <br />
        </div>

        <div class="col-lg-6">
          ${state.representations.preferences}
          <br />
          ${state.representations.wallet}
          <br />
        </div>
      </div>
    </div>
    `;
  },

  configsChooserUI() {
    const options = Object.keys(configs).map(v => {
      const selected = configsSelected == v ? 'selected="selected"' : '';
      return this.html`
      <option ${selected}>${v}</option>
      `;
    }).join('\n');
    return this.html`
    <div class="row">
      <div class="col-md-7"></div>
      <div class="col-md-5">
      <br />
        <div class="d-flex justify-content-end">
          <div class="input-group">
            <div class="input-group-prepend ">
              <label class="input-group-text">Config initiale :</label>
            </div>
            <select class="custom-select" onchange="actions.reinit({e:event})">
              ${options}
            </select>
          </div>
        </div>
      </div>
    </div>
    <br />
    `;
  },

  currenciesUI(model, state) {
    const tabName = model.ui.currenciesCard.selectedTab;
    switch (tabName) {
      case 'cryptos': return this.currenciesCryptosUI(model, state); break;
      case 'fiats': return this.currenciesFiatsUI(model, state); break;
      default:
        console.error('view.currenciesUI() : unknown tab name: ', tabName);
        return '<p>Error in view.currenciesUI()</p>';
    }
  },

  listcryptos(model, state){
    let nbr = model.ui.currenciesCard.tabs.cryptos.pagination.rowsPerPageIndex;
    let currentPage = model.ui.currenciesCard.tabs.cryptos.pagination.currentPage;
    let debut = (5+5*nbr)*(currentPage-1);
    let fin = debut + (5+5*nbr);
    let cpp = 0;
    

    let cryptos = state.data.cryptos.filtered.slice(debut,fin).map( v =>{
      const icons = ['↘', '∼', '↗'];
      return`
      ${cpp<5+5*nbr? `<tr class="${state.data.coins.posValueCodes.includes(v.code) ? 'bg-success text-light' : state.data.coins.allCodes.includes(v.code) ? 'bg-warning' : ''}"
      onclick="actions.changeCryptos({code:'${v.code}'})" > 
      <td class="text-center">
        <span class="badge badge-pill badge-light">
          <img src="${v.icon_url}" />
          ${v.code} </span>
      </td>
      <td><b>${v.name}</b></td>
      <td class="text-right"><b>${v.price.toFixed(2)}</b></td>
      <td class="text-right">${icons[Math.sign(v.change) + 1]}${v.change.toFixed(3)}</td>
      </tr><!--${cpp++}-->` : ''} `
      }).join('');
    return cryptos;
  },
  currenciesCryptosUI(model, state) {

    const paginationHTML = this.paginationUI(model, state, 'cryptos');
    let cryptos = this.listcryptos(model, state);
    let nbrc = model.ui.currenciesCard.tabs.cryptos.pagination.rowsPerPageIndex;
    let nbrf = model.ui.currenciesCard.tabs.fiats.pagination.rowsPerPageIndex;
    let currentPagec = model.ui.currenciesCard.tabs.cryptos.pagination.currentPage;
    let currentPagef = model.ui.currenciesCard.tabs.fiats.pagination.currentPage;
    let debutc = (5+5*nbrc)*currentPagec;
    let debutf = (5+5*nbrf)*currentPagef;
    let targets = state.data.coins.allCodes.map( v =>
     `<span class="badge ${state.data.coins.posValueCodes.includes(v)? 'badge-success' : 'badge-warning'}">${v}</span>
     ` ).join('');
    return this.html`
<div class="card border-secondary" id="currencies">
  <div class="card-header">
    <ul class="nav nav-pills card-header-tabs">
      <li class="nav-item">
        <a class="nav-link active" href="#currencies">
          Cryptos <span class="badge badge-light">${debutc} / ${state.data.cryptos.filtered.length}</span></a>
      </li>
      <li class="nav-item">
        <a class="nav-link text-secondary" href="#currencies" onclick="actions.changeTab({tab:'currenciesFiats'})">
          Monnaies cibles
          <span class="badge badge-secondary">${debutf} / ${state.data.fiats.filtered.length}</span></a>
      </li>
    </ul>
  </div>
  <div class="card-body">
    <div class="input-group">
      <div class="input-group-append">
        <span class="input-group-text">Filtres : </span>
      </div>
      <input value="${model.ui.currenciesCard.tabs.cryptos.filters.text}" id="filterText" type="text" class="form-control" placeholder="code ou nom..." onchange= "actions.changeFilter({e:event, currency:'cryptos'})" />
      <div class="input-group-append">
        <span class="input-group-text">Prix &gt; </span>
      </div>
      <input id="filterSup" type="number" class="form-control" value="${model.ui.currenciesCard.tabs.cryptos.filters.price}" min="0" onchange="actions.changePrice({e:event})" />
    </div> <br />
    <div class="table-responsive">
      <table class="col-12 table table-sm table-bordered">
        <thead>
          <th class="align-middle text-center col-2">
            <a href="#currencies" onclick="actions.sort({currency:'cryptos', col:0})">Code</a>
          </th>
          <th class="align-middle text-center col-5">
            <a href="#currencies" onclick="actions.sort({currency:'cryptos', col:1})">Nom</a>
          </th>
          <th class="align-middle text-center col-2">
            <a href="#currencies" onclick="actions.sort({currency:'cryptos', col:2})">Prix</a>
          </th>
          <th class="align-middle text-center col-3">
            <a href="#currencies" onclick="actions.sort({currency:'cryptos', col:3})">Variation</a>
          </th>
        </thead>
        ${cryptos}
      </table>
    </div>

    ${paginationHTML}
  </div>
  <div class="card-footer text-muted"> Cryptos préférées :
    ${targets}
  </div>
</div>  
    `;
  },

  paginationUI(model, state, currency) {
    let options = this.RowsPerPageIndex(model, currency);
    let maxPage = model.ui.currenciesCard.tabs[currency].pagination.maxPages;
    let currentPage = model.ui.currenciesCard.tabs[currency].pagination.currentPage;
    
    let pagelink = '';
    let min = Math.max(currentPage - Math.floor(maxPage / 2) + 1, 1);
    let max = Math.min(min + maxPage-1, state.ui.currenciesCard.tabs[currency].pagination.nbPages);
    min = Math.max(1, max - maxPage+1);
    model.ui.currenciesCard.tabs[currency].pagination.maxPage = max;
    for (let i = min; i <= max; i++) {
      pagelink +=`<li class = "page-item ${i == currentPage? 'active' : ''}">
      <a class="page-link" href="#currencies" onclick="actions.changePage({index:${i}, currency:'${currency}'})">${i}</a>
      </li>`
    }

    return this.html`
<section id="pagination">
  <div class="row justify-content-center">
    <nav class="col-auto">
      <ul class="pagination">
        <li class="page-item ${currentPage == 1? 'disabled': ''}">
          <a class="page-link" href="#currencies" onclick="actions.previousPage({index:${currentPage}, currency:'${currency}'})">&lt;</a>
        </li>
        ${pagelink}
        <li class="page-item ${currentPage == max? 'disabled': ''}">
          <a class="page-link" href="#currencies" onclick="actions.nextPage({index: ${currentPage}, currency:'${currency}'})">&gt;</a>
        </li>
      </ul>
    </nav>
    <div class="col-auto">
      <div class="input-group mb-3">
        <select class="custom-select" onchange="actions.rowsPerPage({v:this.value, currency:'${currency}'})" id="selectTo">
          ${options}          
        </select>
        <div class="input-group-append">
          <span class="input-group-text">par page</span>
        </div>
      </div>
    </div>
  </div>    
</section>    `;
  },

  RowsPerPageIndex(model, currency){
    let s = model.ui.currenciesCard.tabs[currency].pagination.rowsPerPageIndex;
    let selected;
    for (let i = 0; i < 3; i++) {
      selected += `<option ${s==i? 'selected="selected"':''} value="${i}">${5+5*i}</option>
      `;
    }
      return selected;
  },

  listfiats(model, state){
    let i = state.data.fiats.list;
    let nbr = model.ui.currenciesCard.tabs.fiats.pagination.rowsPerPageIndex;
    let currentPage = model.ui.currenciesCard.tabs.fiats.pagination.currentPage;
    let debut = (5+5*nbr)*(currentPage-1);
    let fin = debut + (5+5*nbr);
    let cpp = 0;
    console.log(state.data.fiats.filtered);

    let fiats = state.data.fiats.filtered.slice(debut,fin).map( v =>
      `${cpp<5+5*nbr? `<tr class="${model.config.targets.active == v.code ? 'bg-success text-light' : model.config.targets.list.includes(v.code) ? 'bg-warning' : ''}"
      onclick="actions.changeFiats({code:'${v.code}'})" > 
        <td class="text-center">${v.code}</td>
        <td><b>${v.name}</b></td>
        <td class="text-center">${v.symbol}</td>
      </tr><!--${cpp++}-->` : ''} `
      ).join('');

    return fiats;
  },

  currenciesFiatsUI(model, state) {
    
    const paginationHTML = this.paginationUI(model, state, 'fiats');
    let fiats = this.listfiats(model, state);
    let nbrc = model.ui.currenciesCard.tabs.cryptos.pagination.rowsPerPageIndex;
    let nbrf = model.ui.currenciesCard.tabs.fiats.pagination.rowsPerPageIndex;
    let currentPagec = model.ui.currenciesCard.tabs.cryptos.pagination.currentPage;
    let currentPagef = model.ui.currenciesCard.tabs.fiats.pagination.currentPage;
    let debutc = (5+5*nbrc)*currentPagec;
    let debutf = (5+5*nbrf)*currentPagef;
    let targetsFiats = mergeUnique(model.config.targets.list, [model.config.targets.active]).sort();

    let targets = targetsFiats.map(v =>
      `<span class="badge ${model.config.targets.active.includes(v)? 'badge-success' : 'badge-warning'}">${v}</span>
      `).join('');

    return this.html`
<div class="card border-secondary" id="currencies">
  <div class="card-header">
    <ul class="nav nav-pills card-header-tabs">
      <li class="nav-item">
        <a class="nav-link text-secondary" href="#currencies" onclick="actions.changeTab({tab:'currenciesCryptos'})">
          Cryptos <span class="badge badge-secondary">${debutc} / ${state.data.cryptos.filtered.length}</span></a>
      </li>
      <li class="nav-item">
        <a class="nav-link active" href="#currencies">Monnaies cibles <span class="badge badge-light">${debutf} / ${state.data.fiats.filtered.length}</span></a>
      </li>
    </ul>
  </div>
  <div class="card-body">
    <div class="input-group">
      <div class="input-group-append">
        <span class="input-group-text">Filtres : </span>
      </div>
      <input value="${model.ui.currenciesCard.tabs.fiats.filters.text}" id="filterText" onchange= "actions.changeFilter({e:event, currency:'fiats'})" type="text" class="form-control" placeholder="code ou nom..." />
    </div> <br />
    <div>
      <table class="col-12 table table-sm table-bordered">
        <thead>
          <th class="align-middle text-center col-2">
            <a href= "#currencies">Code</a>
          </th>
          <th class="align-middle text-center col-5">
            <a href= "#currencies">Nom</a>
          </th>
          <th class="align-middle text-center col-2">
            <a href= "#currencies">Symbole</a>
          </th>
        </thead>
        ${fiats}
      </table>
    </div><br />
    ${paginationHTML}
  </div>
  <div class="card-footer text-muted"> Monnaies préférées :
   ${targets}
  </div>
</div>    `;
  },

  preferencesUI(model, state) {

    const authors = model.config.authors;
    const debug = model.config.debug;
    const activeTarget = model.config.targets.active;
    const updateDisabled = model.config.dataMode == 'offline' ? 'disabled="disabled"' : '';
    const target = model.config.targets.active;
    const targetsList = mergeUnique(model.config.targets.list, [target]).sort();
    const fiatsList = state.data.fiats.list;

    const fiatOptionsHTML = targetsList.map((v) => {
      const code = fiatsList[v].code;
      const name = fiatsList[v].name;
      const isOffline = model.config.dataMode == 'offline';
      const selected = code == target ? 'selected="selected"' : '';
      const disabled = isOffline && code != target ? 'disabled="disabled"' : '';
      return this.html`
      <option value="${code}" ${selected} ${disabled}>${code} - ${name}</option>
      `;
    }).join('\n');

    const dataModeOptionsHTML = [['online', 'En ligne'], ['offline', 'Hors ligne']].map(v => {
      const selected = v[0] == model.config.dataMode ? 'selected="selected"' : '';
      return this.html`<option value="${v[0]}" ${selected}>${v[1]}</option>`;
    }).join('\n');

    return this.html`
<div class="card border-secondary">
  <div class="card-header d-flex justify-content-between">
    <h5 class=""> Préférences </h5>
    <h5 class="text-secondary"><abbr title="${authors}">Crédits</abbr></h5>
  </div>
  <div class="card-body">
    <div class="input-group">
      <div class="input-group-prepend">
        <label class="input-group-text" for="inputGroupSelect01">Monnaie
          cible</label>
      </div>
      <select class="custom-select" id="inputGroupSelect01"
        onchange="actions.changeTarget({e:event, debug:'${debug}'})">
        ${fiatOptionsHTML}
      </select>
    </div>
    <p></p>
    <div class="input-group">
      <div class="input-group-prepend">
        <label class="input-group-text">Données</label>
      </div>
      <select class="custom-select"
        onchange="actions.changeDataMode({e:event, target:'${activeTarget}', debug:'${debug}'})">
        ${dataModeOptionsHTML}
      </select>
      <div class="input-group-append">
        <button class="btn btn-primary" ${updateDisabled}
          onclick="actions.updateOnlineCurrenciesData({target: '${activeTarget}', debug:'${debug}'})">
          Actualiser</button>
      </div>
    </div>
  </div>
</div>    `;
  },

  walletUI(model, state) {
    const tabName = model.ui.walletCard.selectedTab;
    switch (tabName) {
      case 'portfolio': return this.walletPortfolioUI(model, state); break;
      case 'ajouter': return this.walletAjouterUI(model, state); break;
      default:
        console.error('view.currenciesUI() : unknown tab name: ', tabName);
        return '<p>Error in view.currenciesUI()</p>';
    }
  },

  walletPortfolioUI(model, state) {
    let  list = state.data.cryptos.list;
    let  coins = model.config.coins;
    let total = 0;
    let disabled = false;
    let preferences = state.data.coins.posValueCodes.map( v =>{
      const quantité = coins[v].quantityNew != '' ? coins[v].quantityNew : coins[v].quantity;
      const badge = ((isNaN(parseFloat(quantité))) || (parseFloat(quantité) < 0))? 'text-danger' : coins[v].quantityNew != '' ? 'text-primary' : '';
      if (!((isNaN(parseFloat(quantité))) || (parseFloat(quantité) < 0))) {
        total += (parseFloat(quantité) * list[v].price);
      }else{
        disabled = true;
      }
      return`
      <tr>
        <td class="text-center">
          <span class="badge badge-pill badge-light">
            <img src="${list[v].icon_url}"/>
            ${v}</span>
        </td>
        <td><b>${list[v].name}</b></td>
        <td class="text-right">${list[v].price.toFixed(2)}</td>
        <td class="text-right">
          <input type="text" class="form-control ${badge}" value="${quantité}" onchange="actions.changeQuantitee({e:event, code:'${list[v].code}'})" />
        </td>
        <td class="text-right"><span class="${badge}"><b>${((isNaN(parseFloat(quantité))) || (parseFloat(quantité) < 0))? '???' : (parseFloat(quantité) * list[v].price).toFixed(2)}</b></span></td>
      </tr> 
     `
    }
    ).join('');

    return this.html`
<div class="card border-secondary text-center" id="wallet">
  <div class="card-header">
    <ul class="nav nav-pills card-header-tabs">
      <li class="nav-item">
        <a class="nav-link active" href="#wallet">Portfolio <span class="badge badge-light">${state.data.coins.posValueCodes.length}</span></a>
      </li>
      <li class="nav-item">
        <a class="nav-link text-secondary" href="#wallet" onclick="actions.changeTab({tab:'walletAjouter'})">
          Ajouter <span class="badge badge-secondary">${state.data.coins.nullValueCodes.length}</span></a>
      </li>
    </ul>
  </div>
  <div class="card-body text-center">

    <br />
    <div class="table-responsive">
      <table class="col-12 table table-sm table-bordered">
        <thead>
          <th class="align-middle text-center col-1"> Code </th>
          <th class="align-middle text-center col-4"> Nom </th>
          <th class="align-middle text-center col-2"> Prix </th>
          <th class="align-middle text-center col-3"> Qté </th>
          <th class="align-middle text-center col-2"> Total </th>
        </thead>

        ${preferences}

      </table>
    </div>

    <div class="input-group d-flex justify-content-end">
      <div class="input-group-prepend">
        <button class="btn ${disabled? 'disabled' : 'btn-primary'}">Confirmer</button>
      </div>
      <div class="input-group-append">
        <button class="btn btn-secondary">Annuler</button>
      </div>
    </div>

  </div>

  <div class="card-footer">
    <h3><span class="badge badge-primary">Total : ${total.toFixed(2)} ${model.config.targets.active}</span></h3>
  </div>
</div>
    `;
  },

  walletAjouterUI(model, state) {

    let list = state.data.cryptos.list;
    let coins = model.config.coins;
    let total = 0;
    let disabled = true;
    let add = state.data.coins.nullValueCodes.map( v =>{
      const quantité = coins[v].quantityNew != '' ? coins[v].quantityNew : coins[v].quantity;
      const badge = ((isNaN(parseFloat(quantité))) || (parseFloat(quantité) < 0)) ? 'text-danger' : coins[v].quantityNew != '' ? 'text-primary' : '';
      if (!((isNaN(parseFloat(quantité))) || (parseFloat(quantité)<0))) {
        total += (parseFloat(quantité)* list[v].price);
      }
      if (parseFloat(quantité) > 0) {
        disabled = false;
      }
      return`
      <tr>
        <td class="text-center">
          <span class="badge badge-pill badge-light">
            <img src="${list[v].icon_url}"/> ${v}</span>
        </td>
        <td><b>${list[v].name}</b></td>
        <td class="text-right">${list[v].price.toFixed(2)}</td>
        <td class="text-right">
          <input type="text" class="form-control ${badge}" value="${quantité}" onchange="actions.changeQuantitee({e:event, code:'${list[v].code}'})" />
        </td>
        <td class="text-right"><span class="${badge}"><b>${((isNaN(parseFloat(quantité))) || (parseFloat(quantité) < 0))? '???' : (parseFloat(quantité) * list[v].price).toFixed(2)}</b></span></td>
      </tr>
      `
    }).join('');

    return this.html`
<div class="card border-secondary text-center" id="wallet">
  <div class="card-header">
    <ul class="nav nav-pills card-header-tabs">
      <li class="nav-item">
        <a class="nav-link text-secondary" href="#wallet" onclick="actions.changeTab({tab:'walletPortfolio'})">
          Portfolio <span class="badge badge-secondary">${state.data.coins.posValueCodes.length}</span></a>
      </li>
      <li class="nav-item">
        <a class="nav-link active" href="#wallet">Ajouter <span class="badge badge-light">${state.data.coins.nullValueCodes.length}</span></a>
      </li>
    </ul>
  </div>
  <div class="card-body">
    <br />
    <div class="table-responsive">
      <table class="col-12 table table-sm table-bordered">
        <thead>
          <th class="align-middle text-center col-1"> Code </th>
          <th class="align-middle text-center col-4"> Nom </th>
          <th class="align-middle text-center col-2"> Prix </th>
          <th class="align-middle text-center col-3"> Qté </th>
          <th class="align-middle text-center col-2"> Total </th>
        </thead>

        ${add}

      </table>
    </div>

    <div class="input-group d-flex justify-content-end">
      <div class="input-group-prepend">
        <button class="btn ${disabled? 'disabled' : 'btn-primary'}">Confirmer</button>
      </div>
      <div class="input-group-append">
        <button class="btn btn-secondary">Annuler</button>
      </div>
    </div>


  </div>
  <div class="card-footer">
    <h3><span class="badge badge-primary">Total : ${total.toFixed(2)} ${model.config.targets.active}</span></h3>
  </div>
</div>
    `;
  },


};
