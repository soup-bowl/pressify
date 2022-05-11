import logo from './logo.svg';
import './App.css';

function App() {
	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<p>Edit <code>src/App.tsx</code> and save to reload. Version {process.env.REACT_APP_VERSION}</p>
			</header>
		</div>
	);
}

export default App;
