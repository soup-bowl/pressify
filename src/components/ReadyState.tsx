import { ESelectorState } from "../enum"

const ReadyState: React.FC<{ state: ESelectorState }> = ({ state }) => {
	switch (state) {
		default:
		case ESelectorState.Ready:
			return <>Type a URL to check.</>
		case ESelectorState.Detecting:
			return <>Detecting REST API...</>
		case ESelectorState.Confirmed:
			return <>The URL is a valid WordPress site.</>
		case ESelectorState.Denied:
			return <>The specified URL is not a WordPress site, or has REST API access blocked.</>
	}
}

export default ReadyState
