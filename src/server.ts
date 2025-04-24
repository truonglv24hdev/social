import 'dotenv/config'
import { IndexRoute } from './modules/index'
import App from './app'
import { validateEnv } from './core/utils'
import { UserRoute } from './modules/user'
import { AuthRoute } from './modules/auth'
import { ProfileRoute } from './modules/profile'
import { PostRoute } from './modules/post'

validateEnv()
const routes = [new IndexRoute(), new UserRoute(), new AuthRoute(), new ProfileRoute(), new PostRoute()]
const app = new App(routes)
app.listen()