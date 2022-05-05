import fs from "fs"

export const fileHandler = (path: string): Promise<string> => new Promise((resolve, reject) =>
    fs.readFile(path, (err, data) => {
        if(err) {
            reject(err)
        } else {
            resolve(data.toString())
        }
    }))

export const fileWriter = (path: string, updatedActivity): void => {
    const x = fs.readFileSync(path).toString();
    const x_json = JSON.parse(x);
    const filtered = x_json.filter(activity => activity.id != updatedActivity.id);
    const updated  = filtered.concat(updatedActivity);
    const jsonStr  = JSON.stringify(updated, null, 2);
    fs.writeFile(path, jsonStr, (err) => {
        if (err) {
            console.log("ERROR: updating jsonfile,", err);
        }
    });
}
