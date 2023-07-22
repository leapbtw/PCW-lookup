// background.js

const fetchPokemonNames = () => {
    return fetch(chrome.runtime.getURL('pokedex.txt'))
      .then(response => response.text())
      .then(text => {
        return text.split(/\r?\n/).filter(name => name.trim() !== "");
      });
  };
  
  const getSimilarityScore = (str1, str2) => {
    const len1 = str1.length;
    const len2 = str2.length;
    const dp = [];
  
    for (let i = 0; i <= len1; i++) {
      dp.push([i]);
    }
  
    for (let j = 1; j <= len2; j++) {
      dp[0][j] = j;
    }
  
    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + cost
        );
      }
    }
  
    return dp[len1][len2];
  };
  
  let validPokemonNames = [];
  
  fetchPokemonNames().then(names => {
    validPokemonNames = names;
  });
  
  chrome.webNavigation.onBeforeNavigate.addListener((details) => {
    const query = getParameterByName("q", details.url);
    if (query) {
      if (query.toLowerCase().startsWith("pcw ")) {
        const searchTerm = query.substring(4).trim(); // Rimuovi "pcw " dal termine di ricerca
        if (searchTerm) {
          const wikiURL = `https://wiki.pokemoncentral.it/index.php?search=${encodeURIComponent(searchTerm)}`;
          chrome.tabs.update({ url: wikiURL });
        }
      } else {
        const closestName = getClosestPokemonName(query);
        if (closestName) {
          const wikiURL = `https://wiki.pokemoncentral.it/${closestName}`;
          chrome.tabs.update({ url: wikiURL });
        }
      }
    }
  });
  
  
  function getParameterByName(name, url) {
    const regex = new RegExp("[?&]" + name.replace(/[\[\]]/g, "\\$&") + "(=([^&#]*)|&|#|$)");
    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }
  
  function getClosestPokemonName(name) {
    const maxAllowedErrors = 1; // Massimo numero di errori ammessi nella battitura
    let closestName = null;
    let minDistance = Number.MAX_SAFE_INTEGER;
  
    for (const pokemon of validPokemonNames) {
      if (pokemon.length < 3) continue; // Ignora nomi molto corti
      const distance = getSimilarityScore(name.toLowerCase(), pokemon.toLowerCase());
      if (distance < minDistance && distance <= maxAllowedErrors) {
        closestName = pokemon;
        minDistance = distance;
      }
    }
  
    return closestName;
  }
  