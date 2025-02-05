import { GoogleLogin, googleLogout, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
function App() {

  const [user, setUser] = useState(null);

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

  const handleLogout = () => {
    setUser(null);
    googleLogout();
  };

  return (
    <>
      {user && (
        <div className="user_card">
          <h3 className="user_name">{user.name}</h3>
          <img
            className="user_image"
            src={user.picture}
            alt={user.given_name}
          />
          <p className="user_email">{user.email}</p>
        </div>
      )}
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
      <button onClick={handleLogin}>Sign in with Google 🚀</button>
      <button onClick={handleLogout}>Logout</button>
    </>
  );
}

export default App;
