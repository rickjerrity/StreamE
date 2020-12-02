var FOLLOWING_ONLINE_URL = 'https://3xidp6ftp1.execute-api.us-west-2.amazonaws.com/streamE_followingOnline';
var SEARCH_USERNAME_URL = 'https://3xidp6ftp1.execute-api.us-west-2.amazonaws.com/streamE_searchUsername';
var DEFAULT_FOLLOWING_URL = 'https://3xidp6ftp1.execute-api.us-west-2.amazonaws.com/streamE_defaultFollowing';

var ENABLE_ONLINE_CALLS = true;
var ENABLE_SEARCH_CALLS = true;

var DEFAULT_FOLLOWING = [
  {
    username: 'summit1g',
    twitch: true,
  },
  {
    username: 'Valkyrae',
    youtube: true,
    channelId: 'UCWxlUwW9BgGISaakjGM37aw',
  },
  {
    username: 'TimTheTatman',
    twitch: true,
  },
  {
    username: 'CouRage',
    youtube: true,
    channelId: 'UCrgTEmBuoObZiEXvZ6r3PQg',
  },
  {
    username: 'NICKMERCS',
    twitch: true,
  },
  {
    username: 'xQcOW',
    twitch: true,
  },
  {
    username: 'Annemunition',
    twitch: true,
  },
  {
    username: 'LIRIK',
    twitch: true,
  },
  {
    username: 'NoahJ456',
    youtube: true,
    channelId: 'UCP9tAErY_RlX4RFKssE4ogg',
  },
  {
    username: 'monstercat',
    twitch: true,
  },
  {
    username: 'ChilledCow',
    youtube: true,
    channelId: 'UCSJ4gkVC6NrvII8umztf0Ow',
  },
];

function apiFetch(apiUrl, body) {
  return fetch(apiUrl, {
    mode: 'cors',
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  })
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      console.log(err);
      return [];
    });
}

function defaultFollowing() {
  return apiFetch(DEFAULT_FOLLOWING_URL);
}

function followingOnline(following) {
  return apiFetch(FOLLOWING_ONLINE_URL, JSON.stringify(following));
}

function streamerSearch(streamer) {
  return apiFetch(SEARCH_USERNAME_URL, streamer);
}

function getUniqueStreamerId(streamer) {
  var platform = streamer.twitch ? 'twitch' : streamer.youtube ? 'youtube' : '';

  if (platform !== '') {
    return LZString.compressToBase64(streamer.username + platform);
  } else {
    return streamer.username;
  }
}

// https://davidwalsh.name/javascript-debounce-function
//
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this,
      args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
//
// Getting a random integer between two values, exclusive of `max`
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

// https://stackoverflow.com/a/9609450/6121503
//
// Decode HTML entities
var decodeEntities = (function () {
  // this prevents any overhead from creating the object each time
  var element = document.createElement('div');

  function decodeHTMLEntities(str) {
    if (str && typeof str === 'string') {
      // strip script/html tags
      str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gim, '');
      str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gim, '');
      element.innerHTML = str;
      str = element.textContent;
      element.textContent = '';
    }

    return str;
  }

  return decodeHTMLEntities;
})();
