import {
  BerpConsole,
  Logger,
} from '../console'
import {
  SequentialBucket,
  Request,
} from './http'
import { EventEmitter } from 'events'
import { AttemptProtocolCompiler } from './utils'
import { NetworkManager } from './network'
import { AuthHandler } from './auth'
import { PluginManager } from './plugin/PluginManager'
import { resolve } from 'path'
import * as Constants from '../Constants'
import { CommandManager } from './command/CommandManager'
import { v4 } from 'uuid'

export class BeRP {
  private _console: BerpConsole
  private _networkManager: NetworkManager
  private _authProvider: AuthHandler
  private _sequentialBucket: SequentialBucket
  private _commandManager: CommandManager
  private _pluginManager: PluginManager
  private _logger = new Logger('BeRP', '#6990ff')
  constructor() {
    this._logger.info("Preparing Modules...")
    AttemptProtocolCompiler()

    this._networkManager = new NetworkManager(this)
    this._sequentialBucket = new SequentialBucket(5, new Logger("Sequential Bucket", "#8769ff"))
    this._authProvider = new AuthHandler({
      clientId: Constants.AzureClientID,
      authority: Constants.Endpoints.Authorities.MSAL,
      cacheDir: resolve(process.cwd(), 'msal-cache'),
    })
    this._authProvider.createApp(this._authProvider.createConfig())
    this._commandManager = new CommandManager(this)
    this._pluginManager = new PluginManager(this)
    this._console = new BerpConsole()
  }
  public getConsole(): BerpConsole { return this._console }
  public getLogger(): Logger { return this._logger }
  public getNetworkManager(): NetworkManager { return this._networkManager }
  public getAuthProvider(): AuthHandler { return this._authProvider }
  public getSequentialBucket(): SequentialBucket { return this._sequentialBucket }
  public getCommandManager(): CommandManager { return this._commandManager }
  public getPluginManager(): PluginManager { return this._pluginManager }
  public Request = Request
}

class ConsoleOutput extends EventEmitter {  
  private _listeners = new Map<string, any>()

  constructor() {
    super()
    this.on("ConsoleOut", (data) => {
      for (const [, l] of this._listeners) {
        l(data)
      }
    })
  }
  public out(Callback: (data: {type: string, content: any, manager: string, color: string}) => void): void {
    this._listeners.set(`${v4()}`, Callback)
  }
}

const berpConsole = new ConsoleOutput()

export {
  berpConsole,
}
