const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send({hello: 'world'});
})
app.listen(PORT);

const apiKey = '6e872fa80c654f8aaac81327518e54b1';
const root = 'https://www.bungie.net/Platform';
const headers = new Headers({'X-API-Key': apiKey});
const clientID = 40878;
let accessToken = '';
let currentUser = null;

const rewardsList = document.querySelector('.rewards');
const vendorsList = document.querySelector('.vendors');
const vendorWarning = document.querySelector('.not-logged-in-error');
const getItemForm = document.querySelector('.getItem');
const loginButton = document.querySelector('.login');
const logoutButton = document.querySelector('.logout');

const getCurrentBungieRewards = async () => {
  const endpoint = '/Tokens/Rewards/BungieRewards/';
  const response = await fetch(root + endpoint, { headers: headers }).catch(err => console.log(err));
  const data = await response.json();

  const rewards = Object.entries(data.Response);
  rewards.forEach(reward => {
    const reward_name = reward[1].RewardDisplayProperties.Name;

    const rewardElement = document.createElement('li');
    rewardElement.innerHTML = `<div class="reward-name">${reward_name}</div>`;
    rewardsList.appendChild(rewardElement);
  });
};

// const getItem = async (itemName) => {
//   const endpoint = '/Destiny/Manifest/InventoryItem/1274330687/';
//   const response = await fetch(root + endpoint, { headers: headers }).catch(err => console.log(err));
//   const data = await response.json();
//   const item = Object.entries(data.Response);
//   console.log(item[0][1]);

// };

const getVendors = async () => {
  if (accessToken !== '') {
    const endpoint = `/Destiny2/${membershipType}/Profile/${accessToken.membership_id}/Character/${characterId}/Vendors/`;
    const response = await fetch(root + endpoint, { headers: headers}).catch(err => console.log(err));
    const data = await response.json();

    console.log(data);
    vendorWarning.classList.add('d-none');
    
  };
};

const authorize = () => {
  const base = 'https://www.bungie.net/en/oauth/authorize';
  const query = `?client_id=${clientID}&response_type=code`;
  location.href = base + query;
};

const getToken = async () => {
  const urlParams = new URLSearchParams(location.search);
  if (location.href.includes("code=")) {
    const response = await fetch('https://www.bungie.net/Platform/App/OAuth/Token/', {
      method: 'POST',
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        'client_id': clientID,
        'grant_type': "authorization_code",
        'code': urlParams.get('code')
      }).toString()
    });
    const data = await response.json();
    accessToken = data;
    console.log('member id: ', accessToken.membership_id);

    const query = `/User/GetBungieNetUserById/${accessToken.membership_id}/`;
    const response2 = await fetch(root + query, {
      headers: {
        'X-API-Key': apiKey,
        'Authorization': accessToken
      }
    });
    const data2 = await response2.json();
    console.log(data2);
   
    //initialize new user
    currentUser = new User(accessToken);
  }
};

loginButton.addEventListener('click', () => {
  authorize();
  logoutButton.classList.remove('d-none');
  loginButton.classList.add('d-none');
});

// logoutButton.addEventListener('click', () => {

//   loginButton.classList.remove('d-none');
//   logoutButton.classList.add('d-none');
// });

onload = () => {
  if(location.href.includes("code=")) {
    getToken();
    
    logoutButton.classList.remove('d-none');
    loginButton.classList.add('d-none');
  } else {
    loginButton.classList.remove('d-none');
    logoutButton.classList.add('d-none');
  }
}; 

getCurrentBungieRewards();
getVendors();
// getItem();