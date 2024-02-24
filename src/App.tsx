import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Footer from "./components/footer";
import Navbar from "./components/navbar";
import HomePage from "./pages";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: true,
			retryOnMount: true,
			refetchOnWindowFocus: false,
		},
	},
});

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<div className="min-h-screen flex-col justify-between">
				<Navbar></Navbar>
				<HomePage></HomePage>
				<Footer></Footer>
			</div>
		</QueryClientProvider>
	);
}

export default App;
