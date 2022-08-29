import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import { AppHome, MainHome } from './pages/home';
import Layout from './pages/_layout';
import { PostListings } from './pages/iterator';
import Content from './pages/content';
import { AboutPage } from './pages/info';
import Search from './pages/search';

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);
root.render(
	<StrictMode>
		<HashRouter>
			<Routes>
				<Route path="/" element={<Layout simple />}>
					<Route index element={<MainHome />} />
				</Route>
				<Route path="/:inputURL/" element={<Layout />}>
					<Route index element={<AppHome />} />
					<Route path="about" element={<AboutPage />} />
					<Route path="search/:seachTerms" element={<Search />} />
					<Route path="search/:seachTerms/:pageID" element={<Search />} />
					<Route path="post/:postID" element={<Content posts />} />
					<Route path="page/:postID" element={<Content pages />} />
					<Route path="posts" element={<PostListings posts />} />
					<Route path="posts/:pageID" element={<PostListings posts />} />
					<Route path="pages" element={<PostListings pages />} />
					<Route path="pages/:pageID" element={<PostListings pages />} />
					<Route path="posts/category/:searchID" element={<PostListings posts categories />} />
					<Route path="posts/category/:searchID/:pageID" element={<PostListings posts categories />} />
					<Route path="posts/tag/:searchID" element={<PostListings posts tax />} />
					<Route path="posts/tag/:searchID/:pageID" element={<PostListings posts tax />} />
					<Route path="pages/category/:searchID" element={<PostListings pages categories />} />
					<Route path="pages/category/:searchID/:pageID" element={<PostListings pages categories />} />
					<Route path="pages/tag/:searchID" element={<PostListings pages tax />} />
					<Route path="pages/tag/:searchID/:pageID" element={<PostListings pages tax />} />
				</Route>
			</Routes>
		</HashRouter>
	</StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register({
	onUpdate: (registration: ServiceWorkerRegistration) => {
		if (registration && registration.waiting) {
			registration.waiting.postMessage({ type: 'SKIP_WAITING' });
		}

		window.location.reload();
	}
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
