# React Google Login + gapi

Este repositorio contiene un ejemplo de autenticación con Google en una aplicación web React utilizando la libreria `react-oauth/google`. La autenticación con Google es una forma segura y conveniente de permitir que los usuarios accedan a tu aplicación utilizando sus cuentas de Google existentes.

## Project init

```bash
npm i
```

## Install dependencies

```bash
# deprecated
npm i gapi-script
```

```bash
# deprecated
npm i react-goolge-login --force

# new
npm i react-oauth/google
```

## Configure login modal
```javascript
// deprecated
import { gapi } from 'gapi-script'
import GoogleLogin from 'react-google-login';
import { useEffect, useState } from 'react'

function App() {

  const clientId = `${import.meta.env.VITE_CLIENT_ID}`

  // states
  const [user, setUser] = useState({})
  const [accessToken, setAccessToken] = useState({})
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    gapi.load("client: auth2", () => {
      gapi.auth2.init({
        client_id: clientId,
      })
    });
  }, [clientId]);

  // function
  const onSuccess = (response) => {
    setUser(response.profileObj);
    setAccessToken({
      accessToken: response.tokenObj.access_token,
      expiresAt: response.tokenObj.expires_at,
      expiresIn: response.tokenObj.expires_in,
      idToken: response.tokenObj.id_token,
    });
    setIsAuthenticated(true);
  }

  const onFailure = (response) => {
    console.log("Login Error:", response.error)
  }

  const logout = () => {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(() => {
      setUser({});
      setAccessToken({});
      setIsAuthenticated(false);
    });
  }

  return (
    <div className='login-container'>
      <div className='login-btn '>
        {!isAuthenticated 
        ? <GoogleLogin
        clientId={clientId}
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={"single_host_policy"}
        buttonText="Iniciar sesión con Google"
        className="google-login-button" />      
        : <button onClick={logout}>Logout</button> 
      }
      </div>

      { isAuthenticated &&
        <div className="login-description">
        <img src={user.imageUrl} alt='profile_image' />
        <h3>{user.name}</h3>
        <h4>{user.email}</h4>
      </div>
      }

    </div>
  );
}

export default App;
```

## Component GoogleLogin `<iframe>`
```javascript
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

<GoogleLogin
  onSuccess={(credentialResponse) => {
    console.log(credentialResponse);
    console.log(jwtDecode(credentialResponse.credential));
    setUser(jwtDecode(credentialResponse.credential));
  }}
  onError={() => {
    console.log("Login Failed");
  }}
  useOneTap
  auto_select
/>
```

## Hook useGoogleLogin()
```javascript	
import { useGoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

  const handleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      console.log(codeResponse);
      const userInfo = await axios
        .get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${codeResponse.access_token}` },
        })
        .then((res) => res.data);

      console.log(userInfo);
      setUser(userInfo);
    },
    onError: (errorResponse) => console.log(errorResponse),
    // flow: 'implicit',
  });
  
  return ( <button onClick={handleLogin}>Sign in with Google 🚀</button> )
```

## Hook useLogout()
```javascript
import { googleLogout } from "@react-oauth/google";

  const handleLogout = () => {
    setUser(null);
    googleLogout();
  };

  return ( <button onClick={handleLogout}>Logout</button> )
```

### Json file
```json
 "dependencies": {
    "@react-oauth/google": "0.12.1",
    "axios": "1.7.9",
    "jwt-decode": "4.0.0",
    "react": "18.2.0",
    "react-dom": "18.2.0"
  },
```