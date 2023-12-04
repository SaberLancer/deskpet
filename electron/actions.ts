import fs from "fs";

const FOLDER_PATH = '/Users/hukuangyin/Desktop/foods/'; // 替换为您要获取文件列表的文件夹路径
let files: string[] = [];
/**
 * 吃饭
 */
async function eat() {
    try {
        files = fs.readdirSync(FOLDER_PATH);
        await fs.unlinkSync(FOLDER_PATH + files.shift());
        console.log("文件删除成功");
    } catch (err) {
        console.error(`无法删除文件: ${err}`);
    }
}

export { eat }
