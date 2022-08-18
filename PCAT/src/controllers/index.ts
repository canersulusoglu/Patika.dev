import { promises as fs} from 'fs'
import Path from 'path'

export const mergeControllers = async () => {
    const path = Path.join(__dirname)
    var mergedControllers: Array<any> = [];
    const files = await fs.readdir(path);
    const controllerFiles = files.filter(x => x.split('.').length === 3 && x.split('.').includes('controller'))
    for(var file of controllerFiles){
        const modulePath = Path.join(__dirname, file);
        const module = await import(modulePath);
        mergedControllers.push(module.default)
    }
    return mergedControllers;
}