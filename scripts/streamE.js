var debouncedSearch = debounce(search, 350);
var searchResults = [];
var following = DEFAULT_FOLLOWING;
var watchingStreamer;
var initialPageLoad = true;

var followingOpen = true;
var chatOpen = false;

var TWITCH_ROOT_URL = 'https://twitch.com/';
var YOUTUBE_ROOT_URL = 'https://youtube.com/channel/';

var LIVE_INDICATOR_DOT = `<span class="liveIndicatorDot"></span>`;
var FOLLOW_WATCHING_STREAMER = `<ion-icon id="followerStreamer" name="add-outline" class="followBtn" onclick="followStreamer(watchingStreamer)"></ion-icon>`;

function addSearchResult(searchResult, index) {
  var newSearchResult = `<div id="${index}" class="searchResult" onclick="watchSearchResult(${index})">`;

  if (searchResult.twitch) {
    newSearchResult += `<img src="./assets/TwitchGlitchPurple.svg" class="platformImg">`;
  } else if (searchResult.youtube) {
    newSearchResult += `<img src="./assets/youtube_social_circle_white.png" class="platformImg">`;
  }

  if (searchResult.logo) {
    newSearchResult += `<img src="${searchResult.logo}" class="searchResultImg">`;
  }

  newSearchResult += `<span>${searchResult.username}</span>`;

  var streamerFollowed = false;
  following.forEach((followed) => {
    if (followed.username === searchResult.username) {
      streamerFollowed = true;
    }
  });

  if (!streamerFollowed) {
    newSearchResult += `<ion-icon name="add-outline" class="followBtn" onclick="followSearchResult(${index})"></ion-icon>`;
  }

  newSearchResult += `</div>`;

  document.getElementById('searchResults').innerHTML += newSearchResult;
}

function toggleViews(toggleFollowingList, toggleChat) {
  let previousChatOpen = chatOpen;

  if (toggleFollowingList) {
    followingOpen = !followingOpen;
  }
  if (toggleChat) {
    chatOpen = !chatOpen;
  }

  if (chatOpen && previousChatOpen !== chatOpen) {
    if (watchingStreamer && watchingStreamer.username) {
      loadChatForStreamer(watchingStreamer);
    }
  } else if (!chatOpen) {
    document.getElementById('chat_embed').src = '';
    document.getElementById('youtubeChatWarning').style.display = 'none';
  }

  var followingView = followingOpen ? 'following ' : '';
  var chatView = chatOpen ? ' chat' : '';

  var newContainer = '';

  newContainer += `"${followingOpen ? 'navbar ' : ''}navbar${chatOpen ? ' navbar' : ''}"`;
  newContainer += `'${followingView}search${chatView}'`;
  newContainer += `'${followingView}titleContent${chatView}'`;
  newContainer += `'${followingView}mainContent${chatView}'`;
  newContainer += `'${followingView}subTitleContent${chatView}'`;
  newContainer += `'${followingOpen ? 'footer ' : ''}footer${chatOpen ? ' footer' : ''}'`;

  document.getElementById('container').style.gridTemplateAreas = newContainer;

  var firstColumn = followingOpen ? '200px ' : '';
  var secondColumn = followingOpen && chatOpen ? '8.5fr' : followingOpen ? 'auto' : chatOpen ? '8.5fr' : 'auto';
  var thirdColumn = chatOpen ? ' 1.5fr' : '';

  document.getElementById('container').style.gridTemplateColumns = firstColumn + secondColumn + thirdColumn;

  document.getElementById('following').style.display = followingOpen ? 'block' : 'none';
  document.getElementById('chat').style.display = chatOpen ? 'block' : 'none';

  document.getElementById('openFollowingArrow').style.display = followingOpen ? 'none' : 'block';
  document.getElementById('closeFollowingArrow').style.display = followingOpen ? 'block' : 'none';

  document.getElementById('openChatBox').style.display = chatOpen ? 'none' : 'block';
  document.getElementById('closeChatBox').style.display = chatOpen ? 'block' : 'none';

  var centerMarginLeft = followingOpen ? '-200px' : '0px';
  var centerMarginRight = chatOpen ? '-18%' : '0px';

  document.getElementById('searchContainer').style.marginLeft = centerMarginLeft;
  document.getElementById('searchContainer').style.marginRight = centerMarginRight;
  document.getElementById('titleContent').style.marginLeft = centerMarginLeft;
  document.getElementById('titleContent').style.marginRight = centerMarginRight;
  document.getElementById('subTitleContent').style.marginLeft = centerMarginLeft;
  document.getElementById('subTitleContent').style.marginRight = centerMarginRight;
}

