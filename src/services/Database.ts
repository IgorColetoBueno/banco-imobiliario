export default class DatabaseManager {
  private readonly databaseName: string = "BANCO_IMOBILIARIO";
  private storeName: string;

  private indexedDB: IDBFactory =
    window["indexedDB"] ||
    window["mozIndexedDB"] ||
    window["webkitIndexedDB"] ||
    window["msIndexedDB"] ||
    window["shimIndexedDB"];

  constructor(storeName: string) {
    this.storeName = storeName;
  }

  private openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      var db: IDBOpenDBRequest;
      db = this.indexedDB.open(this.databaseName, 1);

      db.onupgradeneeded = (e:any) => {
        var db = e.target.result;
        DatabaseManager.criarStore(db, "Participantes");
      };

      db.onsuccess = (e: Event) => {
        resolve(db.result);
      };

      db.onerror = () => {
        reject(new Error("Falha ao abrir o indexedDB"));
      };
    });
  }

  public static criarStore(db: IDBDatabase, storeName) {
    if (!db.objectStoreNames.contains(storeName)) {
      db.createObjectStore(storeName, {
        autoIncrement: true,
        keyPath:"id"
      });
    }
  }

  public async salvar(obj: any): Promise<void> {
    return new Promise(async (resolve, reject) => {
      let db = await this.openDatabase();
      let transaction: IDBTransaction = db.transaction(
        [this.storeName],
        "readwrite"
      );
      var store = transaction.objectStore(this.storeName);
      //Adiciona no banco de dados
      store.put(obj);
      transaction.oncomplete = function() {
        db.close();
        resolve();
      };

      transaction.onerror = () => {
        reject();
      };
    });
  }

  public obterTodos(mapper?: Function): Promise<Array<any>> {
    return new Promise(async (resolve, reject) => {
      debugger;
      const db = await this.openDatabase();
      const transaction: IDBTransaction = db.transaction(
        [this.storeName],
        "readonly"
      );
      let results: any[] = [];

      const store = transaction.objectStore(this.storeName);
      const cursor = store.openCursor() as IDBRequest;

      cursor.onsuccess = (ev: any) => {
        const response: IDBCursorWithValue = ev.target.result;

        if (response) {
          results.push(response.value as any);
          response.continue();
        }
      };

      transaction.oncomplete = function() {
        if (mapper) {
          resolve(mapper(results));
          return;
        }
        resolve(results);
        db.close();
      };
    });
  }

  //   public obterNumeroDeRegistros(
  //     obj: any,
  //     indexBusca: string,
  //     cb: Function,
  //     err?: any
  //   ) {
  //     this.openDatabase((connection: IDBOpenDBRequest) => {
  //       let db: any = connection.result;
  //       let transaction: IDBTransaction = db.transaction(
  //         obj.this.storeName,

  //         IDBTransaction.READ_ONLY
  //       );
  //       var store = transaction.objectStore(obj.this.storeName);
  //       //Pega cursores do banco de dados
  //       var index = store.index(indexBusca);
  //       var countRequest = index.count();

  //       countRequest.onsuccess = () => {
  //         cb(countRequest.result);
  //       };
  //     });
  //   }

  //   public obterTodosPorIndice(obj: any, busca: any, cb: Function, err?: any) {
  //     this.openDatabase((connection: IDBOpenDBRequest) => {
  //       var results: Array<any> = [];
  //       let db: any = connection.result;
  //       let transaction: IDBTransaction = db.transaction(
  //         obj.this.storeName,

  //         IDBTransaction.READ_ONLY
  //       );
  //       var store = transaction.objectStore(obj.this.storeName);
  //       var index = store.index(String(busca.indice));
  //       var request = index.openCursor(IDBKeyRange.only(busca.valor));

  //       request.onsuccess = () => {
  //         var cursor: IDBCursorWithValue = request.result;
  //         if (cursor) {
  //           results.push(cursor.value as any);
  //           cursor.continue();
  //         }
  //       };
  //       transaction.oncomplete = () => {
  //         cb(results);
  //         db.close();
  //       };
  //     });
  //   }

  public obterUm(id: number): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const db = await this.openDatabase();
      let transaction: IDBTransaction = db.transaction(
        [this.storeName],
        "readonly"
      );
      var store = transaction.objectStore(this.storeName);
      let value = null;
      //Pega cursores do banco de dados
      var request = store.get(id) as IDBRequest;

      request.onsuccess = () => {
        value = request.result;
      };

      transaction.oncomplete = function() {
        db.close();
        resolve(value);
      };
    });
  }
  public remover(id: number): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const db = await this.openDatabase();

      let transaction: IDBTransaction = db.transaction(
        [this.storeName],
        "readwrite"
      );
      var store = transaction.objectStore(this.storeName);
      //Pega cursores do banco de dados

      store.delete(id);

      transaction.oncomplete = function() {
        db.close();
        resolve();
      };

      transaction.onerror = () => {
        reject();
      };
    });
  }

  public limparDados(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const db = await this.openDatabase();
      let transaction: IDBTransaction = db.transaction(
        [this.storeName],
        "readwrite"
      );
      var store = transaction.objectStore(this.storeName);
      store.clear();

      transaction.oncomplete = function() {
        resolve();
      };

      transaction.onerror = function() {
        reject();
      };
    });
  }
}
