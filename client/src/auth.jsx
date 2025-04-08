import axios from 'axios'
const serverUrl = import.meta.env.VITE_SERVER_URL

function auth(){
    const login = async () => {
        await axios.post(`${serverUrl}/api/auth/signin`,{
            email:'aditya18n@gmail.com',
            password:'aditya2219'
        },{
            withCredentials:true
        })
    }

    const logout = async () => {
        try {
            await axios.post(`${serverUrl}/api/auth/logout`,{
                email:"aditya18n@gmail.com"
            },{
            withCredentials:true
        })
        } catch (error) {
            console.log(error.message);
        }
    }
    

    return (
        <div>
            <button onClick={login}>AUTH</button>
            <button onClick={logout}>LOGOUT</button>
        </div>
    )
}

export default auth