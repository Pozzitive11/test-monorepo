export interface WebSocketCommandModel {
  command: string,
  filename: string
}

export const isWebSocketCommandModel = (val: any): val is WebSocketCommandModel => (
  val.command != undefined && val.filename != undefined
)
