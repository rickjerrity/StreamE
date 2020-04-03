var followingOnlineUrl = 'https://3xidp6ftp1.execute-api.us-west-2.amazonaws.com/streamE_followingOnline';
var searchUsernameUrl = 'https://3xidp6ftp1.execute-api.us-west-2.amazonaws.com/streamE_searchUsername';

var twitchLinkRootUrl = 'https://twitch.com/';
var mixerLinkRootUrl = 'https://mixer.com/';
var youtubeLinkRootUrl = 'https://youtube.com/channel/';

var ENABLE_ONLINE_CALLS = true;
var ENABLE_SEARCH_CALLS = true;

var defaultFollowing = [
  {
    username: 'summit1g',
    twitch: true
  },
  {
    username: 'TimTheTatman',
    twitch: true
  },
  {
    username: 'shroud',
    mixer: true
  },
  {
    username: 'DrDisrespect',
    twitch: true
  },
  {
    username: "NoahJ456",
    youtube: true,
    channelId: "UCP9tAErY_RlX4RFKssE4ogg"
  },
  {
    username: 'QueenEliminator',
    mixer: true
  },
  {
    username: 'NICKMERCS',
    twitch: true
  },
  {
    username: "CouRage",
    youtube: true,
    channelId: "UCrgTEmBuoObZiEXvZ6r3PQg"
  },
  {
    username: 'DrLupo',
    twitch: true
  },
  {
    username: "Valkyrae",
    youtube: true,
    channelId: "UCWxlUwW9BgGISaakjGM37aw"
  },
  {
    username: 'xQcOW',
    twitch: true
  },
  {
    username: 'Ninja',
    mixer: true
  },
  {
    username: 'Annemunition',
    twitch: true
  },
  {
    username: 'monstercat',
    twitch: true
  },
  {
    username: 'Lurxx',
    mixer: true
  },
  {
    username: "ChilledCow",
    youtube: true,
    channelId: "UCSJ4gkVC6NrvII8umztf0Ow"
  }
];

function followingOnline(following) {
  return fetch(followingOnlineUrl, {
      mode: 'cors',
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(following)
    })
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      return result;
    })
    .catch(err => {
      console.log(err);
      return [];
    });
}

function streamerSearch(streamer) {
  return fetch(searchUsernameUrl, {
    mode: 'cors',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: streamer
  })
  .then((response) => {
    return response.json();
  })
  .then((result) => {
    return result;
  })
  .catch(err => {
    console.log(err);
    return [];
  });
}

function getUniqueStreamerId(streamer) {
    var platform = streamer.twitch ? "twitch" : streamer.mixer ? "mixer" : streamer.youtube ? "youtube" : "";

    if (platform !== "") {
        return LZString.compressToBase64(streamer.username + platform);
    }
    else {
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
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
}

// https://stackoverflow.com/a/12646864
//
/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }
}
