import moment from 'moment'
import chalk from 'chalk'
import { LoggerColors } from '../types/berp'
import { berpConsole } from '../berp/index'

export class Logger {
  private _manager: string
  private _color: LoggerColors | string
  private _chalkColor: chalk.Chalk
  constructor(manager: string, color?: string) {
    this._manager = manager
    this._color = color || 'cyan'
    this._assignChalkColor()
  }
  private _assignChalkColor(): void {
    if (this._color.startsWith("#")) {
      this._chalkColor = chalk.hex(this._color)
    } else {
      this._chalkColor = chalk[this._color]
    }
  }
  public changeColor(newColor: LoggerColors): void {
    this._color = newColor
    this._assignChalkColor()
  }
  /**
   * Use hex color for console instead
   * 
   * `EG: #ff69b4`
   */
  public useHex(newColor: string): void {
    this._color = newColor
    this._assignChalkColor()
  }
  public info(...content: unknown[]): void {
    console.debug(`${chalk.gray(moment().format("<MM/DD/YY hh:mm:ss>"))} ${this._chalkColor(`[${this._manager}]`)} ${chalk.cyan("[Info]")}`, ...content)
    berpConsole.emit("ConsoleOut", {
      type: "info",
      content: content,
      manager: this._manager,
      color: this._color,
    })
  }
  public success(...content: unknown[]): void {
    console.debug(`${chalk.gray(moment().format("<MM/DD/YY hh:mm:ss>"))} ${this._chalkColor(`[${this._manager}]`)} ${chalk.green("[Success]")}`, ...content)
    berpConsole.emit("ConsoleOut", {
      type: "success",
      content: content,
      manager: this._manager,
      color: this._color,
    })
  }
  public warn(...content: unknown[]): void {
    console.debug(`${chalk.gray(moment().format("<MM/DD/YY hh:mm:ss>"))} ${this._chalkColor(`[${this._manager}]`)} ${chalk.yellow("[Warn]")}`, ...content)
    berpConsole.emit("ConsoleOut", {
      type: "warn",
      content: content,
      manager: this._manager,
      color: this._color,
    })
  }
  public error(...content: unknown[]): void {
    console.debug(`${chalk.gray(moment().format("<MM/DD/YY hh:mm:ss>"))} ${this._chalkColor(`[${this._manager}]`)} ${chalk.red("[Error]")}`, ...content)
    berpConsole.emit("ConsoleOut", {
      type: "error",
      content: content,
      manager: this._manager,
      color: this._color,
    })
  }
  public debug(...content: unknown[]): void {
    console.debug(`${chalk.gray(moment().format("<MM/DD/YY hh:mm:ss>"))} ${this._chalkColor(`[${this._manager}]`)} ${chalk.magenta("[Debug]")}`, ...content)
    berpConsole.emit("ConsoleOut", {
      type: "debug",
      content: content,
      manager: this._manager,
      color: this._color,
    })
  }
}
