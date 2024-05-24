const shareOnFacebook = () => {
  const host = window.location.href;
  const fbUrl = `http://www.facebook.com/sharer/sharer.php?s=100&u=${host}`;
  const width = 500; const
    height = 500;
  const left = (window.screen.width / 2) - ((width / 2) + 10);
  const top = (window.screen.height / 2) - ((height / 2) + 50);
  const popUp = window.open(fbUrl, 'popupwindow', `scrollbars=no,width=${width},height=${height},top=${top},left=${left}`);
  popUp.focus();
  return false;
};

// ToDO: Check the access token and the common utility that provides this function
function twitterShare(url, title) {
  const accessToken = '9527e28e6d356bde17df2745795e5ab7d24444a9';
  const apiUrl = 'https://api-ssl.bitly.com/v4/shorten';

  const params = {
    long_url: apiUrl,
    group_guid: 'Bd2jeFNJyhx',
    custom_bitlinks: ['infy.com'],
  };

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(params),
  };

  fetch(apiUrl, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Network response was not ok ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      const responseUrl = String(data.link);

      const width = 500;
      const height = 500;

      const left = (window.screen.width / 2) - ((width / 2) + 10);
      const top = (window.screen.height / 2) - ((height / 2) + 50);

      const twitterUrl = `https://twitter.com/intent/tweet?url=${responseUrl}&text=${title}`;
      const popUp = window.open(twitterUrl, 'popupwindow', `scrollbars=no,width=${width},height=${height},top=${top},left=${left}`);
      popUp.focus();
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error('There was a problem with the fetch operation:', error);
    });
  return false;
}

const shareOnTwitter = () => {
  twitterShare(window.location.href, encodeURIComponent(document.title));
  return false;
};

const shareOnLinkedIn = () => {
  const host = window.location.href;
  const { title } = document.title;
  const liUrl = `http://www.linkedin.com/shareArticle?mini=true&url=${host}&title=${title}`;
  const width = 500; const
    height = 500;
  const left = (window.screen.width / 2) - ((width / 2) + 10);
  const top = (window.screen.height / 2) - ((height / 2) + 50);
  const popUp = window.open(encodeURI(liUrl), 'popupwindow', `scrollbars=no,width=${width},height=${height},top=${top},left=${left}`);
  popUp.focus();
  return false;
};

const copyToClipboard = () => {
  const host = window.location.href;
  navigator.clipboard.writeText(host);
  // trigger alert to confirm the link has been copied
  // eslint-disable-next-line no-alert
  alert(`Link copied to clipboard: ${host}`);
  return false;
};

export default async function decorate(block) {
  const socialLinks = Array.from(block.children).map((socialItem) => {
    const iconClass = socialItem?.children[0]?.querySelector('.icon').className;
    const text = socialItem?.children[1]?.querySelector('p').textContent.trim();
    return { iconClass, text };
  });

  // Clear the original content
  block.innerHTML = '';

  const generateOnClick = (platform) => {
    switch (platform) {
      case 'facebook':
        return shareOnFacebook;
      case 'twitter':
        return shareOnTwitter;
      case 'linked-in':
        return shareOnLinkedIn;
      case 'chain':
        return copyToClipboard;
      default:
        return () => {};
    }
  };

  // Create new structure
  socialLinks.forEach(({ iconClass, text }) => {
    const platform = iconClass.substring(iconClass.indexOf('icon-') + 5);
    const a = document.createElement('a');
    a.href = '#';
    a.onclick = generateOnClick(platform);
    a.className = 'social';
    a.title = text;

    const iconSpan = document.createElement('span');
    iconSpan.className = iconClass;

    a.appendChild(iconSpan);
    block.appendChild(a);
  });
}
