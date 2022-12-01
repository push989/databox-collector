/** Custom typings for the Databox lib */
declare module "databox" {
  export default class Databox {
    constructor(options: { push_token: string });
    push(opts: Databox.PushRequest, cb: (result: Databox.PushResponse) => void);
    insertAll(
      opts: Array<Databox.PushResponse>,
      cb: (result: Databox.PushResponse) => void
    );
  }

  export interface PushRequest {
    key: string;
    value: number;
    date?: string;
  }
  export interface PushResponse {
    status: string;
    message?: string;
  }
}
