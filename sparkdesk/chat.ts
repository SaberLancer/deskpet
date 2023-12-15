import SparkWeb from './core';

export function chat(position: any, _cookie: any, _fd: any, _GtToken: any, _chat_id: any, win: any) {

    const sparkWeb = new SparkWeb(
        {
            cookie: _cookie,
            fd: _fd,
            GtToken: _GtToken,
            ChatID: _chat_id,
            win: win
        }
    )

    const chat = sparkWeb.createContinuousChat()
    chat.chat(position)
}

export async function getcChatId(_cookie: any, _fd: any, _GtToken: any) {

    const sparkWeb = new SparkWeb(
        {
            cookie: _cookie,
            fd: _fd,
            GtToken: _GtToken
        }
    )

    return await sparkWeb.generateChatID()
}

