var followingOnlineUrl = 'https://3xidp6ftp1.execute-api.us-west-2.amazonaws.com/streamE_followingOnline';
var searchUsernameUrl = 'https://3xidp6ftp1.execute-api.us-west-2.amazonaws.com/streamE_searchUsername';

var ENABLE_ONLINE_CALLS = false;
var ENABLE_SEARCH_CALLS = false;

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
    username: 'cloakzy',
    twitch: true
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
    username: 'xQcOW',
    twitch: true
  },
  {
    username: 'Ninja',
    mixer: true
  },
  {
    username: 'sodapoppin',
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
        'Content-Type': 'application/json',
        'Origin': 'http://127.0.0.1:8080'
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
      'Content-Type': 'application/json',
      'Origin': 'http://127.0.0.1:8080'
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
