import * as fs from 'fs';
import * as path from 'path';

const logFileName = "sparkdesk_web/log/session_log.json";

export function decode(text: string): string {
    try {
        let decodedData = ''
        if (text.length > 4) {
            const arr = text.split('\n\n')
            arr.forEach(item => {
                decodedData += Buffer.from(item.trim(), 'base64').toString('utf-8');
            })
        } else {
            decodedData = Buffer.from(text, 'base64').toString('utf-8');
        }
        return decodedData;
    } catch (e) {
        return '';
    }
}

export function loadLog(): [boolean, string] {
    try {
        const logFilePath = path.join(__dirname, logFileName);
        const logData = JSON.parse(fs.readFileSync(logFilePath, 'utf-8'));
        const chatId = logData["chat_id"];
        return [true, chatId];
    } catch {
        return [false, ""];
    }
}

export function saveLog(chatId: string): void {
    const sessionLog = { "chat_id": chatId };
    const logFilePath = path.join(__dirname, logFileName);
    fs.writeFileSync(logFilePath, JSON.stringify(sessionLog, null, 4), 'utf-8');
}

export function checkDirPath(path: string): boolean {
    try {
        // 使用 fs.statSync 获取文件/目录信息
        const stats = fs.statSync(path);
        return stats.isDirectory();
    } catch (error) {
        // 如果出现异常，说明文件/目录不存在
        return false;
    }
}

export function write2json(filePath: string, jsonData: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
        try {
            // 使用 fs.writeFile 写入 JSON 数据到文件
            fs.writeFile(filePath, jsonData, 'utf-8', (err) => {
                if (err) {
                    console.error('Error writing JSON file:', err);
                    reject(false);
                } else {
                    console.log(`JSON data written to ${filePath}`);
                    resolve(true);
                }
            });
        } catch (error) {
            // 如果出现异常，说明文件/目录不存在
            reject(false);
        }
    });
}
