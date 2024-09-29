import { createContext } from "react"
import { IonApp, IonRouterOutlet, IonSplitPane, setupIonicReact } from "@ionic/react"
import { IonReactRouter } from "@ionic/react-router"
import { Route } from "react-router-dom"
import { Menu } from "./components"
import { Nothing, Overview } from "./pages"
import { WordPressApi } from "./api"

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
					</IonRouterOutlet>
				</IonSplitPane>
			</IonReactRouter>
		</IonApp>
	)
}

export default App
