import fs from "fs"

export const fileHandler = (path: string): Promise<string> => new Promise((resolve, reject) =>
    fs.readFile(path, (err, data) => {
        if(err) {
            reject(err)
        } else {
            resolve(data.toString())
        }
    }))