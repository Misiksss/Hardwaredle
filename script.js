(function () {
  'use strict';

  /* ==========================================================
     DATABASE
     ========================================================== */
  var hardwareDB = [
    // GPUs
    { name: "RTX 4090", type: "GPU", brand: "NVIDIA", year: 2022, interface: "PCIe 4.0", tier: "Enthusiast" },
    { name: "RTX 3080", type: "GPU", brand: "NVIDIA", year: 2020, interface: "PCIe 4.0", tier: "Enthusiast" },
    { name: "RTX 3060", type: "GPU", brand: "NVIDIA", year: 2021, interface: "PCIe 4.0", tier: "Consumer" },
    { name: "GTX 1080 Ti", type: "GPU", brand: "NVIDIA", year: 2017, interface: "PCIe 3.0", tier: "Enthusiast" },
    { name: "RX 7900 XTX", type: "GPU", brand: "AMD", year: 2022, interface: "PCIe 4.0", tier: "Enthusiast" },
    { name: "RX 6700 XT", type: "GPU", brand: "AMD", year: 2021, interface: "PCIe 4.0", tier: "Consumer" },
    { name: "RX 580", type: "GPU", brand: "AMD", year: 2017, interface: "PCIe 3.0", tier: "Budget" },
    // CPUs
    { name: "Core i9-13900K", type: "CPU", brand: "Intel", year: 2022, interface: "LGA1700", tier: "Enthusiast" },
    { name: "Core i5-12400F", type: "CPU", brand: "Intel", year: 2022, interface: "LGA1700", tier: "Budget" },
    { name: "Core i7-9700K", type: "CPU", brand: "Intel", year: 2018, interface: "LGA1151", tier: "Consumer" },
    { name: "Ryzen 7 7800X3D", type: "CPU", brand: "AMD", year: 2023, interface: "AM5", tier: "Enthusiast" },
    { name: "Ryzen 5 5600X", type: "CPU", brand: "AMD", year: 2020, interface: "AM4", tier: "Consumer" },
    { name: "Ryzen 5 3600", type: "CPU", brand: "AMD", year: 2019, interface: "AM4", tier: "Budget" },
    // Motherboards
    { name: "ROG Maximus Z790 Hero", type: "Motherboard", brand: "ASUS", year: 2022, interface: "LGA1700", tier: "Enthusiast" },
    { name: "B550 TOMAHAWK", type: "Motherboard", brand: "MSI", year: 2020, interface: "AM4", tier: "Consumer" },
    { name: "X670E AORUS MASTER", type: "Motherboard", brand: "Gigabyte", year: 2022, interface: "AM5", tier: "Enthusiast" },
    // RAM
    { name: "Vengeance LPX 16GB", type: "RAM", brand: "Corsair", year: 2015, interface: "DDR4", tier: "Budget" },
    { name: "Trident Z5 RGB 32GB", type: "RAM", brand: "G.Skill", year: 2021, interface: "DDR5", tier: "Enthusiast" },
    { name: "Fury Beast 16GB", type: "RAM", brand: "Kingston", year: 2021, interface: "DDR4", tier: "Consumer" },
    // Storage
    { name: "990 PRO 2TB", type: "Storage", brand: "Samsung", year: 2022, interface: "M.2 NVMe", tier: "Enthusiast" },
    { name: "970 EVO Plus 1TB", type: "Storage", brand: "Samsung", year: 2019, interface: "M.2 NVMe", tier: "Consumer" },
    { name: "SN850X 2TB", type: "Storage", brand: "WD_BLACK", year: 2022, interface: "M.2 NVMe", tier: "Enthusiast" },
    { name: "Crucial MX500 1TB", type: "Storage", brand: "Crucial", year: 2017, interface: "SATA", tier: "Budget" },
    // Coolers
    { name: "NH-D15", type: "Cooler", brand: "Noctua", year: 2014, interface: "Universal", tier: "Enthusiast" },
    { name: "Kraken Elite 360", type: "Cooler", brand: "NZXT", year: 2023, interface: "Universal", tier: "Enthusiast" },
    { name: "Hyper 212 EVO", type: "Cooler", brand: "Cooler Master", year: 2011, interface: "Universal", tier: "Budget" },
    // Cases
    { name: "O11 Dynamic", type: "Case", brand: "Lian Li", year: 2018, interface: "ATX", tier: "Consumer" },
    { name: "Meshify C", type: "Case", brand: "Fractal Design", year: 2017, interface: "ATX", tier: "Consumer" },
    { name: "4000D Airflow", type: "Case", brand: "Corsair", year: 2020, interface: "ATX", tier: "Consumer" },
    // PSUs
    { name: "RM850x", type: "PSU", brand: "Corsair", year: 2021, interface: "ATX", tier: "Consumer" },
    { name: "Focus GX-750", type: "PSU", brand: "Seasonic", year: 2019, interface: "ATX", tier: "Consumer" },
    { name: "Dark Power Pro 12", type: "PSU", brand: "be quiet!", year: 2020, interface: "ATX", tier: "Enthusiast" }
  ];

  /* ==========================================================
     STORAGE
     Uses localStorage when available (same keys as the old version,
     so existing stats carry over) and falls back to memory when the
     browser blocks it.
     ========================================================== */
  var memoryStore = {};

  var storage = {
    get: function (key) {
      try {
        var v = window.localStorage.getItem(key);
        if (v !== null) return v;
      } catch (e) { /* storage unavailable */ }
      return Object.prototype.hasOwnProperty.call(memoryStore, key) ? memoryStore[key] : null;
    },
    set: function (key, value) {
      memoryStore[key] = value;
      try { window.localStorage.setItem(key, value); } catch (e) { /* storage unavailable */ }
    }
  };

  function loadStats() {
    var best = parseInt(storage.get('hardwaredle_best') || '', 10);
    return {
      wins: parseInt(storage.get('hardwaredle_wins') || '0', 10) || 0,
      played: parseInt(storage.get('hardwaredle_played') || '0', 10) || 0,
      best: isNaN(best) ? null : best
    };
  }

  function saveStats(s) {
    storage.set('hardwaredle_wins', String(s.wins));
    storage.set('hardwaredle_played', String(s.played));
    if (s.best !== null) storage.set('hardwaredle_best', String(s.best));
  }

  /* ==========================================================
     ELEMENTS
     ========================================================== */
  function $(id) { return document.getElementById(id); }

  var els = {
    search: $('search'),
    input: $('search-input'),
    clear: $('search-clear'),
    list: $('hd-listbox'),
    noResults: $('no-results'),
    help: $('help'),
    done: $('done'),
    doneText: $('done-text'),
    doneRestart: $('done-restart'),
    board: $('board'),
    rows: $('rows'),
    empty: $('empty'),
    statWins: $('stat-wins'),
    statPlayed: $('stat-played'),
    statBest: $('stat-best'),
    statAttempts: $('stat-attempts'),
    overlay: $('overlay'),
    winName: $('win-name'),
    winSpecs: $('win-specs'),
    winAttempts: $('win-attempts'),
    winWins: $('win-wins'),
    winBest: $('win-best'),
    winRestart: $('win-restart'),
    winClose: $('win-close')
  };

  // Board columns come from the header row in index.html (single source of truth)
  var COLUMNS = Array.prototype.map.call(
    document.querySelectorAll('.hd-cols [data-key]'),
    function (span) { return { key: span.getAttribute('data-key'), label: span.textContent }; }
  );

  /* ==========================================================
     STATE
     phase: playing -> reveal (tiles flipping) -> modal -> done
     ========================================================== */
  var state = {
    target: null,
    guesses: [],          // newest first
    phase: 'playing',
    stats: loadStats(),
    options: [],
    activeIndex: 0,
    dropdownOpen: false,
    winTimer: null
  };

  function pickTarget(previous) {
    var next;
    do {
      next = hardwareDB[Math.floor(Math.random() * hardwareDB.length)];
    } while (previous && next.name === previous.name && hardwareDB.length > 1);
    return next;
  }

  /* ==========================================================
     SMALL HELPERS
     ========================================================== */
  function make(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function currentQuery() {
    return els.input.value.trim().toLowerCase();
  }

  function isDropdownVisible() {
    return !els.list.hidden;
  }

  /* ==========================================================
     RENDER: stats, board visibility, phase
     ========================================================== */
  function renderStats() {
    els.statWins.textContent = state.stats.wins;
    els.statPlayed.textContent = state.stats.played;
    els.statBest.textContent = state.stats.best ? state.stats.best + '. pokus' : '-';
    els.statAttempts.textContent = state.guesses.length;
  }

  function renderBoardVisibility() {
    var hasGuesses = state.guesses.length > 0;
    els.board.hidden = !hasGuesses;
    els.empty.hidden = hasGuesses;
  }

  function updateClearButton() {
    els.clear.hidden = !(els.input.value && state.phase === 'playing');
  }

  function fillResult() {
    var t = state.target;
    var attempts = state.guesses.length;

    // Dialog
    els.winName.textContent = t.name;
    els.winSpecs.textContent = '';
    [t.type, t.brand, t.year, t.interface, t.tier].forEach(function (value) {
      els.winSpecs.appendChild(make('li', '', value));
    });
    els.winAttempts.textContent = attempts + '. pokus';
    els.winWins.textContent = state.stats.wins;
    els.winBest.textContent = state.stats.best + '. pokus';

    // Bar shown after the dialog is closed
    els.doneText.textContent = '';
    els.doneText.appendChild(document.createTextNode('Uhodl jsi '));
    els.doneText.appendChild(make('strong', '', t.name));
    els.doneText.appendChild(document.createTextNode(' na ' + attempts + '. pokus.'));
  }

  function setPhase(phase) {
    state.phase = phase;
    var playing = phase === 'playing';

    els.input.disabled = !playing;
    els.input.placeholder = playing ? 'Napiš název komponenty...' : 'Konec hry!';
    els.overlay.hidden = phase !== 'modal';
    els.done.hidden = phase !== 'done';
    els.help.hidden = phase === 'done';

    if (phase === 'modal' || phase === 'done') fillResult();
    if (phase === 'modal') els.winRestart.focus();
    updateClearButton();
  }

  /* ==========================================================
     RENDER: guess rows
     ========================================================== */
  function buildArrow(direction) {
    var text = direction === 'up' ? 'Hledaná komponenta je novější' : 'Hledaná komponenta je starší';
    var arrow = make('span', 'hd-arrow' + (direction === 'down' ? ' is-down' : ''));
    arrow.setAttribute('role', 'img');
    arrow.setAttribute('aria-label', text.toLowerCase());
    arrow.title = text;
    arrow.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20V4M5 11l7-7 7 7"/></svg>';
    return arrow;
  }

  function buildTile(column, guess, attempt, index) {
    var isName = column.key === 'name';
    var match = guess[column.key] === state.target[column.key];
    var status = match ? 'is-match' : (isName ? 'is-neutral' : 'is-miss');

    var tile = make('div', 'hd-tile ' + status);
    tile.setAttribute('data-key', column.key);
    // Shown as a small label on mobile, where the column header row is hidden
    tile.setAttribute('data-label', isName ? 'Pokus ' + attempt : column.label);
    tile.style.animationDelay = (index * 0.12) + 's';

    var body = make('div', 'hd-tile-body');
    body.appendChild(make('span', 'hd-val', guess[column.key]));

    if (column.key === 'year' && !match) {
      body.appendChild(buildArrow(guess.year < state.target.year ? 'up' : 'down'));
    }
    tile.appendChild(body);

    if (!isName) tile.appendChild(make('span', 'hd-sr', match ? 'shoda' : 'neshoda'));
    return tile;
  }

  function addGuessRow(guess, attempt) {
    var row = make('div', 'hd-row');
    row.setAttribute('aria-label', 'Pokus ' + attempt + ': ' + guess.name);

    var idx = make('div', 'hd-idx', attempt);
    idx.setAttribute('aria-hidden', 'true');
    row.appendChild(idx);

    COLUMNS.forEach(function (column, i) {
      row.appendChild(buildTile(column, guess, attempt, i));
    });

    // Newest guess goes on top; only the new row plays the flip animation
    els.rows.insertBefore(row, els.rows.firstChild);
  }

  /* ==========================================================
     DROPDOWN
     ========================================================== */
  function findOptions(query) {
    if (!query) return [];
    return hardwareDB.filter(function (item) {
      return item.name.toLowerCase().indexOf(query) !== -1 &&
        !state.guesses.some(function (g) { return g.name === item.name; });
    });
  }

  function appendHighlighted(container, text, query) {
    var i = query ? text.toLowerCase().indexOf(query) : -1;
    if (i === -1) {
      container.textContent = text;
      return;
    }
    container.appendChild(document.createTextNode(text.slice(0, i)));
    container.appendChild(make('mark', '', text.slice(i, i + query.length)));
    container.appendChild(document.createTextNode(text.slice(i + query.length)));
  }

  function setActive(index, scrollIntoView) {
    state.activeIndex = index;
    var items = els.list.children;

    for (var i = 0; i < items.length; i++) {
      var isActive = i === index;
      items[i].classList.toggle('is-active', isActive);
      items[i].setAttribute('aria-selected', String(isActive));
    }

    if (items[index]) {
      els.input.setAttribute('aria-activedescendant', items[index].id);
      if (scrollIntoView) {
        // Scroll only the list, never the whole page
        var el = items[index];
        var top = el.offsetTop;
        var bottom = top + el.offsetHeight;
        if (top < els.list.scrollTop) els.list.scrollTop = top - 6;
        else if (bottom > els.list.scrollTop + els.list.clientHeight) {
          els.list.scrollTop = bottom - els.list.clientHeight + 6;
        }
      }
    }
  }

  function refreshDropdown() {
    var query = currentQuery();
    var open = state.dropdownOpen && query !== '';

    state.options = findOptions(query);
    var hasOptions = state.options.length > 0;

    els.list.hidden = !(open && hasOptions);
    els.noResults.hidden = !(open && !hasOptions);
    els.input.setAttribute('aria-expanded', String(open && hasOptions));

    if (!(open && hasOptions)) {
      els.input.removeAttribute('aria-activedescendant');
      return;
    }

    els.list.textContent = '';
    state.options.forEach(function (option, i) {
      var li = make('li', 'hd-opt');
      li.id = 'hd-opt-' + i;
      li.setAttribute('role', 'option');

      var main = make('span', 'hd-opt-main');
      var name = make('span', 'hd-opt-name');
      appendHighlighted(name, option.name, query);
      main.appendChild(name);
      main.appendChild(make('span', 'hd-opt-sub', option.brand));

      li.appendChild(main);
      li.appendChild(make('span', 'hd-opt-type', option.type));

      // mousemove (not mouseenter) so a rebuilt list under a resting cursor
      // doesn't steal the keyboard selection
      li.addEventListener('mousemove', function () {
        if (state.activeIndex !== i) setActive(i, false);
      });
      li.addEventListener('click', function () { handleGuess(option); });

      els.list.appendChild(li);
    });

    setActive(Math.min(state.activeIndex, state.options.length - 1), true);
  }

  function closeDropdown() {
    state.dropdownOpen = false;
    refreshDropdown();
  }

  /* ==========================================================
     GAME FLOW
     ========================================================== */
  function startNewGame() {
    clearTimeout(state.winTimer);
    state.target = pickTarget(state.target);
    state.guesses = [];
    state.activeIndex = 0;
    state.dropdownOpen = false;

    els.rows.textContent = '';
    els.input.value = '';

    setPhase('playing');
    renderBoardVisibility();
    renderStats();
    refreshDropdown();

    setTimeout(function () { els.input.focus(); }, 60);
  }

  function closeModal() {
    setPhase('done');
  }

  function handleGuess(item) {
    if (state.phase !== 'playing') return;

    state.guesses.unshift(item);
    els.input.value = '';
    state.dropdownOpen = false;
    state.activeIndex = 0;

    addGuessRow(item, state.guesses.length);
    renderBoardVisibility();
    refreshDropdown();
    updateClearButton();

    if (item.name === state.target.name) {
      var attempts = state.guesses.length;
      state.stats = {
        wins: state.stats.wins + 1,
        played: state.stats.played + 1,
        best: state.stats.best === null || attempts < state.stats.best ? attempts : state.stats.best
      };
      saveStats(state.stats);
      renderStats();

      setPhase('reveal');
      // Let the tile-flip animation finish before the dialog appears
      state.winTimer = setTimeout(function () { setPhase('modal'); }, 1300);
    } else {
      renderStats();
      els.input.focus();
    }
  }

  /* ==========================================================
     EVENTS
     ========================================================== */
  els.input.addEventListener('input', function () {
    state.activeIndex = 0;
    state.dropdownOpen = currentQuery() !== '';
    refreshDropdown();
    updateClearButton();
  });

  els.input.addEventListener('focus', function () {
    if (currentQuery()) {
      state.dropdownOpen = true;
      refreshDropdown();
    }
  });

  els.input.addEventListener('keydown', function (e) {
    var count = state.options.length;

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!count) return;

      // First press on a closed list only reopens it
      if (!isDropdownVisible()) {
        state.dropdownOpen = true;
        refreshDropdown();
        return;
      }
      var step = e.key === 'ArrowDown' ? 1 : -1;
      setActive((state.activeIndex + step + count) % count, true);
    } else if (e.key === 'Enter') {
      if (isDropdownVisible() && count) {
        e.preventDefault();
        handleGuess(state.options[state.activeIndex]);
      }
    } else if (e.key === 'Escape') {
      closeDropdown();
    }
  });

  els.clear.addEventListener('click', function () {
    els.input.value = '';
    closeDropdown();
    updateClearButton();
    els.input.focus();
  });

  // Close the dropdown when clicking outside the search area
  document.addEventListener('mousedown', function (e) {
    if (state.dropdownOpen && !els.search.contains(e.target)) closeDropdown();
  });

  // Escape closes the win dialog
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && state.phase === 'modal') closeModal();
  });

  // Clicking the dark backdrop closes the dialog
  els.overlay.addEventListener('click', function (e) {
    if (e.target === els.overlay) closeModal();
  });

  els.winClose.addEventListener('click', closeModal);
  els.winRestart.addEventListener('click', startNewGame);
  els.doneRestart.addEventListener('click', startNewGame);

  /* ==========================================================
     START
     ========================================================== */
  state.target = pickTarget(null);
  setPhase('playing');
  renderBoardVisibility();
  renderStats();
  refreshDropdown();
})();
