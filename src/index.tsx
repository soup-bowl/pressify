import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AboutPage, AppHome, Content, Layout, PostListings, Search } from '@/pages';

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);
root.render(
	<StrictMode>
		<HashRouter>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route index element={<AppHome />} />
					<Route path="/:inputURL/">
						<Route index element={<AppHome />} />
						<Route path="about" element={<AboutPage />} />
						<Route path="search/:seachTerms" element={<Search />} />
						<Route path="search/:seachTerms/:pageID" element={<Search />} />
						{/* Posts */}
						<Route path="post/:postID" element={<Content posts />} />
						<Route path="posts" element={<PostListings posts />} />
						<Route path="posts/:pageID" element={<PostListings posts />} />
						<Route path="posts/category/:searchID" element={<PostListings posts categories />} />
						<Route path="posts/category/:searchID/:pageID" element={<PostListings posts categories />} />
						<Route path="posts/tag/:searchID" element={<PostListings posts tax />} />
						<Route path="posts/tag/:searchID/:pageID" element={<PostListings posts tax />} />
						{/* Pages */}
						<Route path="page/:postID" element={<Content pages />} />
						<Route path="pages" element={<PostListings pages />} />
						<Route path="pages/:pageID" element={<PostListings pages />} />
						<Route path="pages/category/:searchID" element={<PostListings pages categories />} />
						<Route path="pages/category/:searchID/:pageID" element={<PostListings pages categories />} />
						<Route path="pages/tag/:searchID" element={<PostListings pages tax />} />
						<Route path="pages/tag/:searchID/:pageID" element={<PostListings pages tax />} />
					</Route>
				</Route>
			</Routes>
		</HashRouter>
	</StrictMode>
);
