/* eslint-disable prefer-rest-params */
import fs from 'fs'
import { resolve } from 'path'
import { format } from 'util'

/**
 * Overrides basic console methods
 * @param dir Directory To Store Log History In
 */
export const overrideProcessConsole = (dir: string): void => {
  const lastSessionFile = resolve(dir, 'last-session.log')
  const combinedFile = resolve(dir, 'combined.log')

  fs.mkdirSync(dir, { recursive: true })
  const lastSessionStream = fs.createWriteStream(lastSessionFile)
  const combinedStream = fs.createWriteStream(combinedFile, { flags: "a" })

  function write(item: string): void {
    lastSessionStream.write(item)
    combinedStream.write(item)
  }
  function closeStreams(): void {
    lastSessionStream.close()
    combinedStream.close()
  }

  process.once('beforeExit', () => {
    closeStreams()
  })
  console.debug = function(): void {
    write((format.apply(this, arguments))
      .replace(/\u001b\[.*?m/g, "") + "\n")
  }
}
