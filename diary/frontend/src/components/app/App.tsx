import Routes from '../routes/Routes.tsx';
import useAuthCheck from "@/hooks/useAuthCheck.ts";

const App = () => {
    useAuthCheck();
    return (
        <Routes />
    );
};

export default App;