const main = () => {
  let users;

  axios.get('/getUsers')
    .then(result => {
      users = result.data;
    });

  const searchInput = document.querySelector('.input-users input');
  const searchResultsElement = document.querySelector('div.search-results');

  const findUsers = (search) => {
    return users.filter(user => {
      if (search === '') {
        return null;
      }
      return user.username.toLowerCase().includes(search);
    });
  };

  const displayResults = (usersFound) => {
    searchResultsElement.innerHTML = '';
    const usersList = document.createElement('ul');
    usersFound.forEach(function (user) {
      const userListElement = document.createElement('li');
      const userLinkElement = document.createElement('a');
      const addFriendForm = document.createElement('form');
      const addFriendButton = document.createElement('button');
      addFriendButton.className = ('add-friends-but');
      addFriendForm.setAttribute('method', 'POST');
      addFriendForm.setAttribute('action', '/users/' + user._id + '/add_friend');
      addFriendButton.setAttribute('type', 'submit');
      addFriendButton.innerText = 'Follow';
      userLinkElement.innerHTML = user.username;
      userLinkElement.href = '/users/' + user._id;
      usersList.appendChild(userListElement);
      userListElement.appendChild(userLinkElement);
      userListElement.appendChild(addFriendForm);
      addFriendForm.appendChild(addFriendButton);
    });
    searchResultsElement.appendChild(usersList);
  };

  const handleKeyUp = () => {
    const search = searchInput.value.toLowerCase();
    const usersFound = findUsers(search);
    displayResults(usersFound);
  };

  searchInput.addEventListener('keyup', handleKeyUp);
};

window.addEventListener('load', main);
