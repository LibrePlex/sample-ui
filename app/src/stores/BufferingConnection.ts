import { PublicKey, Connection } from "@solana/web3.js";

/* 
    this class exists to buffer rpc calls
    which means that you can make multiple 
    individual fetches. 

    instead of calling getAccountInfo N times, 
    this class will bundle those calls into groups
    (max 100 as allowed by getMultipleAccountInfo())
    and then resolve the promises individually 
*/

export class BufferingConnection {
  static rpcBuffers: { [key: string]: BufferingConnection } = {};
  private accountRequests: {
    accountId: PublicKey;
    cb: (a: { data: Buffer | null; accountId: PublicKey }) => any;
  }[];
  private connection: Connection;
  private firstPendingTimestamp: number | null;
  private timeout: NodeJS.Timeout | null;
  private processing: boolean;

  public static getOrCreate( connection: Connection) {
    if (!BufferingConnection.rpcBuffers[connection.rpcEndpoint]) {
        BufferingConnection.rpcBuffers[connection.rpcEndpoint] = new BufferingConnection(
        connection
      );
    }
    return BufferingConnection.rpcBuffers[connection.rpcEndpoint];
  }

  private constructor(connection: Connection) {
    this.accountRequests = [];
    this.timeout = null;
    this.connection = connection;
    this.processing = false;
    this.firstPendingTimestamp = null;
  }

  public flushAccounts = async () => {
    this.processing = true;
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
      this.firstPendingTimestamp = null;
    }
    const requests = [...this.accountRequests];

    this.accountRequests.length = 0;

    const remainingRequests = [...requests];

    while (remainingRequests.length > 0) {
      const batchRequests = remainingRequests.splice(0, 100);
      try {
        const accountData = await this.connection.getMultipleAccountsInfo(
          batchRequests.map((item) => item.accountId)
        );
        for (const [idx, a] of accountData.entries()) {
          if (a) {
            batchRequests[idx].cb({
              accountId: batchRequests[idx].accountId,
              data: a.data,
            });
          } else {
            batchRequests[idx].cb({
              accountId: batchRequests[idx].accountId,
              data: null,
            });
          }
        }
      } catch (e) {
        for (const id of batchRequests) {
          // console.log("Rejecting all", e);
          id.cb({
            accountId: id.accountId,
            data: null,
          });
        }
      }
    }

    this.timeout = null;
    this.processing = false;
    // if new stuff has come in since then, set the timeout
    this.scheduleFlush();
  };

  public scheduleFlush = () => {
    if (!this.processing) {
      const currentTimestamp = new Date().getTime();
      // console.log({ p: this.firstPendingTimestamp });
      if (this.firstPendingTimestamp) {
        const timeSinceLastFlush =
          currentTimestamp - this.firstPendingTimestamp;

        if (this.timeout) {
          clearTimeout(this.timeout);
        }
        if (timeSinceLastFlush < 250) {
          // console.log("Setting flush timeout");
          this.timeout = setTimeout(
            this.flushAccounts,
            250 - timeSinceLastFlush
          );
        } else {
          // console.log("Flushing");
          this.flushAccounts();
        }
      }
    }
  };

  public getMultipleAccountsInfo = async (accountIds: PublicKey[]) => {
    const promises = accountIds.map((item) => this.fetchAccountData(item));
    return Promise.all(promises);
  };

  public fetchAccountData = async (accountId: PublicKey) => {
    const currentTimestamp = new Date().getTime();

    // console.log({ currentTimestamp, fs: this.firstPendingTimestamp });

    if (!this.firstPendingTimestamp) {
      this.firstPendingTimestamp = currentTimestamp;
    }

    const promise = new Promise<{ accountId: PublicKey; data: Buffer | null }>((resolve, reject) => {
      const cb = (val: { accountId: PublicKey; data: Buffer | null }) => {
        resolve(val);
      };

      this.accountRequests.push({ accountId, cb });
    });

    // console.log("Calling schedule flush");
    /// processing will kick off another flush at the end if needed - hence no need to worry
    this.scheduleFlush();
    return promise
  };
}