function addFollowed(following, index) {
  var uniqueStreamerId = getUniqueStreamerId(following);

  var newFollow = `<div class="followingContainer" id="${uniqueStreamerId}_container">`;
  newFollow += `<div class="inlineContainer">`;
  newFollow += `<div id="${uniqueStreamerId}" class="followingUser" onclick="watchFollowing('${following.username}')">`;

  if (following.twitch) {
    newFollow += `<img src="./assets/TwitchGlitchPurple.svg" class="platformImg">`;
  } else if (following.youtube) {
    newFollow += `<img src="./assets/youtube_social_circle_white.png" class="platformImg">`;
  }

  newFollow += `<span>${following.username}</span>`;
  newFollow += '</div>';
  newFollow += `<ion-icon name="remove-circle-outline" class="stopFollowing" onclick="stopFollowingStreamer('${following.username}')"></ion-icon>`;
  newFollow += '</div>';
  newFollow += '</div>';

  document.getElementById('followingList').innerHTML += newFollow;
}

function followSearchResult(index) {
  if (event.stopPropagation) {
    event.stopPropagation();
  }

  followStreamer(searchResults[index]);
}

function followStreamer(streamer) {
  var uniqueStreamerId = getUniqueStreamerId(streamer);

  following.push(streamer);

  updateFollowingHash();

  addFollowed(streamer, following.length - 1);

  if (watchingStreamer && getUniqueStreamerId(watchingStreamer) === uniqueStreamerId) {
    document.getElementById('followerStreamer').remove();

    if (watchingStreamer.live) {
      document.getElementById(uniqueStreamerId).innerHTML += LIVE_INDICATOR_DOT;
    }
  } else if (ENABLE_ONLINE_CALLS) {
    followingOnline([streamer]).then((res) => {
      if (res && res.length === 1) {
        var streamerOnlineResult = res[0];

        if (streamerOnlineResult.live) {
          document.getElementById(uniqueStreamerId).innerHTML += LIVE_INDICATOR_DOT;
        }
      }
    });
  }
}

function stopFollowingStreamer(streamerUsername) {
  following.some((followed, index) => {
    if (followed.username === streamerUsername) {
      var uniqueStreamerId = getUniqueStreamerId(followed);

      document.getElementById(uniqueStreamerId + '_container').remove();

      if (watchingStreamer && getUniqueStreamerId(watchingStreamer) === uniqueStreamerId) {
        document.getElementById('titleContentHeader').innerHTML =
          FOLLOW_WATCHING_STREAMER + document.getElementById('titleContentHeader').innerHTML;
      }

      following.splice(index, 1);

      updateFollowingHash();

      return true;
    }
  });
}

function updateFollowingHash() {
  var followingHashList = [];

  following.forEach((followed) => {
    var followObj = {
      username: followed.username,
    };

    if (followed.twitch) {
      followObj.twitch = true;
    } else if (followed.youtube) {
      followObj.youtube = true;
      followObj.channelId = followed.channelId;
    }

    followingHashList.push(followObj);
  });

  var followingHash = LZString.compressToBase64(JSON.stringify(followingHashList));

  localStorage.setItem('following', followingHash);
  window.location.hash = followingHash;
}

