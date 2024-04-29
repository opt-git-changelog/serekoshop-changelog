// Kwikpass script to add reusable functions - [Starts] 

  function openIframe(eventType = "") {
    const iframe = document.createElement('iframe');
    iframe.src = `https://pdp.gokwik.co/kwikpass/kwikpass-sso.html?eventType=${eventType}`;
    iframe.style.display="none";
    document.body.appendChild(iframe);
  }

  // get device Width -> used to add UI and functionality based on device width
  function getDeviceWidth(){
    return window.innerWidth;
  }
  
  // check if cookie exists
  function checkCookieExists(cookieName) {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [name] = cookie.split('=').map((c) => c.trim());
        if (name === cookieName) {
            return true;
        }
    }
    return false;
  }

   const getCookieValue = (key) => {
    const cookies = document.cookie.split(';').map((cookie) => cookie.trim());
    for (const cookie of cookies) {
      const [cookieKey, cookieValue] = cookie.split('=');
      if (cookieKey === key) {
        return cookieValue;
      }
    }
    return null;
  };

  const getLocalStorageValue = (key, isNotIncognito = true) => {
    return isNotIncognito && localStorage.getItem(key);
  };

  const getValueFromCookiesOrLocalStorage = (key, isNotIncognito = true) => {
    const cookieValue = getCookieValue(key);
    if (cookieValue == null) {
      const localStorageValue = getLocalStorageValue(key, isNotIncognito);
      return localStorageValue;
    }

    return cookieValue;
  };

  const deleteLocalStorageValue = (key, isNotIncognito = true) => {
    isNotIncognito && localStorage.removeItem(key);
  };

  function deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }

  const deleteValueFromCookiesAndLocalStorage = (key, isNotIncognito = true) => {
    deleteCookie(key);
    deleteLocalStorageValue(key, isNotIncognito);
  }

  // extract rgb values 
  function extractRGBValues(rgbColor,opacity=1) {
    const values = rgbColor.match(/\d+/g);
    if (values) {
        const r = parseInt(values[0]);
        const g = parseInt(values[1]);
        const b = parseInt(values[2]);
        return `rgba(${r},${g},${b},${opacity})`
    } else {
        return null; // Invalid RGB color format
    }
  }

  // to get background color from header, if we didn't get color from parent, look background color of parent's parent until we get background color of header.
  function findBackgroundColor(element) {
    while (element) {
      const computedStyle = window.getComputedStyle(element);
      const backgroundColor = computedStyle.backgroundColor;  
      // Check if the background color is defined and not transparent
      if (backgroundColor && backgroundColor !== 'rgba(0, 0, 0, 0)') {
        return backgroundColor;
      }  
      // Move to the parent element
      element = element.parentElement;
    }  
    // If no defined background color is found in any ancestor, return a default value (e.g., null or 'white')
    return 'rgba(255,255,255,1)';
  }

  // to get core token based on environment
  const XGokwikCoreToken = (env) => {
      if (env === 'dev' || env === 'local' || env === 'hdev' || env === 'qatwo' || env === 'ndev' || env === 'idev') {
        return 'SANDBOXKWIKSESSIONTOKEN';
      } else if (env === 'production' || env === 'pci-prod') {
        return 'KWIKSESSIONTOKEN';
      } else if (env === 'sandbox') {
        return 'SANDBOXKWIKSESSIONTOKEN';
      } else if (env === 'qa') {
        return 'QAKWIKSESSIONTOKEN';
      }
      return 'SANDBOXKWIKSESSIONTOKEN';
  };
  
  // to get kwikpass token based on environment
   const XGokwikToken = (env) => {
        if (env === 'dev' || env === 'local' || env === 'hdev' || env === 'qatwo' || env === 'ndev' || env === 'idev') {
          return 'DEVKWIKUSERTOKEN';
        } else if (env === 'production' || env === 'pci-prod') {
          return 'KWIKUSERTOKEN';
        } else if (env === 'sandbox') {
          return 'SANDBOXKWIKUSERTOKEN';
        } else if (env === 'qa') {
          return 'QAKWIKUSERTOKEN';
        }
        return 'DEVKWIKUSERTOKEN';
  };

  // get kwikpass checkout token based on environment
  const getKwikpassCheckoutToken = (env) => {
      switch (env) {
      case 'dev':
          return 'DEVKWIKPASSTOKEN';
          case 'production':
          return 'KWIKPASSTOKEN';
          case 'sandbox':
          return 'SANDBOXKWIKPASSTOKEN';
          case 'qa':
          return 'QAKWIKPASSTOKEN';
          default:
          return 'DEVKWIKPASSTOKEN';
      }
  };

  const handleLogout = () => {
      // get logout button element by ID present in our dropdown in desktop and mobile    
      const logoutElement = document.getElementById("logout-button-desktop")
      const logoutElementMobile = document.getElementById("logout-button-mobile")

      // if element is present -> disable it and decrease the opacity during loading
         if(logoutElementMobile){
           logoutElementMobile.setAttribute("disabled","disabled")
          logoutElementMobile.style.opacity = "0.7"
         }

      // if element is present -> disable it and decrea the opacity during loading
      if(logoutElement){
           logoutElement.setAttribute("disabled","disabled")
          logoutElement.style.opacity = "0.7"
      } 

      // remove keys from localStorage, sessionStorage and cookie on logout
      sessionStorage.setItem('isLogout', true);
      deleteValueFromCookiesAndLocalStorage(XGokwikToken(window.merchantInfo.environment));
      deleteValueFromCookiesAndLocalStorage(XGokwikCoreToken(window.merchantInfo.environment));
      deleteValueFromCookiesAndLocalStorage(getKwikpassCheckoutToken(window.merchantInfo.environment));
      deleteValueFromCookiesAndLocalStorage('kp_phone_number');
      sessionStorage.removeItem('isShopifySession');
      deleteValueFromCookiesAndLocalStorage('notify_phone_number');
      sessionStorage.removeItem('isLoginTagUpdate');
    
      // close the dropdown if opened
      isDropdownVisible = false
      isDropdownMobileVisible = false  
      localStorage.removeItem('kp_email');
      localStorage.removeItem('kp_customer_id')
      localStorage.removeItem('kp_customer_state');
      localStorage.removeItem('needsToUpdatePhone');
      deleteCookie("coupon_applied", "/");

      // remove disable attribute and update the opacity once api successfullly executed and user logged out from kwikpass.
       if(logoutElement){
         logoutElement.removeAttribute("disabled")
         logoutElement.style.opacity = "1"
       } 
      // remove disable attribute and update the opacity once api successfullly executed and user logged out from kwikpass. - mobile
       if(logoutElementMobile){
         logoutElementMobile.removeAttribute("disabled")
         logoutElementMobile.style.opacity = "1"
       }

      // To logout user from shopify     
          window.location.href = '/account/logout';
  }
    
  function handleShopifyLogin(e, redirectLink) {    
        let currentElement = e.target;
          const customerId = getCustomerId();
          if (customerId === null) {
            const event = new CustomEvent('shopify-session', {
              detail: { redirectUrl: redirectLink },
            });
            if(isElementsWithAccountClickable){
              isElementsWithAccountClickable = false;
              currentElement.classList.add("kp-disabled-text-color");
              setTimeout(()=>{
                isElementsWithAccountClickable=true;
                currentElement.classList.remove("kp-disabled-text-color");
              },2000)
              window.dispatchEvent(event);              
            }
          }else{
            window.location.href = redirectLink
          }
  }
// Kwikpass script to add reusable functions - [Ends] 
