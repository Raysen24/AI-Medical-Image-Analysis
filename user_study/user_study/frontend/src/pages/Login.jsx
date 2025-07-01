import LoginForm from "../components/LoginForm";
import background from "../assets/backgroundsvg.svg";

function Login () {
    return (
        <div 
            className="bg-tertiary p-56 h-screen relative"
            style={{
                backgroundImage: `url(${background})`,
                backgroundSize: 'cover',  // Adjust as needed (e.g., 'contain' or specific dimensions)
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            <LoginForm />
        </div>
    )
}

export default Login;