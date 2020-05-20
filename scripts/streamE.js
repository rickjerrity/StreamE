var followingOnlineUrl =
  'https://3xidp6ftp1.execute-api.us-west-2.amazonaws.com/streamE_followingOnline';
var searchUsernameUrl =
  'https://3xidp6ftp1.execute-api.us-west-2.amazonaws.com/streamE_searchUsername';
var defaultFollowingUrl =
  'https://3xidp6ftp1.execute-api.us-west-2.amazonaws.com/streamE_defaultFollowing';

var twitchLinkRootUrl = 'https://twitch.com/';
var mixerLinkRootUrl = 'https://mixer.com/';
var youtubeLinkRootUrl = 'https://youtube.com/channel/';

var ENABLE_ONLINE_CALLS = true;
var ENABLE_SEARCH_CALLS = true;

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
  return apiFetch(defaultFollowingUrl);
}

function followingOnline(following) {
  return apiFetch(followingOnlineUrl, JSON.stringify(following));
}

function streamerSearch(streamer) {
  return apiFetch(searchUsernameUrl, streamer);
}

function getUniqueStreamerId(streamer) {
  var platform = streamer.twitch
    ? 'twitch'
    : streamer.mixer
    ? 'mixer'
    : streamer.youtube
    ? 'youtube'
    : '';

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
// Getting a random integer between two values
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