function checkFollowingOnline() {
  if (ENABLE_ONLINE_CALLS) {
    followingOnline(following).then((res) => {
      if (res && res.length > 0) {
        following = res;

        updateFollowingOnline();
      }
    });
  }
}

function updateFollowingOnline() {
  liveList = [];

  following.forEach((followed) => {
    if (followed.live) {
      liveList.push(followed);
      var uniqueStreamerId = getUniqueStreamerId(followed);

      document.getElementById(uniqueStreamerId).innerHTML += LIVE_INDICATOR_DOT;
    }
  });

  if (initialPageLoad && !watchingStreamer) {
    initialPageLoad = false;
    watchStreamer(liveList[getRandomInt(0, liveList.length)]);
  }
}

function watchFollowing(streamerUsername) {
  following.some((followed) => {
    if (followed.username === streamerUsername) {
      watchStreamer(followed);

      return true;
    }
  });
}

function watchSearchResult(index) {
  var streamer = searchResults[index];

  following.forEach((followed) => {
    if (followed.username === streamer.username) {
      streamer = followed;
    }
  });

  watchStreamer(streamer);
  clearSearchResults();
  document.getElementById('searchbox').value = '';
}

function loadChatForStreamer(streamer) {
  if (streamer && streamer.username) {
    if (streamer.twitch) {
      document.getElementById(
        'chat_embed'
      ).src = `https://www.twitch.tv/embed/${streamer.username}/chat?darkpopout&parent=${window.location.hostname}`;
      document.getElementById('youtubeChatWarning').style.display = 'none';
    } else if (streamer.youtube) {
      if (streamer.videoId) {
        document.getElementById('chat_embed').src = '';
        document.getElementById('youtubeChatWarning').style.display = 'block';

        window.open(`https://www.youtube.com/live_chat?v=${streamer.videoId}`);
      }
    }
  }
}

function watchStreamer(streamer) {
  var videoContent = '';
  var streamerLink = '<a target="_blank" href="';
  var endOfStreamerLink = `${streamer.username}">${streamer.username}</a>`;

  clearVideo();

  document.getElementById('textContent').style.display = 'none';

  watchingStreamer = streamer;

  if (streamer.twitch) {
    var twitchOptions = {
      width: '100%',
      height: '100%',
      channel: streamer.username,
      layout: 'video-with-chat',
    };
    streamerLink += TWITCH_ROOT_URL + endOfStreamerLink;

    new Twitch.Player('videoContent', twitchOptions);
  } else if (streamer.youtube) {
    videoContent = `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/live_stream?channel=${streamer.channelId}&autoplay=1"></iframe>`;
    streamerLink += `${YOUTUBE_ROOT_URL}${streamer.channelId}">${streamer.username}</a>`;

    document.getElementById('videoContent').innerHTML = videoContent;
  }

  if (chatOpen) {
    loadChatForStreamer(streamer);
  }

  var followButton = FOLLOW_WATCHING_STREAMER;

  following.forEach((followed) => {
    if (followed.username === streamer.username) {
      followButton = '';
    }
  });

  let streamTitle = streamer.title ? streamer.title : '';
  let category = streamer.category ? streamer.category : '';

  let subTitle = streamTitle;
  if (category !== '') {
    subTitle += ' - ' + category;
  }

  if (streamer.live !== null && streamer.live !== undefined) {
    var liveIndicator = streamer.live ? LIVE_INDICATOR_DOT : '';

    document.getElementById('titleContentHeader').innerHTML = followButton + streamerLink + liveIndicator;
    document.getElementById('subTitleContentHeader').innerText = subTitle;
  } else {
    document.getElementById('titleContentHeader').innerHTML = followButton + streamerLink;
    document.getElementById('subTitleContentHeader').innerText = subTitle;

    if (ENABLE_ONLINE_CALLS) {
      followingOnline([streamer]).then((res) => {
        if (res && res.length === 1) {
          watchingStreamer = res[0];
          var liveIndicator = watchingStreamer.live ? LIVE_INDICATOR_DOT : '';

          let streamTitle = watchingStreamer.title ? watchingStreamer.title : '';
          let category = watchingStreamer.category ? watchingStreamer.category : '';

          let subTitle = streamTitle;
          if (category !== '') {
            subTitle += ' - ' + category;
          }

          document.getElementById('titleContentHeader').innerHTML = followButton + streamerLink + liveIndicator;
          document.getElementById('subTitleContentHeader').innerText = subTitle;
        }
      });
    }
  }
}

