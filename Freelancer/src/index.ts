import 'dotenv/config'
import type { Express } from 'express'
import express from 'express'
import bodyParser from 'body-parser'
import http from 'http'
import path from 'path'
import { mergeControllers } from './controllers'
import { connectMongoDB } from './utils/mongoDB'

class Server {
    private host: string | undefined
    private port: number
    private app: Express
    private http: http.Server

    constructor(_port: number, _host?: string){
        this.port = _port;
        this.host = _host;
        this.app = express();
        this.http = new http.Server(this.app)
    }

    private applyMiddlewares(){
        // View Engine
        this.app.set('view engine', 'ejs')
        this.app.set('views', path.join(__dirname, './views'))
        this.app.use('/public', express.static(path.join(__dirname, './public')))
        // Body Parser
        var jsonParser = bodyParser.json()
        var urlencodedParser = bodyParser.urlencoded({ extended: false })
        this.app.use(jsonParser)
        this.app.use(urlencodedParser)
    }

    private async loadControllers() {
        var controllers = await mergeControllers();
        for await (const controller of controllers) {
            this.app.use(controller.path, controller.router)
        }
    }

    public async listen() {
        await connectMongoDB();
        this.applyMiddlewares();
        await this.loadControllers();
        this.http.listen({
            host: this.host,
            port: this.port
        }, () => {
            console.info(`Server running on: ${this.port}`);
        })
    }
}

const main = async () => {
    const port = Number(process.env.PORT) || 5000;
    let server = new Server(port);
    server.listen()
}

main();