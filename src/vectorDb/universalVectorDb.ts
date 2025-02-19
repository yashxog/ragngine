// import { NeonPostgres } from "@langchain/community/vectorstores/neon";
// import { BaseVectorDb } from "../interfaces/interface";
// import { VectorDbConfig } from "../types/config";
// import { NeonPGVectorDb } from "./neonPg/neonPg";

// export class VectorDbNgine {
//     private config: BaseVectorDb;
//     private vectorDb: NeonPGVectorDb;
//     constructor(config: BaseVectorDb) {

//         this.config = config

//         this.validateInput(config);

//         const dbProvider = config.dbProvider;


//         switch(dbProvider.toLowerCase()) {
//             case "neonpg":
//                this.vectorDb = new NeonPGVectorDb(config);
//                break;
//             default:
//                 throw new Error(`vector Database provider ${dbProvider} not supported`)
//         }
        
//     }

//     validateInput(config: BaseVectorDb) {

//         if(!config.dbProvider || !config.connectionString || !config.tableName) {
//             throw new Error("please provide dbProvider and connectionString and tableName");
//         }
//     }

//     async initRagVectorDb() {
//         try {
//             const vectorDb = await this.vectorDb.createVectorDb();
//             return vectorDb;
//         } catch (error) {
//             throw error;
//         }
//     }
// }