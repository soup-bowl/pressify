import { createContext } from "react"
import { IonApp, IonRouterOutlet, IonSplitPane, setupIonicReact } from "@ionic/react"
import { IonReactRouter } from "@ionic/react-router"
import { Route } from "react-router-dom"
import { Menu } from "./components"
import { Nothing, Overview, Post, PostCollection, SearchCollection, TaxCollection } from "./pages"
import { EPostType, ETagType, WordPressApi } from "./api"

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css"

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css"
import "@ionic/react/css/structure.css"
import "@ionic/react/css/typography.css"

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css"
import "@ionic/react/css/float-elements.css"
import "@ionic/react/css/text-alignment.css"
import "@ionic/react/css/text-transformation.css"
import "@ionic/react/css/flex-utils.css"
import "@ionic/react/css/display.css"

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

import "@ionic/react/css/palettes/dark.always.css"
/* import '@ionic/react/css/palettes/dark.class.css'; */
// import "@ionic/react/css/palettes/dark.system.css"

/* Theme variables */
import "./theme/variables.css"

setupIonicReact({
	mode: "ios",
})

export const WordPressContext = createContext(new WordPressApi({ endpoint: "" }))

const App: React.FC = () => {
	return (
		<IonApp>
			<IonReactRouter>
				<IonSplitPane contentId="main">
					<Menu />
					<IonRouterOutlet id="main">
						<Route path="/" exact={true}>
							<Nothing />
						</Route>
						<Route path="/:inputURL" exact={true}>
							<Overview />
						</Route>
						<Route path="/:inputURL/post/:postID" exact={true}>
							<Post type={EPostType.Post} />
						</Route>
						<Route path="/:inputURL/search/:searchTerms" exact={true}>
							<SearchCollection />
						</Route>
						<Route path="/:inputURL/search/:searchTerms/:pageNumber" exact={true}>
							<SearchCollection />
						</Route>
						{/* Posts */}
						<Route path="/:inputURL/posts/" exact={true}>
							<PostCollection type={EPostType.Post} />
						</Route>
						<Route path="/:inputURL/posts/:pageNumber" exact={true}>
							<PostCollection type={EPostType.Post} />
						</Route>
						<Route path="/:inputURL/posts/category/:searchID" exact={true}>
							<TaxCollection type={EPostType.Post} tagType={ETagType.Category} />
						</Route>
						<Route path="/:inputURL/posts/tag/:searchID" exact={true}>
							<TaxCollection type={EPostType.Post} tagType={ETagType.Tag} />
						</Route>
						{/* Pages */}
						<Route path="/:inputURL/page/:postID" exact={true}>
							<Post type={EPostType.Page} />
						</Route>
						<Route path="/:inputURL/pages/" exact={true}>
							<PostCollection type={EPostType.Page} />
						</Route>
						<Route path="/:inputURL/pages/:pageNumber" exact={true}>
							<PostCollection type={EPostType.Page} />
						</Route>
						<Route path="/:inputURL/pages/:pageNumber" exact={true}>
							<PostCollection type={EPostType.Page} />
						</Route>
						<Route path="/:inputURL/pages/category/:searchID" exact={true}>
							<TaxCollection type={EPostType.Page} tagType={ETagType.Category} />
						</Route>
						<Route path="/:inputURL/pages/tag/:searchID" exact={true}>
							<TaxCollection type={EPostType.Page} tagType={ETagType.Tag} />
						</Route>
					</IonRouterOutlet>
				</IonSplitPane>
			</IonReactRouter>
		</IonApp>
	)
}

export default App