function externalClearSearchResults() {
  document.getElementById('searchbox').value = '';
  clearSearchResults();
}

function clearSearchResults() {
  searchResults = [];
  document.getElementById('searchResults').innerHTML = '';
  document.getElementById('searchResults').style.display = 'none';
}

function search() {
  var query = document.getElementById('searchbox').value;

  if (query && query.length >= 3) {
    document.getElementById('searchResults').style.display = 'block';
    document.getElementById('searchResults').innerHTML = '';

    if (ENABLE_SEARCH_CALLS) {
      streamerSearch(query).then((results) => {
        searchResults = results;

        searchResults.forEach((result, idx) => {
          addSearchResult(result, idx);
        });
      });
    }
  } else {
    clearSearchResults();
  }
}

function clearVideo() {
  watchingStreamer = null;
  document.getElementById('videoContent').innerHTML = '';
  document.getElementById('titleContentHeader').innerText = '';
  document.getElementById('subTitleContentHeader').innerText = '';
}

function resetPage() {
  var mainContent = document.getElementById('mainContent');

  mainContent.classList = 'mainContent';
  mainContent.offsetWidth; // trick to allow CSS animation to be re-triggered (https://css-tricks.com/restart-css-animation/)
  mainContent.classList = 'mainContent shadow-inset-center';

  clearVideo();

  document.getElementById('textContent').style.display = 'block';

  var liveIndicators = document.getElementsByClassName('liveIndicatorDot');
  while (liveIndicators[0]) {
    liveIndicators[0].parentNode.removeChild(liveIndicators[0]);
  }

  clearSearchResults();
  fillFollowingList();
  checkFollowingOnline();
}

function getFollowingHash() {
  var followingHashArr;

  if (window.location.hash) {
    try {
      followingHashArr = JSON.parse(LZString.decompressFromBase64(window.location.hash.substring(1)));
    } catch (ex) {
      console.log(ex);
    }

    if (followingHashArr && followingHashArr.length > 0) {
      following = followingHashArr;
      updateFollowingHash();
    }

    fillFollowingList();
    checkFollowingOnline();
  } else if (window.localStorage.getItem('following')) {
    var followingHash = window.localStorage.getItem('following');

    try {
      followingHashArr = JSON.parse(LZString.decompressFromBase64(followingHash));
    } catch (ex) {
      console.log(ex);
    }

    if (followingHashArr && followingHashArr.length > 0) {
      following = followingHashArr;
      window.location.hash = followingHash;
    }

    fillFollowingList();
    checkFollowingOnline();
  } else {
    fillFollowingList();

    defaultFollowing()
      .then((result) => {
        following = result;

        fillFollowingList();
        updateFollowingOnline();
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

function fillFollowingList() {
  document.getElementById('followingList').innerHTML = '';

  let liveList = [];
  following.forEach((follower, index) => {
    if (follower.live) {
      liveList.push(follower);
    }

    addFollowed(follower, index);
  });
}

function clearFollowingHash() {
  document.getElementById('followingList').innerHTML = '';
  window.localStorage.removeItem('following');
  window.location.hash = '';
  following = [];

  if (watchingStreamer) {
    document.getElementById('titleContent').innerHTML =
      FOLLOW_WATCHING_STREAMER + document.getElementById('titleContent').innerHTML;
  }
}

function onPageLoad() {
  getFollowingHash();

  document.getElementById('searchbox').addEventListener('search', () => {
    clearSearchResults();
  });

  document.getElementById('copyDate').innerText = new Date().getFullYear();
}

window.onload = onPageLoad;
