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