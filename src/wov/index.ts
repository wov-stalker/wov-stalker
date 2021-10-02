import { WolvesvilleAPI } from "./api"

let wov = new WolvesvilleAPI(
    "https://api-core.wolvesville.com",
    "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword",
    "AIzaSyCH9qHx3eLCfXqodcKKBshE9BKfTLAioRo", // this is wolvesville apps id
)

export default wov