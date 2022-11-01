// 함께 아는 친구를 기준으로 추천 점수를 구하는 기능
const scoreFromMutual = (user, allFriendsArr) => {
  let friendsOfUser = allFriendsArr.filter((friends) => {
    return friends[0] == user || friends[1] == user;
  });
  if (friendsOfUser.length != 0) {
    friendsOfUser = friendsOfUser.reduce((prev, curr) => prev.concat(curr));
    friendsOfUser = friendsOfUser.filter((friends) => {
      return friends != user;
    });
  }

  let notFriendsOfUser = allFriendsArr.filter((friends) => {
    return friends[0] != user && friends[1] != user;
  });

  let mutualFriendsObj = {};
  if (friendsOfUser.length != 0) {
    for (i = 0; i < friendsOfUser.length; i++) {
      for (j = 0; j < notFriendsOfUser.length; j++) {
        if (friendsOfUser[i] == notFriendsOfUser[j][0]) {
          if (Object.keys(mutualFriendsObj).includes(notFriendsOfUser[j][1])) {
            mutualFriendsObj[notFriendsOfUser[j][1]] += 10;
          } else {
            mutualFriendsObj[notFriendsOfUser[j][1]] = 10;
          }
        } else if (friendsOfUser[i] == notFriendsOfUser[j][1]) {
          if (Object.keys(mutualFriendsObj).includes(notFriendsOfUser[j][0])) {
            mutualFriendsObj[notFriendsOfUser[j][0]] += 10;
          } else {
            mutualFriendsObj[notFriendsOfUser[j][0]] = 10;
          }
        }
      }
    }
  } else {
    mutualFriendsObj = {};
  }
  return [friendsOfUser, mutualFriendsObj];
};

// 사용자의 타임라인에 방문한 횟수 기준으로 추천 점수를 구하는 기능
const scoreFromVisit = (visitors) => {
  let visitorsObj = {};
  for (i = 0; i < visitors.length; i++) {
    if (Object.keys(visitorsObj).includes(visitors[i])) {
      visitorsObj[visitors[i]] += 1;
    } else {
      visitorsObj[visitors[i]] = 1;
    }
  }
  return visitorsObj;
};

function problem7(user, friends, visitors) {
  var answer;

  let candidateFriends = {};
  let userFriends;
  let scoreFromMutualObj = scoreFromMutual(user, friends)[1];
  let scoreFromVisitObj = scoreFromVisit(visitors);

  if (Object.keys(scoreFromVisitObj).length == 0) {
    if (Object.keys(scoreFromMutualObj).length == 0) {
      candidateFriends = {};
    } else {
      candidateFriends = scoreFromMutualObj;
    }
  } else {
    if (Object.keys(scoreFromMutualObj).length == 0) {
      candidateFriends = scoreFromVisitObj;
    } else {
      for (i = 0; i < Object.keys(scoreFromVisitObj).length; i++) {
        for (j = 0; j < Object.keys(scoreFromMutualObj).length; j++) {
          if (
            Object.keys(scoreFromVisitObj)[i] ==
            Object.keys(scoreFromMutualObj)[j]
          ) {
            candidateFriends[Object.keys(scoreFromVisitObj)[i]] =
              Object.values(scoreFromVisitObj)[i] +
              Object.values(scoreFromMutualObj)[j];
          } else {
            candidateFriends[Object.keys(scoreFromVisitObj)[i]] =
              Object.values(scoreFromVisitObj)[i];
            candidateFriends[Object.keys(scoreFromMutualObj)[j]] =
              Object.values(scoreFromMutualObj)[j];
          }
        }
      }
    }
  }

  userFriends = scoreFromMutual(user, friends)[0];

  let keyOfCandidateFriends = Object.keys(candidateFriends);

  for (i = 0; i < keyOfCandidateFriends.length; i++) {
    for (j = 0; j < userFriends.length; j++)
      if (keyOfCandidateFriends[i] == userFriends[j]) {
        delete candidateFriends[keyOfCandidateFriends[i]];
      }
  }

  let sortedCandidateFriends = [];
  for (let name in candidateFriends) {
    sortedCandidateFriends.push([name, candidateFriends[name]]);
  }

  sortedCandidateFriends = sortedCandidateFriends.sort((a, b) => {
    return b[1] - a[1];
  });

  sortedCandidateFriends = sortedCandidateFriends.sort((a, b) => {
    if (a[1] == b[1]) {
      return a < b ? -1 : a > b ? 1 : 0;
    }
  });

  sortedCandidateFriends = sortedCandidateFriends.map((friends) => {
    if (friends[1] != 0) {
      return friends[0];
    }
  });

  answer = sortedCandidateFriends.slice(0, 5);
  return answer;
}

module.exports = problem7;
