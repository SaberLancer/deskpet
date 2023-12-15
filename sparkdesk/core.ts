import axios, { AxiosResponse } from 'axios';
import { createChatHeader, createRequestHeader } from './web';  // 请根据你的实际项目结构调整路径
// import { checkDirPath, write2json, decode } from './utils';  // 请根据你的实际项目结构调整路径和函数名
import { decode } from './utils';  // 请根据你的实际项目结构调整路径和函数名


const NEW_CHAT = "SparkDesk AI chat";

interface SparkWebOptions {
    cookie: string;
    fd: string;
    GtToken: string;
    ChatID?: string;
    win?: any
}

class SparkWeb {
    private fd: string;
    private GtToken: string;
    private chatHeader: any; // Adjust the type as per your requirements
    private requestHeader: any; // Adjust the type as per your requirements
    private chatID: string;
    // private chatHistory: any[]; // Adjust the type as per your requirements
    private win: any

    constructor(options: SparkWebOptions) {
        this.fd = options.fd;
        this.GtToken = options.GtToken;
        this.chatHeader = createChatHeader(options.cookie);
        this.requestHeader = createRequestHeader(options.cookie);
        this.chatID = options.ChatID || '';
        this.win = options.win
        // this.chatHistory = [];
    }

    public async generateChatID(): Promise<string> {
        return new Promise(async (resolve) => {
            if (this.chatID === "") {
                const url = 'https://xinghuo.xfyun.cn/iflygpt/u/chat-list/v1/create-chat-list';
                const payload = "{}";
                const response = await axios.post(url, payload, { headers: this.requestHeader });
                const responseData = response.data;
                if (responseData.code === 0) {
                    const chatListID = responseData.data.id;
                    resolve(chatListID)
                } else {
                    resolve('0')
                }
            } else {
                resolve(this.chatID)
            }
        });

    }

    private async setName(chatName: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const url = "https://xinghuo.xfyun.cn/iflygpt/u/chat-list/v1/rename-chat-list";
            const chatListName = chatName.slice(0, 15);
            const payload = {
                chatListId: this.chatID,
                chatListName: chatListName,
            };
            const response = await axios.post(url, payload, { headers: this.requestHeader });
            const responseData = response.data;
            if (responseData.code !== 0) {
                console.log('\nERROR: Failed to initialize session name. Please reset Cookie, fd, and GtToken');
                reject();
                process.exit(-1);
            } else {
                resolve();
            }
        });

    }

    private async createChat(chatName: string): Promise<void> {
        return new Promise(async (resolve) => {
            this.chatID = await this.generateChatID();
            await this.setName(chatName);
            resolve();
        });

    }

    private async getChatSID(): Promise<string> {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await this.getChatHistory()
                const data = response.data;
                resolve(data.data[data.data.length - 1]?.historyList[data.data[data.data.length - 1].historyList.length - 1]?.sid)
            } catch (error) {
                reject('')
            }
        });

    }

    private async getChatHistory(): Promise<AxiosResponse> {
        const url = `https://xinghuo.xfyun.cn/iflygpt/u/chat_history/all/${this.chatID}`;
        return axios.get(url, { headers: this.requestHeader });
    }

    private async getResponse(question: string): Promise<AxiosResponse> {
        const sid = await this.getChatSID();
        const url = "https://xinghuo.xfyun.cn/iflygpt-chat/u/chat_message/chat";
        const payload = {
            fd: this.fd,
            clientType: '1',
            sid: sid,
            chatId: this.chatID,
            text: question,
            GtToken: this.GtToken,
        };

        const config: any = {
            headers: this.chatHeader,
            responseType: 'stream'
        };
        return axios.post(url, payload, config);
    }

    public async streamingOutput(question: string): Promise<[string, boolean]> {
        let responseText = '';
        return new Promise((resolve, reject) => {
            this.getResponse(question).then((response) => {
                response.data.on('data', (chunk: any) => {
                    const line = chunk.toString('utf-8')
                    if (line) {
                        let encodedData = line.replace(/data:/g, "");
                        const missingPadding = encodedData.length % 4;
                        if (missingPadding !== 0) {
                            encodedData += '='.repeat(4 - missingPadding);
                        }
                        if (decode(encodedData) !== 'zw' && encodedData !== '<end>' && !encodedData.includes("<sid>")) {
                            const answer = decode(encodedData).replace('\n\n', '\n');
                            responseText += answer;
                            try {
                                this.win?.webContents.send('chat-continue', answer.toString())
                            } catch (error) {
                                reject()
                            }
                        }
                    }
                });
                response.data.on('end', () => {
                    // 数据接收完成的逻辑
                    try {
                        this.win?.webContents.send('chat-end')
                    } catch (error) {
                        reject()
                    }
                    if (!responseText) {
                        resolve(['', false])
                        return ['', false];
                    }
                    resolve([responseText, true])
                    return [responseText, true];
                });
            })
        })
    }

    public async *continuousChatGen(): AsyncGenerator<string | undefined, string, string> {
        await this.createChat(NEW_CHAT);
        let count = 0;
        while (true) {
            count += 1;
            const question = yield;
            const resp = await this.streamingOutput(question);
            // If False, regenerate the chat
            if (!resp[1]) {
                console.log("WARNING: 可能触发敏感词监控，对话已被重置，请前往Web页面更新Cookie、fd、GtToken！");
            }
            yield resp[0];
        }
    }

    public createContinuousChat() {
        const gen = this.continuousChatGen();
        gen.next();

        const chatMethod = async (question: string) => {
            const result = await gen.next(question);
            return result.value;
        };

        return { chat: chatMethod };
    }

    public async chat(question: string): Promise<string> {
        this.createChat(NEW_CHAT);
        const response = await this.getResponse(question);
        let responseText = '';
        response.data.split('\n').forEach((line: any) => {
            if (line) {
                let encodedData = line.slice("data:".length);
                const missingPadding = encodedData.length % 4;
                if (missingPadding !== 0) {
                    encodedData += '='.repeat(4 - missingPadding);
                }
                if (decode(encodedData) !== 'zw') {
                    const answer = decode(encodedData).replace('\n\n', '\n');
                    // process.stdout.write(answer);
                    responseText += answer;
                }
            }
        });
        return responseText;
    }

    // public chatStream(history = false, historyPath = './history/'): void {
    //     let historyFilePath = '';
    //     if (history) {
    //         checkDirPath(historyPath);
    //         historyFilePath = path.join(
    //             historyPath,
    //             `history_${new Date().toISOString().replace(/[-:.]/g, '').replace('T', '_').split('.')[0]}.json`
    //         );
    //     }
    //     try {
    //         this.createChat(NEW_CHAT);
    //         console.log("Enter exit or stop to end the conversation.\n");
    //         let count = 0;
    //         while (true) {
    //             count += 1;
    //             const question = readlineSync.question("Ask: ");
    //             if (question === 'exit' || question === 'stop') {
    //                 break;
    //             }
    //             const resp = this.streamingOutput(question);
    //             // If False, regenerate the chat
    //             if (!resp[1]) {
    //                 console.log("WARNING: 可能触发敏感词监控，对话已被重置，请前往Web页面更新Cookie、fd、GtToken！");
    //             }
    //             if (history) {
    //                 this.chatHistory.push({
    //                     time: new Date().toISOString(),
    //                     question: question,
    //                     answer: resp[0] || '触发敏感词监控'
    //                 });
    //             }
    //         }
    //     } finally {
    //         if (history) {
    //             write2json(historyFilePath, this.chatHistory);
    //         }
    //         console.log("\nThank you for using the SparkDesk AI. Welcome to use it again!");
    //     }
    // }
}

export default SparkWeb;
